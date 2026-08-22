import traceback
from datetime import datetime

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import SocraticSession, SocraticMessage
from services.socratic_ai import (
    get_socratic_opening,
    get_socratic_response,
    analyze_answer_and_challenge,
    get_next_hint,
    evaluate_defense,
    get_misconceptions,
    DEFAULT_TOPIC,
    DEFAULT_PROBLEM_STATEMENT,
    DEFAULT_CONCEPTS,
)

socratic_bp = Blueprint("socratic", __name__, url_prefix="/api/socratic")


@socratic_bp.route("/options", methods=["GET"])
def options():
    """Powers a future 'choose your topic' screen. Safe defaults for now."""
    return jsonify({
        "default_topic": DEFAULT_TOPIC,
        "default_problem_statement": DEFAULT_PROBLEM_STATEMENT,
        "default_concepts": DEFAULT_CONCEPTS,
    }), 200


@socratic_bp.route("/start", methods=["POST"])
@jwt_required()
def start_session():
    user_id = get_jwt_identity()
    data = request.get_json(force=True) or {}

    topic = (data.get("topic") or DEFAULT_TOPIC).strip()
    problem_statement = (data.get("problem_statement") or DEFAULT_PROBLEM_STATEMENT).strip()
    concepts = data.get("concepts") or DEFAULT_CONCEPTS
    if not isinstance(concepts, list) or not concepts:
        concepts = DEFAULT_CONCEPTS

    session = SocraticSession(user_id=user_id, topic=topic, problem_statement=problem_statement)
    session.set_concepts(concepts)
    # "Problem Understanding" (or whatever the first concept is called) starts unlocked,
    # mirroring the frontend's initial state.
    session.set_concepts_unlocked([concepts[0]])
    db.session.add(session)
    db.session.commit()

    try:
        result = get_socratic_opening(topic, problem_statement, concepts)
    except Exception:
        print("=== ERROR IN get_socratic_opening ===")
        traceback.print_exc()
        result = {
            "reply": f"Let's explore {topic} together. How would you intuitively approach this problem?",
            "tag": "Socratic Inquiry",
            "concept_unlocked": None,
        }

    opening_msg = SocraticMessage(
        session_id=session.id, sender="ai", content=result["reply"],
        tag=result.get("tag"), concept_unlocked=None,
    )
    db.session.add(opening_msg)
    db.session.commit()

    return jsonify({
        "session": session.to_dict(),
        "message": opening_msg.to_dict(),
    }), 201


@socratic_bp.route("/<session_id>/answer", methods=["POST"])
@jwt_required()
def submit_answer(session_id):
    """
    Pipeline step 1: 'Student submits answer'.
    Immediately triggers steps 2 & 3 ('AI checks reasoning' -> 'AI creates a challenge')
    and returns the resulting challenge. This is the endpoint the frontend should call
    for the "Your Answer" stage of the Answer -> Challenge -> Defense flow.
    """
    user_id = get_jwt_identity()
    data = request.get_json(force=True) or {}
    answer_text = (data.get("answer") or data.get("content") or "").strip()

    if not answer_text:
        return jsonify({"error": "Answer text is required."}), 400

    session = SocraticSession.query.filter_by(id=session_id, user_id=user_id).first()
    if not session:
        return jsonify({"error": "Socratic session not found."}), 404
    if session.status != "in_progress":
        return jsonify({"error": "This session has already ended."}), 400
    if session.stage == "challenge_issued":
        return jsonify({
            "error": "A challenge is already pending — submit your defense before answering again.",
            "current_challenge": session.current_challenge,
        }), 400

    user_msg = SocraticMessage(session_id=session.id, sender="user", content=answer_text, tag="Answer")
    db.session.add(user_msg)
    db.session.commit()

    history = [{"sender": m.sender, "content": m.content} for m in session.messages]
    concepts = session.get_concepts()
    concepts_unlocked = session.get_concepts_unlocked()

    try:
        result = analyze_answer_and_challenge(
            session.topic, session.problem_statement, concepts, concepts_unlocked, answer_text, history
        )
    except Exception:
        print("=== ERROR IN analyze_answer_and_challenge ===")
        traceback.print_exc()
        result = {
            "reply": "Walk me through your reasoning a bit more — what specific case would break this approach?",
            "tag": "Challenge",
            "concept_unlocked": None,
        }

    newly_unlocked = result.get("concept_unlocked")
    if newly_unlocked and newly_unlocked in concepts and newly_unlocked not in concepts_unlocked:
        concepts_unlocked.append(newly_unlocked)
        session.set_concepts_unlocked(concepts_unlocked)
        # small mastery bump every time a new concept is genuinely unlocked
        session.mastery_score = min(100, (session.mastery_score or 0) + 15)
    else:
        newly_unlocked = None

    ai_msg = SocraticMessage(
        session_id=session.id, sender="ai", content=result["reply"],
        tag="Challenge", concept_unlocked=newly_unlocked,
    )
    db.session.add(ai_msg)

    session.last_student_answer = answer_text
    session.current_challenge = result["reply"]
    session.stage = "challenge_issued"
    db.session.commit()

    return jsonify({
        "message": ai_msg.to_dict(),
        "challenge": session.current_challenge,
        "stage": session.stage,
        "concept_unlocked": newly_unlocked,
        "concepts_unlocked": session.get_concepts_unlocked(),
        "mastery_score": session.mastery_score,
    }), 200


@socratic_bp.route("/<session_id>/message", methods=["POST"])
@jwt_required()
def send_message(session_id):
    """
    Optional free-form back-and-forth (e.g. the student wants to clarify or push back
    on the current challenge before formally defending it). This does NOT advance the
    Answer -> Challenge -> Defense pipeline stage — only /answer and /defense do.
    """
    user_id = get_jwt_identity()
    data = request.get_json(force=True) or {}
    content = (data.get("content") or data.get("message") or "").strip()

    if not content:
        return jsonify({"error": "Message content is required."}), 400

    session = SocraticSession.query.filter_by(id=session_id, user_id=user_id).first()
    if not session:
        return jsonify({"error": "Socratic session not found."}), 404
    if session.status != "in_progress":
        return jsonify({"error": "This session has already ended."}), 400

    user_msg = SocraticMessage(session_id=session.id, sender="user", content=content)
    db.session.add(user_msg)
    db.session.commit()

    history = [{"sender": m.sender, "content": m.content} for m in session.messages]
    concepts = session.get_concepts()
    concepts_unlocked = session.get_concepts_unlocked()

    try:
        result = get_socratic_response(
            session.topic, session.problem_statement, concepts, concepts_unlocked, history
        )
    except Exception:
        print("=== ERROR IN get_socratic_response ===")
        traceback.print_exc()
        result = {
            "reply": "Walk me through your reasoning a bit more — what happens as the input grows larger?",
            "tag": "Guided Probe",
            "concept_unlocked": None,
        }

    newly_unlocked = result.get("concept_unlocked")
    if newly_unlocked and newly_unlocked in concepts and newly_unlocked not in concepts_unlocked:
        concepts_unlocked.append(newly_unlocked)
        session.set_concepts_unlocked(concepts_unlocked)
        # small mastery bump every time a new concept is genuinely unlocked
        session.mastery_score = min(100, (session.mastery_score or 0) + 15)
    else:
        newly_unlocked = None

    ai_msg = SocraticMessage(
        session_id=session.id, sender="ai", content=result["reply"],
        tag=result.get("tag"), concept_unlocked=newly_unlocked,
    )
    db.session.add(ai_msg)
    db.session.commit()

    return jsonify({
        "message": ai_msg.to_dict(),
        "stage": session.stage,
        "concept_unlocked": newly_unlocked,
        "concepts_unlocked": session.get_concepts_unlocked(),
        "mastery_score": session.mastery_score,
    }), 200


@socratic_bp.route("/<session_id>/hint", methods=["POST"])
@jwt_required()
def reveal_hint(session_id):
    user_id = get_jwt_identity()
    session = SocraticSession.query.filter_by(id=session_id, user_id=user_id).first()
    if not session:
        return jsonify({"error": "Socratic session not found."}), 404

    try:
        hint = get_next_hint(session.topic, session.problem_statement, session.hint_level)
    except Exception:
        print("=== ERROR IN get_next_hint ===")
        traceback.print_exc()
        hint = None

    if hint is None:
        return jsonify({"error": "No more hints available.", "hint_level": session.hint_level}), 400

    session.hint_level = (session.hint_level or 0) + 1
    db.session.commit()

    return jsonify({"hint": hint, "hint_level": session.hint_level}), 200


@socratic_bp.route("/<session_id>/defense", methods=["POST"])
@jwt_required()
def submit_defense(session_id):
    """
    Pipeline steps 4 & 5: 'Student defends the answer' -> 'AI evaluates defense'.
    Requires a challenge to already be pending (i.e. /answer was called first),
    and evaluates the defense specifically against that challenge. On completion,
    the stage cycles back to awaiting_answer so the next round can begin.
    """
    user_id = get_jwt_identity()
    data = request.get_json(force=True) or {}
    defense_text = (data.get("defense_text") or data.get("content") or "").strip()

    if not defense_text:
        return jsonify({"error": "Defense text is required."}), 400

    session = SocraticSession.query.filter_by(id=session_id, user_id=user_id).first()
    if not session:
        return jsonify({"error": "Socratic session not found."}), 404
    if session.status != "in_progress":
        return jsonify({"error": "This session has already ended."}), 400
    if session.stage != "challenge_issued":
        return jsonify({"error": "There's no active challenge to defend yet — submit an answer first."}), 400

    defense_msg = SocraticMessage(session_id=session.id, sender="user", content=defense_text, tag="Defense")
    db.session.add(defense_msg)
    db.session.commit()

    try:
        result = evaluate_defense(
            session.topic, session.problem_statement, defense_text,
            session.get_concepts_unlocked(), challenge_text=session.current_challenge,
        )
    except Exception:
        print("=== ERROR IN evaluate_defense ===")
        traceback.print_exc()
        result = {"verdict": "needs_work", "feedback": "Could not evaluate automatically.", "mastery_delta": 0}

    session.defense_verdict = result.get("verdict")
    session.defense_feedback = result.get("feedback")
    session.mastery_score = max(0, min(100, (session.mastery_score or 0) + int(result.get("mastery_delta", 0))))

    eval_msg = SocraticMessage(
        session_id=session.id, sender="ai", content=session.defense_feedback,
        tag=f"Evaluation: {session.defense_verdict}",
    )
    db.session.add(eval_msg)

    # Round complete — clear the pending challenge and loop back to the answer stage.
    session.current_challenge = None
    session.last_student_answer = None
    session.stage = "awaiting_answer"
    db.session.commit()

    return jsonify({
        "verdict": session.defense_verdict,
        "feedback": session.defense_feedback,
        "mastery_score": session.mastery_score,
        "stage": session.stage,
    }), 200


@socratic_bp.route("/<session_id>/end", methods=["POST"])
@jwt_required()
def end_session(session_id):
    user_id = get_jwt_identity()
    session = SocraticSession.query.filter_by(id=session_id, user_id=user_id).first()
    if not session:
        return jsonify({"error": "Socratic session not found."}), 404

    session.status = "completed"
    session.ended_at = datetime.utcnow()
    db.session.commit()

    return jsonify({"session": session.to_dict(include_messages=True)}), 200


@socratic_bp.route("/<session_id>", methods=["GET"])
@jwt_required()
def get_session(session_id):
    user_id = get_jwt_identity()
    session = SocraticSession.query.filter_by(id=session_id, user_id=user_id).first()
    if not session:
        return jsonify({"error": "Socratic session not found."}), 404
    return jsonify({"session": session.to_dict(include_messages=True)}), 200


@socratic_bp.route("/history", methods=["GET"])
@jwt_required()
def history():
    user_id = get_jwt_identity()
    sessions = (
        SocraticSession.query.filter_by(user_id=user_id)
        .order_by(SocraticSession.started_at.desc())
        .all()
    )
    return jsonify({"sessions": [s.to_dict() for s in sessions]}), 200


@socratic_bp.route("/misconceptions", methods=["GET"])
@jwt_required()
def misconceptions():
    topic = request.args.get("topic", DEFAULT_TOPIC)
    try:
        data = get_misconceptions(topic)
    except Exception:
        print("=== ERROR IN get_misconceptions ===")
        traceback.print_exc()
        data = []
    return jsonify({"misconceptions": data}), 200


@socratic_bp.route("/analysis", methods=["GET"])
@jwt_required()
def get_socratic_analysis():
    """
    Evaluates the most recent session and returns metrics 
    matching the frontend SocraticAnalysisPage type requirements.
    """
    user_id = get_jwt_identity()
    
    # Fetch the latest session for the current user
    session = (
        SocraticSession.query.filter_by(user_id=user_id)
        .order_by(SocraticSession.started_at.desc())
        .first()
    )

    if not session:
        return jsonify({
            "mastery_score": 75,
            "stage": "Analysis Fallback",
            "feedback": "No active session found to evaluate. Complete a session to view detailed insights.",
            "session_complete": True
        }), 200

    concepts_unlocked = session.get_concepts_unlocked()
    total_concepts = len(session.get_concepts() or DEFAULT_CONCEPTS)
    
    mastery_score = session.mastery_score
    if not mastery_score and total_concepts > 0:
        mastery_score = int((len(concepts_unlocked) / total_concepts) * 100)

    feedback = session.defense_feedback or (
        f"You successfully unlocked {len(concepts_unlocked)} out of {total_concepts} core concepts "
        f"for {session.topic}. Your ability to reason through edge cases and boundaries showed solid progress."
    )

    return jsonify({
        "mastery_score": mastery_score,
        "stage": session.stage.replace("_", " ").title() if session.stage else "Completed",
        "feedback": feedback,
        "session_complete": session.status == "completed" or len(concepts_unlocked) >= total_concepts
    }), 200
from datetime import datetime
import traceback

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import Interview, Message

from services.ai_interviewer import (
    get_opening_question,
    get_ai_response,
    get_socratic_opening,
    get_socratic_response,
    evaluate_interview,
    evaluate_socratic_session,
    COMPANY_PROFILES,
    TYPE_FOCUS,
    MOOD_STYLE,
)

interview_bp = Blueprint(
    "interview",
    __name__,
    url_prefix="/api/interview"
)


VALID_TYPES = list(TYPE_FOCUS.keys())
VALID_MOODS = list(MOOD_STYLE.keys())
VALID_COMPANIES = list(COMPANY_PROFILES.keys())

# Two supported modes
VALID_MODES = ["interview", "socratic"]


# ============================================================
# OPTIONS
# ============================================================

@interview_bp.route("/options", methods=["GET"])
def options():
    """
    Return available interview configuration options.
    """

    return jsonify({
        "companies": VALID_COMPANIES,
        "types": VALID_TYPES,
        "moods": VALID_MOODS,
        "modes": VALID_MODES,
    }), 200


# ============================================================
# START INTERVIEW
# ============================================================

@interview_bp.route("/start", methods=["POST"])
@jwt_required()
def start_interview():

    user_id = get_jwt_identity()

    data = request.get_json(force=True) or {}

    company = data.get("company")
    interview_type = data.get("type")
    mood = data.get("mood")

    # Default = normal interview mode
    mode = data.get("mode", "interview")

    resume_text = data.get(
        "resume_text",
        ""
    )


    # --------------------------------------------------------
    # Validation
    # --------------------------------------------------------

    if company not in VALID_COMPANIES:

        return jsonify({
            "error": f"Unknown company '{company}'."
        }), 400


    if interview_type not in VALID_TYPES:

        return jsonify({
            "error": f"Unknown interview type '{interview_type}'."
        }), 400


    if mood not in VALID_MOODS:

        return jsonify({
            "error": f"Unknown mood '{mood}'."
        }), 400


    if mode not in VALID_MODES:

        return jsonify({
            "error": (
                f"Unknown mode '{mode}'. "
                f"Use 'interview' or 'socratic'."
            )
        }), 400


    # --------------------------------------------------------
    # Create database interview
    # --------------------------------------------------------

    interview = Interview(
        user_id=user_id,
        company=company,
        interview_type=interview_type,
        mood=mood,
        mode=mode
    )

    db.session.add(interview)
    db.session.commit()


    # --------------------------------------------------------
    # Generate opening AI message
    # --------------------------------------------------------

    try:

        if mode == "socratic":

            opening_text = get_socratic_opening(
                company=company,
                interview_type=interview_type,
                resume_text=resume_text
            )

        else:

            opening_text = get_opening_question(
                company=company,
                interview_type=interview_type,
                mood=mood,
                resume_text=resume_text
            )

    except Exception:

        print(
            "=== ERROR GENERATING OPENING MESSAGE ==="
        )

        traceback.print_exc()

        if mode == "socratic":

            opening_text = (
                "Let's work through this together. "
                "What do you think would be the first "
                "step in solving the problem?"
            )

        else:

            opening_text = (
                f"Welcome to The Real Room ({company}). "
                "Tell me about yourself and your background."
            )


    # --------------------------------------------------------
    # Save AI message
    # --------------------------------------------------------

    opening_msg = Message(
        interview_id=interview.id,
        sender="ai",
        content=opening_text
    )

    db.session.add(opening_msg)
    db.session.commit()


    return jsonify({
        "interview": interview.to_dict(),
        "message": opening_msg.to_dict(),
    }), 201


# ============================================================
# SEND MESSAGE
# ============================================================

@interview_bp.route(
    "/<interview_id>/message",
    methods=["POST"]
)
@jwt_required()
def send_message(interview_id):

    user_id = get_jwt_identity()

    data = request.get_json(force=True) or {}

    content = (
        data.get("content")
        or data.get("message")
        or ""
    ).strip()


    if not content:

        return jsonify({
            "error": "Message content is required."
        }), 400


    # --------------------------------------------------------
    # Find interview
    # --------------------------------------------------------

    interview = Interview.query.filter_by(
        id=interview_id,
        user_id=user_id
    ).first()


    if not interview:

        return jsonify({
            "error": "Interview not found."
        }), 404


    if interview.status != "in_progress":

        return jsonify({
            "error": "This interview has already ended."
        }), 400


    # --------------------------------------------------------
    # Save candidate message
    # --------------------------------------------------------

    user_msg = Message(
        interview_id=interview.id,
        sender="user",
        content=content
    )

    db.session.add(user_msg)
    db.session.commit()


    # --------------------------------------------------------
    # Get conversation history
    # --------------------------------------------------------

    history = [
        m.to_dict()
        for m in interview.messages
    ]


    # --------------------------------------------------------
    # Generate AI response based on MODE
    # --------------------------------------------------------

    try:

        if interview.mode == "socratic":

            ai_text = get_socratic_response(
                company=interview.company,
                interview_type=interview.interview_type,
                history=history
            )

        else:

            ai_text = get_ai_response(
                company=interview.company,
                interview_type=interview.interview_type,
                mood=interview.mood,
                history=history
            )

    except Exception:

        print(
            "=== ERROR IN AI RESPONSE ==="
        )

        traceback.print_exc()

        if interview.mode == "socratic":

            ai_text = (
                "Let's think about that step by step. "
                "What assumption is your current approach making?"
            )

        else:

            ai_text = (
                "I couldn't generate the next interview "
                "question right now. Please try again."
            )


    # --------------------------------------------------------
    # Save AI message
    # --------------------------------------------------------

    ai_msg = Message(
        interview_id=interview.id,
        sender="ai",
        content=ai_text
    )

    db.session.add(ai_msg)
    db.session.commit()


    return jsonify({
        "message": ai_msg.to_dict()
    }), 200


# ============================================================
# END INTERVIEW / SOCRATIC SESSION
# ============================================================

@interview_bp.route(
    "/<interview_id>/end",
    methods=["POST"]
)
@jwt_required()
def end_interview(interview_id):

    user_id = get_jwt_identity()


    interview = Interview.query.filter_by(
        id=interview_id,
        user_id=user_id
    ).first()


    if not interview:

        return jsonify({
            "error": "Interview not found."
        }), 404


    history = [
        m.to_dict()
        for m in interview.messages
    ]


    # --------------------------------------------------------
    # Evaluate according to mode
    # --------------------------------------------------------

    try:

        if interview.mode == "socratic":

            result = evaluate_socratic_session(
                company=interview.company,
                interview_type=interview.interview_type,
                history=history
            )

        else:

            result = evaluate_interview(
                company=interview.company,
                interview_type=interview.interview_type,
                mood=interview.mood,
                history=history
            )


        if not isinstance(result, dict):

            result = {}


    except Exception:

        print(
            "=== ERROR IN INTERVIEW EVALUATION ==="
        )

        traceback.print_exc()

        result = {}


    # --------------------------------------------------------
    # Complete interview
    # --------------------------------------------------------

    interview.status = "completed"

    interview.ended_at = datetime.utcnow()


    # --------------------------------------------------------
    # Save scores
    # --------------------------------------------------------

    raw_score = result.get("score")


    if raw_score is not None:

        try:

            interview.score = int(raw_score)

        except (
            ValueError,
            TypeError
        ):

            interview.score = 40

    else:

        interview.score = 40


    # Normal interview scores
    if interview.mode == "interview":

        interview.communication_score = (
            result.get("communication_score")
            or result.get("communication")
        )

        interview.confidence_score = (
            result.get("confidence_score")
            or result.get("confidence")
        )

        interview.technical_score = (
            result.get("technical_score")
            or result.get("technical")
        )

    # Socratic scores
    else:

        interview.communication_score = (
            result.get("communication")
        )

        interview.confidence_score = (
            result.get("independence")
        )

        interview.technical_score = (
            result.get("understanding")
        )


    interview.feedback_summary = (
        result.get("feedback_summary")
        or result.get("summary")
        or "Evaluation completed."
    )


    db.session.commit()


    return jsonify({
        "interview": interview.to_dict(
            include_messages=True
        ),
        "evaluation": result
    }), 200


# ============================================================
# GET SINGLE INTERVIEW
# ============================================================

@interview_bp.route(
    "/<interview_id>",
    methods=["GET"]
)
@jwt_required()
def get_interview(interview_id):

    user_id = get_jwt_identity()


    interview = Interview.query.filter_by(
        id=interview_id,
        user_id=user_id
    ).first()


    if not interview:

        return jsonify({
            "error": "Interview not found."
        }), 404


    return jsonify({
        "interview": interview.to_dict(
            include_messages=True
        )
    }), 200


# ============================================================
# INTERVIEW HISTORY
# ============================================================

@interview_bp.route(
    "/history",
    methods=["GET"]
)
@jwt_required()
def history():

    user_id = get_jwt_identity()


    interviews = (
        Interview.query
        .filter_by(user_id=user_id)
        .order_by(
            Interview.started_at.desc()
        )
        .all()
    )


    return jsonify({
        "interviews": [
            i.to_dict()
            for i in interviews
        ]
    }), 200
from datetime import datetime
import traceback
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import Interview, Message
from services.ai_interviewer import (
    get_opening_question,
    get_ai_response,
    evaluate_interview,
    COMPANY_PROFILES,
    TYPE_FOCUS,
    MOOD_STYLE,
)

interview_bp = Blueprint("interview", __name__, url_prefix="/api/interview")

VALID_TYPES = list(TYPE_FOCUS.keys())          # HR, Technical, DSA
VALID_MOODS = list(MOOD_STYLE.keys())          # Friendly, Professional, Strict, Aggressive
VALID_COMPANIES = list(COMPANY_PROFILES.keys())


@interview_bp.route("/options", methods=["GET"])
def options():
    """Powers the 'Set up your interview' page (companies / types / moods)."""
    return jsonify({
        "companies": VALID_COMPANIES,
        "types": VALID_TYPES,
        "moods": VALID_MOODS,
    }), 200


@interview_bp.route("/start", methods=["POST"])
@jwt_required()
def start_interview():
    user_id = get_jwt_identity()
    data = request.get_json(force=True) or {}

    company = data.get("company")
    interview_type = data.get("type")
    mood = data.get("mood")
    resume_text = data.get("resume_text", "")  # Optional candidate resume text

    if company not in VALID_COMPANIES:
        return jsonify({"error": f"Unknown company '{company}'."}), 400
    if interview_type not in VALID_TYPES:
        return jsonify({"error": f"Unknown interview type '{interview_type}'."}), 400
    if mood not in VALID_MOODS:
        return jsonify({"error": f"Unknown mood '{mood}'."}), 400

    interview = Interview(
        user_id=user_id, company=company, interview_type=interview_type, mood=mood
    )
    db.session.add(interview)
    db.session.commit()

    try:
        # Pass resume_text so the AI can tailor the opening question
        opening_text = get_opening_question(company, interview_type, mood, resume_text)
    except Exception as e:
        print("=== ERROR IN get_opening_question ===")
        traceback.print_exc()
        opening_text = f"Welcome to The Real Room ({company}). Tell me about yourself and your background."

    opening_msg = Message(interview_id=interview.id, sender="ai", content=opening_text)
    db.session.add(opening_msg)
    db.session.commit()

    return jsonify({
        "interview": interview.to_dict(),
        "message": opening_msg.to_dict(),
    }), 201


@interview_bp.route("/<interview_id>/message", methods=["POST"])
@jwt_required()
def send_message(interview_id):
    user_id = get_jwt_identity()
    data = request.get_json(force=True) or {}
    
    # Support multiple frontend keys (content or message)
    content = (data.get("content") or data.get("message") or "").strip()

    if not content:
        return jsonify({"error": "Message content is required."}), 400

    interview = Interview.query.filter_by(id=interview_id, user_id=user_id).first()
    if not interview:
        return jsonify({"error": "Interview not found."}), 404
    if interview.status != "in_progress":
        return jsonify({"error": "This interview has already ended."}), 400

    user_msg = Message(interview_id=interview.id, sender="user", content=content)
    db.session.add(user_msg)
    db.session.commit()

    history = [m.to_dict() for m in interview.messages]

    try:
        ai_text = get_ai_response(interview.company, interview.interview_type, interview.mood, history)
    except Exception as e:
        print("=== ERROR IN get_ai_response ===")
        traceback.print_exc()
        ai_text = "Server AI Error: Failed to generate response from provider. Please inspect your Python terminal logs."

    ai_msg = Message(interview_id=interview.id, sender="ai", content=ai_text)
    db.session.add(ai_msg)
    db.session.commit()

    return jsonify({"message": ai_msg.to_dict()}), 200


@interview_bp.route("/<interview_id>/end", methods=["POST"])
@jwt_required()
def end_interview(interview_id):
    user_id = get_jwt_identity()
    interview = Interview.query.filter_by(id=interview_id, user_id=user_id).first()
    if not interview:
        return jsonify({"error": "Interview not found."}), 404

    history = [m.to_dict() for m in interview.messages]

    try:
        result = evaluate_interview(interview.company, interview.interview_type, interview.mood, history)
        if not isinstance(result, dict):
            result = {}
    except Exception as e:
        print("=== ERROR IN evaluate_interview ===")
        traceback.print_exc()
        result = {}

    interview.status = "completed"
    interview.ended_at = datetime.utcnow()
    
    interview.score = result.get("score")
    interview.communication_score = result.get("communication_score") or result.get("communication")
    interview.confidence_score = result.get("confidence_score") or result.get("confidence")
    interview.technical_score = result.get("technical_score") or result.get("technical")
    interview.feedback_summary = result.get("feedback_summary") or result.get("summary") or "Evaluation completed."
    
    db.session.commit()

    return jsonify({"interview": interview.to_dict(include_messages=True)}), 200


@interview_bp.route("/<interview_id>", methods=["GET"])
@jwt_required()
def get_interview(interview_id):
    user_id = get_jwt_identity()
    interview = Interview.query.filter_by(id=interview_id, user_id=user_id).first()
    if not interview:
        return jsonify({"error": "Interview not found."}), 404
    return jsonify({"interview": interview.to_dict(include_messages=True)}), 200


@interview_bp.route("/history", methods=["GET"])
@jwt_required()
def history():
    user_id = get_jwt_identity()
    interviews = (
        Interview.query.filter_by(user_id=user_id)
        .order_by(Interview.started_at.desc())
        .all()
    )
    return jsonify({"interviews": [i.to_dict() for i in interviews]}), 200
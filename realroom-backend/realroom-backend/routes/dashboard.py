from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func

from extensions import db
from models import Interview

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")


@dashboard_bp.route("/analytics", methods=["GET"])
@jwt_required()
def analytics():
    user_id = get_jwt_identity()

    completed = Interview.query.filter_by(user_id=user_id, status="completed")
    completed_count = completed.count()

    avg_score = (
        db.session.query(func.avg(Interview.score))
        .filter(Interview.user_id == user_id, Interview.status == "completed")
        .scalar()
    )

    dsa_solved = Interview.query.filter_by(
        user_id=user_id, status="completed", interview_type="DSA"
    ).count()

    # Simple "current streak": consecutive most-recent-first days with >=1 completed interview
    dates = [
        i.ended_at.date()
        for i in completed.order_by(Interview.ended_at.desc()).all()
        if i.ended_at
    ]
    streak = 0
    if dates:
        from datetime import timedelta, date as date_cls
        seen = sorted(set(dates), reverse=True)
        expected = date_cls.today()
        for d in seen:
            if d == expected:
                streak += 1
                expected = expected - timedelta(days=1)
            elif d == expected + timedelta(days=1):
                continue
            else:
                break

    has_data = completed_count > 0

    return jsonify({
        "interviews_completed": completed_count,
        "average_score": round(avg_score, 1) if avg_score is not None else None,
        "current_streak": streak,
        "dsa_solved": dsa_solved,
        "insights_unlocked": has_data,
        "insight_categories": ["Communication", "Confidence", "Technical Skills", "AI Insights"],
    }), 200

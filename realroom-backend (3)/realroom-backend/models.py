import uuid
from datetime import datetime
from extensions import db


def gen_uuid():
    return str(uuid.uuid4())


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.String(36), primary_key=True, default=gen_uuid)
    name = db.Column(db.String(120), nullable=True)
    email = db.Column(db.String(255), unique=True, nullable=True, index=True)
    password_hash = db.Column(db.String(255), nullable=True)
    is_guest = db.Column(db.Boolean, default=False, nullable=False)
    auth_provider = db.Column(db.String(30), default="local")  # local | google | guest
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    interviews = db.relationship(
        "Interview", backref="user", lazy=True, cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "is_guest": self.is_guest,
            "auth_provider": self.auth_provider,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Interview(db.Model):
    __tablename__ = "interviews"

    id = db.Column(db.String(36), primary_key=True, default=gen_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)

    company = db.Column(db.String(80), nullable=False)          # Google, Amazon, ...
    interview_type = db.Column(db.String(30), nullable=False)    # HR | Technical | DSA
    mood = db.Column(db.String(30), nullable=False)              # Friendly | Professional | Strict | Aggressive

    status = db.Column(db.String(20), default="in_progress")     # in_progress | completed | ended
    score = db.Column(db.Integer, nullable=True)                 # overall score 0-100
    communication_score = db.Column(db.Integer, nullable=True)
    confidence_score = db.Column(db.Integer, nullable=True)
    technical_score = db.Column(db.Integer, nullable=True)
    feedback_summary = db.Column(db.Text, nullable=True)

    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    ended_at = db.Column(db.DateTime, nullable=True)

    messages = db.relationship(
        "Message", backref="interview", lazy=True, cascade="all, delete-orphan",
        order_by="Message.created_at",
    )

    def to_dict(self, include_messages=False):
        data = {
            "id": self.id,
            "user_id": self.user_id,
            "company": self.company,
            "interview_type": self.interview_type,
            "mood": self.mood,
            "status": self.status,
            "score": self.score,
            "communication_score": self.communication_score,
            "confidence_score": self.confidence_score,
            "technical_score": self.technical_score,
            "feedback_summary": self.feedback_summary,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "ended_at": self.ended_at.isoformat() if self.ended_at else None,
        }
        if include_messages:
            data["messages"] = [m.to_dict() for m in self.messages]
        return data


class Message(db.Model):
    __tablename__ = "messages"

    id = db.Column(db.String(36), primary_key=True, default=gen_uuid)
    interview_id = db.Column(db.String(36), db.ForeignKey("interviews.id"), nullable=False)
    sender = db.Column(db.String(10), nullable=False)  # "ai" | "user"
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "sender": self.sender,
            "content": self.content,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

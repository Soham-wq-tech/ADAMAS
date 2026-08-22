import json
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
    interview_type = db.Column(db.String(30), nullable=False)   # HR | Technical | DSA
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


# =============================================================================
# SOCRATIC ROOM MODELS
# =============================================================================
class SocraticSession(db.Model):
    __tablename__ = "socratic_sessions"

    id = db.Column(db.String(36), primary_key=True, default=gen_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)

    topic = db.Column(db.String(160), nullable=False)
    problem_statement = db.Column(db.Text, nullable=True)

    concepts = db.Column(db.Text, nullable=False, default="[]")
    concepts_unlocked = db.Column(db.Text, nullable=False, default="[]")

    mastery_score = db.Column(db.Integer, default=0)
    hint_level = db.Column(db.Integer, default=0)

    status = db.Column(db.String(20), default="in_progress")  # in_progress | completed

    # Pipeline stages: awaiting_answer -> challenge_issued -> awaiting_defense -> evaluation -> mastery
    stage = db.Column(db.String(20), default="awaiting_answer", nullable=False)
    last_student_answer = db.Column(db.Text, nullable=True)
    current_challenge = db.Column(db.Text, nullable=True)

    defense_verdict = db.Column(db.String(20), nullable=True)   # accepted | needs_work
    defense_feedback = db.Column(db.Text, nullable=True)

    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    ended_at = db.Column(db.DateTime, nullable=True)

    messages = db.relationship(
        "SocraticMessage", backref="session", lazy=True, cascade="all, delete-orphan",
        order_by="SocraticMessage.created_at",
    )

    def get_concepts(self):
        try:
            return json.loads(self.concepts) or []
        except (TypeError, ValueError):
            return []

    def set_concepts(self, concepts_list):
        self.concepts = json.dumps(concepts_list or [])

    def get_concepts_unlocked(self):
        try:
            return json.loads(self.concepts_unlocked) or []
        except (TypeError, ValueError):
            return []

    def set_concepts_unlocked(self, concepts_list):
        self.concepts_unlocked = json.dumps(concepts_list or [])

    def unlock_concept(self, concept):
        unlocked = self.get_concepts_unlocked()
        if concept and concept not in unlocked:
            unlocked.append(concept)
            self.set_concepts_unlocked(unlocked)

    def to_dict(self, include_messages=False):
        data = {
            "id": self.id,
            "user_id": self.user_id,
            "topic": self.topic,
            "problem_statement": self.problem_statement,
            "concepts": self.get_concepts(),
            "concepts_unlocked": self.get_concepts_unlocked(),
            "mastery_score": self.mastery_score,
            "hint_level": self.hint_level,
            "status": self.status,
            "stage": self.stage,
            "last_student_answer": self.last_student_answer,
            "current_challenge": self.current_challenge,
            "defense_verdict": self.defense_verdict,
            "defense_feedback": self.defense_feedback,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "ended_at": self.ended_at.isoformat() if self.ended_at else None,
        }
        if include_messages:
            data["messages"] = [m.to_dict() for m in self.messages]
        return data


class SocraticMessage(db.Model):
    __tablename__ = "socratic_messages"

    id = db.Column(db.String(36), primary_key=True, default=gen_uuid)
    session_id = db.Column(db.String(36), db.ForeignKey("socratic_sessions.id"), nullable=False)
    sender = db.Column(db.String(10), nullable=False)  # "ai" | "user"
    content = db.Column(db.Text, nullable=False)
    tag = db.Column(db.String(60), nullable=True)              # e.g. "Socratic Inquiry", "Guided Probe"
    concept_unlocked = db.Column(db.String(160), nullable=True)  # set only on the turn it was unlocked
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "sender": self.sender,
            "content": self.content,
            "tag": self.tag,
            "concept_unlocked": self.concept_unlocked,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
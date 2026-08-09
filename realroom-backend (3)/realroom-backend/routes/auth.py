from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import bcrypt

from extensions import db
from models import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def check_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(force=True) or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "An account with this email already exists."}), 409

    user = User(
        name=name or email.split("@")[0],
        email=email,
        password_hash=hash_password(password),
        is_guest=False,
        auth_provider="local",
    )
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=user.id)
    return jsonify({"token": token, "user": user.to_dict()}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(force=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    user = User.query.filter_by(email=email).first()
    if not user or not user.password_hash or not check_password(password, user.password_hash):
        return jsonify({"error": "Invalid email or password."}), 401

    token = create_access_token(identity=user.id)
    return jsonify({"token": token, "user": user.to_dict()}), 200


@auth_bp.route("/guest", methods=["POST"])
def guest_login():
    """Creates a throwaway guest user, mirrors 'Continue as Guest' on the login page."""
    user = User(name="Guest", email=None, password_hash=None, is_guest=True, auth_provider="guest")
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=user.id)
    return jsonify({"token": token, "user": user.to_dict()}), 201


@auth_bp.route("/google", methods=["POST"])
def google_login():
    """
    Stub for 'Continue with Google'. Expects {"id_token": "..."} from the frontend
    (e.g. via Google Identity Services), verifies it, and upserts a user.
    Plug in google-auth's id_token.verify_oauth2_token() here in production.
    """
    data = request.get_json(force=True) or {}
    email = data.get("email", "").strip().lower()
    name = data.get("name", "")

    if not email:
        return jsonify({"error": "Google account email is required."}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(name=name or email.split("@")[0], email=email, auth_provider="google")
        db.session.add(user)
        db.session.commit()

    token = create_access_token(identity=user.id)
    return jsonify({"token": token, "user": user.to_dict()}), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404
    return jsonify({"user": user.to_dict()}), 200

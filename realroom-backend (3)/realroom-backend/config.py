import os
from datetime import timedelta

from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()


class Config:
    # --- Core Settings ---
    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "dev-secret-change-me"
    )

    # --- Database (PostgreSQL) ---
    # Defaults to a local PostgreSQL database, but can be overridden 
    # via the DATABASE_URL environment variable (e.g., in production).
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/realroom"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SQLALCHEMY_ECHO = os.getenv(
        "SQLALCHEMY_ECHO",
        "False"
    ).lower() in ("true", "1")

    # --- JWT Settings ---
    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY",
        "dev-jwt-secret-change-me"
    )

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)

    # --- Gemini AI Settings ---
    GEMINI_API_KEY = os.getenv(
        "GEMINI_API_KEY",
        ""
    )

    GEMINI_MODEL = os.getenv(
        "GEMINI_MODEL",
        "gemini-3.6-flash"
    )

    # --- CORS Settings ---
    raw_origins = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000"
    )

    CORS_ORIGINS = [
        origin.strip()
        for origin in raw_origins.split(",")
        if origin.strip()
    ]
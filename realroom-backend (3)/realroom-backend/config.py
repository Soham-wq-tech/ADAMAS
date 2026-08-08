import os
from datetime import timedelta
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()


class Config:
    # --- Core Settings ---
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")

    # --- Database (MySQL) ---
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "3306")
    DB_NAME = os.getenv("DB_NAME", "realroom")

    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = os.getenv("SQLALCHEMY_ECHO", "True").lower() in ("true", "1")

    # --- JWT Settings ---
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret-change-me")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)

    # --- Gemini AI Settings ---
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")

    # --- CORS Settings ---
    raw_origins = os.getenv(
        "CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"
    )
    CORS_ORIGINS = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]
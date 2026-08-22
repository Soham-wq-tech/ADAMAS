-- Run this manually if you prefer setting up the schema yourself instead of
-- letting SQLAlchemy's db.create_all() do it on first app run.

CREATE DATABASE IF NOT EXISTS realroom CHARACTER SET utf8mb4;
USE realroom;

CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(120),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    is_guest BOOLEAN NOT NULL DEFAULT FALSE,
    auth_provider VARCHAR(30) DEFAULT 'local',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS interviews (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    company VARCHAR(80) NOT NULL,
    interview_type VARCHAR(30) NOT NULL,
    mood VARCHAR(30) NOT NULL,
    status VARCHAR(20) DEFAULT 'in_progress',
    score INT,
    communication_score INT,
    confidence_score INT,
    technical_score INT,
    feedback_summary TEXT,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
    id CHAR(36) PRIMARY KEY,
    interview_id CHAR(36) NOT NULL,
    sender VARCHAR(10) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
);

CREATE INDEX idx_interviews_user ON interviews(user_id);
CREATE INDEX idx_messages_interview ON messages(interview_id);

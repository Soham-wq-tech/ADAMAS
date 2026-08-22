"""
Conversation memory for interview sessions.

Each interview gets its own independent conversation.
"""

sessions = {}


def get_session(interview_id):
    """Get or create a conversation for an interview."""
    if interview_id not in sessions:
        sessions[interview_id] = []

    return sessions[interview_id]


def clear_session(interview_id):
    """Clear one interview's conversation."""
    sessions.pop(interview_id, None)


def delete_session(interview_id):
    """Delete an interview session completely."""
    sessions.pop(interview_id, None)
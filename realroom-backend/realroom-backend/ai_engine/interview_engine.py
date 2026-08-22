from .prompts import build_prompt
from .gemini_client import generate_response
from .conversation_memory import get_session, clear_session
from .evaluator import evaluate_answer
from .performance import generate_performance_report


MAX_QUESTIONS = 5


# Store configuration separately for every interview
interview_configs = {}


def _get_history(conversation):
    """
    Convert conversation memory into the format expected by build_prompt().
    """

    history = []

    for message in conversation:
        history.append({
            "role": message.get("role", "unknown"),
            "content": message.get(
                "content",
                message.get("text", "")
            )
        })

    return history


def _count_questions(conversation):
    """
    Count interviewer questions already generated.
    """

    return sum(
        1
        for message in conversation
        if message.get("role") == "model"
        and message.get("is_question", True)
    )


def start_interview(
    interview_id,
    company,
    mood,
    role="Software Engineer",
    interview_type="Technical"
):
    """
    Start a completely new interview session.

    Every interview has its own:
    - Conversation
    - Company
    - Mood
    - Role
    - Interview type
    """

    # Get a dedicated conversation for this interview
    conversation = get_session(interview_id)

    # Clear any previous conversation for this interview
    conversation.clear()

    # Store configuration for this interview
    interview_configs[interview_id] = {
        "company": company,
        "mood": mood,
        "role": role,
        "interview_type": interview_type
    }

    # Build opening prompt
    prompt = build_prompt(
        company=company,
        mood=mood,
        role=role,
        interview_type=interview_type,
        conversation_history=[],
        candidate_answer=None
    )

    # Generate first interviewer response
    response = generate_response(prompt)

    # Store system prompt
    conversation.append({
        "role": "system",
        "content": prompt
    })

    # Store first interviewer question
    conversation.append({
        "role": "model",
        "content": response,
        "is_question": True
    })

    return {
        "status": "in_progress",
        "response": response,
        "question_number": 1,
        "max_questions": MAX_QUESTIONS
    }


def continue_interview(interview_id, answer):
    """
    Continue an existing interview.

    The AI:
    1. Evaluates the candidate's answer.
    2. Stores the evaluation.
    3. Checks interview progress.
    4. Adapts the next question.
    5. Generates a final report when complete.
    """

    # Get interview conversation
    conversation = get_session(interview_id)

    # Make sure interview exists
    if interview_id not in interview_configs:
        return {
            "status": "error",
            "message": "Interview session not found."
        }

    # Get interview configuration
    config = interview_configs[interview_id]

    company = config["company"]
    mood = config["mood"]
    role = config["role"]
    interview_type = config["interview_type"]

    # Find the latest interviewer question
    previous_question = ""

    for message in reversed(conversation):

        if message.get("role") == "model":
            previous_question = message.get("content", "")
            break

    # Evaluate candidate answer
    evaluation = evaluate_answer(
        question=previous_question,
        answer=answer,
        company=company,
        role=role
    )

    # Store candidate answer and evaluation
    conversation.append({
        "role": "user",
        "content": answer,
        "evaluation": evaluation
    })

    # Count questions already asked
    questions_asked = _count_questions(conversation)

    # ==========================================================
    # INTERVIEW COMPLETE
    # ==========================================================

    if questions_asked >= MAX_QUESTIONS:

        closing_message = (
            "That wraps up the interview. "
            "Thanks for your answers — I'm compiling your results now."
        )

        # Store closing message
        conversation.append({
            "role": "model",
            "content": closing_message,
            "is_question": False
        })

        # Generate complete performance report
        performance_report = generate_performance_report(
            conversation
        )

        return {
            "status": "completed",
            "message": closing_message,
            "question_number": questions_asked,
            "max_questions": MAX_QUESTIONS,
            "evaluation": evaluation,
            "performance_report": performance_report
        }

    # ==========================================================
    # ADAPTIVE NEXT QUESTION
    # ==========================================================

    history = _get_history(conversation)

    prompt = build_prompt(
        company=company,
        mood=mood,
        role=role,
        interview_type=interview_type,
        conversation_history=history,
        candidate_answer=answer,
        performance=evaluation
    )

    # Generate adaptive interviewer response
    response = generate_response(prompt)

    # Store next question
    conversation.append({
        "role": "model",
        "content": response,
        "is_question": True
    })

    return {
        "status": "in_progress",
        "response": response,
        "question_number": questions_asked + 1,
        "max_questions": MAX_QUESTIONS,
        "evaluation": evaluation
    }


def get_conversation(interview_id):
    """
    Return conversation for a specific interview.
    """

    conversation = get_session(interview_id)

    return _get_history(conversation)


def get_interview_config(interview_id):
    """
    Return configuration for a specific interview.
    """

    return interview_configs.get(
        interview_id,
        {}
    ).copy()


def reset_interview(interview_id):
    """
    Completely reset one interview session.
    """

    # Clear conversation
    clear_session(interview_id)

    # Remove configuration
    interview_configs.pop(
        interview_id,
        None
    )

    return {
        "status": "reset",
        "message": "Interview session reset successfully."
    }
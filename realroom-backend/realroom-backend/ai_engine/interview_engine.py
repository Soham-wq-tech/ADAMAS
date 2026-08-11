from .prompts import build_prompt
from .gemini_client import generate_response
from .conversation_memory import conversation

MAX_QUESTIONS = 5


def start_interview(company, mood):
    prompt = build_prompt(company, mood)

    response = generate_response(prompt)

    conversation.clear()

    conversation.append({
        "role": "user",
        "text": prompt
    })

    conversation.append({
        "role": "model",
        "text": response
    })

    return {
        "status": "in_progress",
        "response": response
    }


def continue_interview(answer):

    conversation.append({
        "role": "user",
        "text": answer
    })

    # count how many questions the AI has already asked
    questions_asked = sum(1 for msg in conversation if msg["role"] == "model")

    if questions_asked >= MAX_QUESTIONS:
        closing_message = (
            "That wraps up the interview. Thanks for your answers — "
            "I'm compiling your results now."
        )

        conversation.append({
            "role": "model",
            "text": closing_message
        })

        return {
            "status": "completed",
            "message": closing_message
        }

    history = ""

    for msg in conversation:
        history += f"{msg['role']}: {msg['text']}\n"

    response = generate_response(history)

    conversation.append({
        "role": "model",
        "text": response
    })

    return {
        "status": "in_progress",
        "response": response
    }
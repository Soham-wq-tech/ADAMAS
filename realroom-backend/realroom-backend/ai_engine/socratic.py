from .gemini_client import generate_response


def build_socratic_prompt(
    problem,
    conversation_history=None,
    user_answer=None
):
    """
    Build a Socratic tutoring prompt.

    The AI should guide the learner using questions
    instead of directly providing the solution.
    """

    if conversation_history:
        history_text = "\n".join(
            f"{message.get('role', 'unknown').upper()}: "
            f"{message.get('content', '')}"
            for message in conversation_history
        )
    else:
        history_text = "No previous conversation."

    if user_answer:
        latest_answer = user_answer
    else:
        latest_answer = "The learner has not answered yet."

    return f"""
You are an expert Socratic AI tutor.

Your goal is NOT to immediately give the learner the answer.

Your goal is to help the learner discover the answer
through carefully chosen questions.

========================
PROBLEM
========================

{problem}

========================
CONVERSATION
========================

{history_text}

========================
LATEST LEARNER ANSWER
========================

{latest_answer}

========================
SOCRATIC RULES
========================

1. Never immediately provide the complete solution.

2. Ask ONE meaningful question at a time.

3. Analyze the learner's latest reasoning before responding.

4. If the learner is correct, help them go one level deeper.

5. If the learner is partially correct, identify the missing
   concept through a question.

6. If the learner is incorrect, do not simply say "wrong".
   Ask a question that helps them discover the mistake.

7. Give a small conceptual hint only when the learner is stuck.

8. Never write the complete code or solution unless the learner
   has independently reached the solution.

9. Adapt the difficulty based on the learner's responses.

10. Encourage reasoning rather than memorization.

11. Keep responses concise and conversational.

12. Do not ask multiple questions at once.

13. When the learner has successfully reached the solution,
    acknowledge it and briefly summarize the key insight.

========================
YOUR TASK
========================

Based on the problem, conversation history and latest answer:

1. Determine what the learner currently understands.
2. Identify the next concept they should discover.
3. Ask exactly ONE question that guides them toward it.

Respond naturally like an intelligent tutor.

Do not reveal the complete answer.

Begin the Socratic interaction now.
"""


def start_socratic(problem):
    """
    Start a new Socratic learning session.
    """

    prompt = build_socratic_prompt(
        problem=problem,
        conversation_history=[],
        user_answer=None
    )

    response = generate_response(prompt)

    conversation = [
        {
            "role": "system",
            "content": prompt
        },
        {
            "role": "model",
            "content": response
        }
    ]

    return {
        "status": "in_progress",
        "response": response,
        "conversation": conversation
    }


def continue_socratic(
    problem,
    conversation,
    user_answer
):
    """
    Continue a Socratic learning session.
    """

    conversation.append({
        "role": "user",
        "content": user_answer
    })

    prompt = build_socratic_prompt(
        problem=problem,
        conversation_history=conversation,
        user_answer=user_answer
    )

    response = generate_response(prompt)

    conversation.append({
        "role": "model",
        "content": response
    })

    return {
        "status": "in_progress",
        "response": response,
        "conversation": conversation
    }
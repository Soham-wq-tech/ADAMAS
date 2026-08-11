"""
Handles all calls to the Gemini API and builds the system prompt that
gives the AI interviewer its company / interview-type / mood behavior.
"""
import json
import os
from google import genai
from google.genai import types
from flask import current_app

# ---- Company personas -----------------------------------------------------
COMPANY_PROFILES = {
    "Google": "Google values structured problem solving, clear communication, "
              "and 'Googleyness' (collaboration, comfort with ambiguity).",
    "Microsoft": "Microsoft values a growth mindset, collaboration across teams, "
                 "and customer-obsessed thinking.",
    "Amazon": "Amazon interviews are built around its Leadership Principles "
              "(Ownership, Bias for Action, Customer Obsession, etc.) and expect STAR-format answers.",
    "NVIDIA": "NVIDIA values deep technical expertise, especially in systems, "
              "parallel computing, and a fast-paced, high-ownership culture.",
    "Apple": "Apple values attention to detail, design sensibility, secrecy/discretion, "
             "and cross-functional collaboration.",
    "Meta": "Meta values moving fast, impact-driven engineering, and direct, data-informed communication.",
    "Atlassian": "Atlassian values openness, 'don't f*** the customer', and teamwork over ego.",
    "Uber": "Uber values relentless execution, ownership, and scrappy, metrics-driven decision making.",
}

# ---- Interview type focus ---------------------------------------------------
TYPE_FOCUS = {
    "HR": "This is a behavioral / culture-fit interview. Ask about past experiences, "
          "teamwork, conflict resolution, motivation, and career goals. No coding or system design.",
    "Technical": "This is a technical interview covering system design and core CS concepts. "
                 "Ask conceptual and design questions, probe trade-offs, and follow up on their reasoning.",
    "DSA": "This is a Data Structures & Algorithms interview. Give the candidate one problem at a time, "
           "ask them to explain their approach, complexity, and edge cases before/while coding.",
}

# ---- Interviewer mood / tone -------------------------------------------------
MOOD_STYLE = {
    "Friendly": "Warm, encouraging tone. Reassure the candidate, smile through your words, "
                "give gentle hints if they're stuck.",
    "Professional": "Neutral, standard pace. Polite and businesslike, minimal small talk.",
    "Strict": "Terse, no hand-holding. Short questions, little praise, expects precision.",
    "Aggressive": "Pushes back hard on answers, interrupts weak reasoning, applies pressure, "
                  "asks rapid-fire follow-ups. Still professional, never abusive.",
}


def build_system_prompt(company: str, interview_type: str, mood: str) -> str:
    company_desc = COMPANY_PROFILES.get(company, f"{company} is a technology company.")
    type_desc = TYPE_FOCUS.get(interview_type, TYPE_FOCUS["Technical"])
    mood_desc = MOOD_STYLE.get(mood, MOOD_STYLE["Professional"])

    return f"""You are an AI interviewer conducting a mock interview for {company}.

COMPANY CONTEXT: {company_desc}
INTERVIEW TYPE: {type_desc}
YOUR MOOD/TONE: {mood_desc}

Rules:
- Ask ONE question or make ONE point at a time, then wait for the candidate's reply.
- Stay in character as a {company} interviewer with a {mood.lower()} tone for the entire conversation.
- Keep responses concise (2-5 sentences), like real spoken interview dialogue.
- Give brief, natural acknowledgement of the candidate's previous answer before moving on when appropriate.
- Do not break character or mention that you are an AI language model.
- After a reasonable number of exchanges (or if the candidate says they're done), you may wrap up the interview.
"""


def _get_client() -> genai.Client:
    api_key = None
    try:
        if current_app:
            api_key = current_app.config.get("GEMINI_API_KEY")
    except RuntimeError:
        pass

    if not api_key:
        api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")

    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not configured on the server or in environment variables.")
        
    return genai.Client(api_key=api_key)


def get_opening_question(company: str, interview_type: str, mood: str, resume_text: str = "") -> str:
    """Generates the first AI message when an interview starts."""
    client = _get_client()
    system_prompt = build_system_prompt(company, interview_type, mood)

    user_prompt = "Begin the interview now. Greet the candidate briefly and ask your first question."
    if resume_text:
        user_prompt += f"\n\nHere is the candidate's resume/background text to help tailor your opening question:\n{resume_text}"

    model_name = "gemini-2.5-flash"
    try:
        if current_app:
            model_name = current_app.config.get("GEMINI_MODEL", "gemini-2.5-flash")
    except RuntimeError:
        pass

    response = client.models.generate_content(
        model=model_name,
        contents=[
            types.Content(
                role="user",
                parts=[types.Part(text=user_prompt)],
            )
        ],
        config=types.GenerateContentConfig(
            system_instruction=system_prompt,
            max_output_tokens=300,
        ),
    )
    return _extract_text(response)


def get_ai_response(company: str, interview_type: str, mood: str, history: list) -> str:
    client = _get_client()
    system_prompt = build_system_prompt(company, interview_type, mood)

    contents = []
    for m in history:
        role = "model" if m["sender"] == "ai" else "user"
        contents.append(types.Content(role=role, parts=[types.Part(text=m["content"])]))

    model_name = "gemini-2.5-flash"
    try:
        if current_app:
            model_name = current_app.config.get("GEMINI_MODEL", "gemini-2.5-flash")
    except RuntimeError:
        pass

    response = client.models.generate_content(
        model=model_name,
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=system_prompt,
            max_output_tokens=400,
        ),
    )
    return _extract_text(response)


def evaluate_interview(company: str, interview_type: str, mood: str, history: list) -> dict:
    client = _get_client()

    transcript_lines = []
    user_message_count = 0
    for m in history:
        speaker = "Interviewer" if m["sender"] == "ai" else "Candidate"
        transcript_lines.append(f"{speaker}: {m['content']}")
        if m["sender"] == "user":
            user_message_count += 1
            
    transcript = "\n".join(transcript_lines)

    # Automatically assign low/failing scores if user didn't participate
    if user_message_count == 0 or len(transcript.strip()) < 50:
        return {
            "score": 10,
            "communication": 10,
            "confidence": 10,
            "technical": 10,
            "feedback_summary": "No substantial answers were provided during this session. To receive a proper evaluation, please actively participate and respond to the interviewer's questions."
        }

    eval_system = (
        "You are an expert technical and behavioral interview evaluator. Given the mock interview transcript, evaluate the candidate strictly and objectively. "
        "If the candidate provided sparse, incomplete, or poor answers, give them low scores (0-40). If they did not answer, score them near 0. "
        "Respond ONLY with valid JSON, no markdown fences, no preamble, matching this exact shape: "
        '{"score": <0-100 int>, "communication": <0-100 int>, "confidence": <0-100 int>, '
        '"technical": <0-100 int>, "feedback_summary": "<3-5 sentence detailed constructive feedback summary>"}'
    )

    model_name = "gemini-2.5-flash"
    try:
        if current_app:
            model_name = current_app.config.get("GEMINI_MODEL", "gemini-2.5-flash")
    except RuntimeError:
        pass

    try:
        response = client.models.generate_content(
            model=model_name,
            contents=[
                types.Content(
                    role="user",
                    parts=[types.Part(
                        text=f"Company: {company}\nInterview type: {interview_type}\nInterviewer mood: {mood}\n\n"
                             f"Transcript:\n{transcript}\n\nEvaluate this interview and generate strict percentage scores."
                    )],
                )
            ],
            config=types.GenerateContentConfig(
                system_instruction=eval_system,
                max_output_tokens=500,
            ),
        )
        text = _extract_text(response).strip()
        text = text.replace("```json", "").replace("```", "").strip()
        data = json.loads(text)
    except Exception:
        data = {
            "score": 40,
            "communication": 40,
            "confidence": 40,
            "technical": 40,
            "feedback_summary": "The interview session was incomplete or evaluation parsing encountered an error. Please try completing a full session for accurate metrics.",
        }
    return data


def _extract_text(response) -> str:
    text = getattr(response, "text", None)
    if text:
        return text.strip()

    parts = []
    for candidate in getattr(response, "candidates", []) or []:
        content = getattr(candidate, "content", None)
        for part in getattr(content, "parts", []) or []:
            part_text = getattr(part, "text", None)
            if part_text:
                parts.append(part_text)
    return "\n".join(parts).strip()
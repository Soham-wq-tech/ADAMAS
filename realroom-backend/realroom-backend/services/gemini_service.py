import json
import google.generativeai as genai

def analyze_answer_and_challenge(topic, problem_statement, current_challenge, user_answer):
    prompt = f"""
    You are an expert Socratic tutor guiding a student through a problem.
    Topic: {topic}
    Problem: {problem_statement}
    Current Challenge/Question: {current_challenge}
    Student's Answer: {user_answer}

    Analyze the student's answer for semantic validity, correctness, and reasoning depth.
    Return a JSON response with the following exact keys:
    - "valid": boolean (true if the answer shows correct understanding or valid reasoning, false if flawed)
    - "feedback": string (Socratic feedback highlighting strengths or logical gaps)
    - "next_challenge": string (The next targeted Socratic question to deepen their intuition)
    - "stage": string (Set to "challenge" or "defense" depending on progress)
    """
    model = genai.GenerativeModel('gemini-1.5-pro')
    response = model.generate_content(
        prompt,
        generation_config={"response_mime_type": "application/json"}
    )
    return json.loads(response.text)

def evaluate_defense(topic, problem_statement, defense_text):
    prompt = f"""
    You are a Socratic tutor evaluating a student's final defense.
    Topic: {topic}
    Problem: {problem_statement}
    Student's Defense: {defense_text}

    Evaluate how well they defended their logic and compute a mastery score from 0.0 to 1.0.
    Return a JSON response with the following exact keys:
    - "evaluation": string (detailed analysis of their final conceptual grasp)
    - "mastery_score": float (between 0.0 and 1.0)
    - "stage": string (set to "mastery")
    """
    model = genai.GenerativeModel('gemini-1.5-pro')
    response = model.generate_content(
        prompt,
        generation_config={"response_mime_type": "application/json"}
    )
    return json.loads(response.text)
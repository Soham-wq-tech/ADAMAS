from .gemini_client import generate_response


def generate_recommendation(
    evaluations,
    company="General",
    role="Software Engineer"
):
    """
    Generate a final personalized interview report
    from all answer evaluations.
    """

    if not evaluations:
        return {
            "overall_score": 0,
            "strengths": [],
            "weaknesses": [],
            "recommendations": [],
            "summary": "No interview evaluations are available."
        }

    # Build evaluation summary
    evaluation_text = ""

    for index, evaluation in enumerate(evaluations, start=1):
        evaluation_text += f"""
Answer {index}:
Technical Correctness: {evaluation.get("technical_correctness", 0)}/10
Communication: {evaluation.get("communication", 0)}/10
Confidence: {evaluation.get("confidence", 0)}/10
Relevance: {evaluation.get("relevance", 0)}/10
Problem Solving: {evaluation.get("problem_solving", 0)}/10
Overall Score: {evaluation.get("overall_score", 0)}/10
Strength: {evaluation.get("strength", "")}
Weakness: {evaluation.get("weakness", "")}
Feedback: {evaluation.get("feedback", "")}
"""

    prompt = f"""
You are an expert interview coach.

Create a final performance report for a candidate who completed
a simulated interview.

========================
INTERVIEW INFORMATION
========================

Company: {company}
Role: {role}

========================
ANSWER EVALUATIONS
========================

{evaluation_text}

========================
TASK
========================

Analyze all evaluations together.

Identify:

1. Overall performance score from 1 to 10.
2. The candidate's strongest areas.
3. The candidate's weakest areas.
4. The most important skills they should improve.
5. Practical recommendations for future interviews.
6. A short final summary.

Avoid repeating the same point multiple times.

Give specific and actionable recommendations.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "overall_score": 0,
    "strengths": [
        "",
        ""
    ],
    "weaknesses": [
        "",
        ""
    ],
    "recommendations": [
        "",
        "",
        ""
    ],
    "summary": ""
}}
"""

    response = generate_response(prompt)

    return _parse_recommendation(response)


def _parse_recommendation(response):
    """
    Safely convert Gemini's response into a Python dictionary.
    """

    import json

    try:
        cleaned = response.strip()

        # Remove markdown JSON fences if Gemini adds them.
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]

        elif cleaned.startswith("```"):
            cleaned = cleaned[3:]

        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]

        cleaned = cleaned.strip()

        recommendation = json.loads(cleaned)

        return {
            "overall_score": recommendation.get(
                "overall_score", 0
            ),
            "strengths": recommendation.get(
                "strengths", []
            ),
            "weaknesses": recommendation.get(
                "weaknesses", []
            ),
            "recommendations": recommendation.get(
                "recommendations", []
            ),
            "summary": recommendation.get(
                "summary", ""
            )
        }

    except Exception:
        return {
            "overall_score": 0,
            "strengths": [],
            "weaknesses": [],
            "recommendations": [],
            "summary": response
        }
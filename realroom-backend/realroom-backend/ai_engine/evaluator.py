from .gemini_client import generate_response
import json
import re


def evaluate_answer(
    question,
    answer,
    company="General",
    role="Software Engineer"
):
    """
    Evaluate a candidate's answer using Gemini.

    Returns:
    - Technical correctness
    - Communication
    - Confidence
    - Relevance
    - Problem solving
    - Overall score
    - Strength
    - Weakness
    - Feedback
    - Suggested improvement
    """

    prompt = f"""
You are the evaluation engine of a professional AI interview platform
called "THE REAL ROOM".

You are NOT the interviewer.

Your job is to objectively evaluate the candidate's answer.

==================================================
INTERVIEW INFORMATION
==================================================

Company: {company}
Role: {role}

==================================================
QUESTION
==================================================

{question}

==================================================
CANDIDATE ANSWER
==================================================

{answer}

==================================================
SCORING SYSTEM
==================================================

Score every category from 1 to 10.

1 = Very poor
2 = Poor
3 = Below average
4 = Weak
5 = Average
6 = Fairly good
7 = Good
8 = Very good
9 = Excellent
10 = Exceptional

Evaluate:

TECHNICAL CORRECTNESS
- Is the answer factually correct?
- Are the concepts understood?
- Are important technical details missing?

COMMUNICATION
- Is the explanation clear?
- Is the answer structured?
- Can an interviewer easily understand the candidate?

CONFIDENCE
- Does the candidate communicate their reasoning decisively?
- Do they appear uncertain or contradictory?
- Do NOT assume psychological traits from writing alone.
- Judge confidence only from the way the answer is communicated.

RELEVANCE
- Does the answer directly address the question?
- Does the candidate avoid unnecessary information?

PROBLEM SOLVING
- Is the reasoning logical?
- Does the candidate identify a sensible approach?
- Do they consider trade-offs, edge cases or complexity when relevant?

==================================================
IMPORTANT EVALUATION RULES
==================================================

1. Judge the actual answer, not what you think the candidate intended.

2. Do not reward unnecessary jargon.

3. Do not penalize a concise answer if it is correct and sufficient.

4. Do not require advanced concepts unless the question requires them.

5. If the answer is incorrect, clearly identify why.

6. If the answer is partially correct, recognize the correct part.

7. If the candidate does not answer the question, relevance should be low.

8. For DSA or technical questions, correctness is more important
   than fancy wording.

9. Do not automatically give high scores.

10. Do not automatically give low scores.

11. The overall score must reflect the individual scores.

12. The feedback should be practical and concise.

13. Identify ONE major strength.

14. Identify ONE major weakness.

15. Suggest ONE specific improvement.

==================================================
OVERALL SCORE
==================================================

Calculate the overall score using this weighting:

Technical Correctness: 30%
Problem Solving:       25%
Relevance:             20%
Communication:         15%
Confidence:            10%

Round the final score to one decimal place.

==================================================
OUTPUT FORMAT
==================================================

Return ONLY valid JSON.

Do not use markdown.

Do not include ```json.

Use EXACTLY this structure:

{{
    "technical_correctness": 0,
    "communication": 0,
    "confidence": 0,
    "relevance": 0,
    "problem_solving": 0,
    "overall_score": 0,
    "strength": "",
    "weakness": "",
    "feedback": "",
    "suggested_improvement": ""
}}
"""

    response = generate_response(prompt)

    return _parse_evaluation(response)


def _safe_score(value):
    """
    Convert a Gemini score into a valid number between 1 and 10.
    """

    try:
        value = float(value)

        if value < 1:
            return 1

        if value > 10:
            return 10

        return round(value, 1)

    except (TypeError, ValueError):
        return 0


def _parse_evaluation(response):
    """
    Safely convert Gemini's response into a Python dictionary.

    Handles:
    - Normal JSON
    - Markdown JSON fences
    - Extra text surrounding JSON
    - Invalid Gemini responses
    """

    try:

        if not response:
            raise ValueError("Empty Gemini response")

        cleaned = response.strip()

        # --------------------------------------------------
        # Remove markdown code fences
        # --------------------------------------------------

        cleaned = re.sub(
            r"^```(?:json)?\s*",
            "",
            cleaned,
            flags=re.IGNORECASE
        )

        cleaned = re.sub(
            r"\s*```$",
            "",
            cleaned
        )

        cleaned = cleaned.strip()

        # --------------------------------------------------
        # Try direct JSON parsing
        # --------------------------------------------------

        try:
            evaluation = json.loads(cleaned)

        except json.JSONDecodeError:

            # --------------------------------------------------
            # Gemini sometimes adds text before/after JSON.
            # Extract the JSON object.
            # --------------------------------------------------

            match = re.search(
                r"\{.*\}",
                cleaned,
                re.DOTALL
            )

            if not match:
                raise ValueError("No JSON object found")

            evaluation = json.loads(match.group(0))

        # --------------------------------------------------
        # Extract scores
        # --------------------------------------------------

        technical_correctness = _safe_score(
            evaluation.get("technical_correctness")
        )

        communication = _safe_score(
            evaluation.get("communication")
        )

        confidence = _safe_score(
            evaluation.get("confidence")
        )

        relevance = _safe_score(
            evaluation.get("relevance")
        )

        problem_solving = _safe_score(
            evaluation.get("problem_solving")
        )

        # --------------------------------------------------
        # Recalculate overall score ourselves.
        #
        # This prevents Gemini from returning an inconsistent
        # overall score.
        # --------------------------------------------------

        scores = [
            technical_correctness,
            communication,
            confidence,
            relevance,
            problem_solving
        ]

        if all(score > 0 for score in scores):

            overall_score = round(
                technical_correctness * 0.30
                + problem_solving * 0.25
                + relevance * 0.20
                + communication * 0.15
                + confidence * 0.10,
                1
            )

        else:
            overall_score = 0

        # --------------------------------------------------
        # Final structured evaluation
        # --------------------------------------------------

        return {
            "technical_correctness": technical_correctness,
            "communication": communication,
            "confidence": confidence,
            "relevance": relevance,
            "problem_solving": problem_solving,
            "overall_score": overall_score,

            "strength": str(
                evaluation.get("strength", "")
            ),

            "weakness": str(
                evaluation.get("weakness", "")
            ),

            "feedback": str(
                evaluation.get("feedback", "")
            ),

            "suggested_improvement": str(
                evaluation.get(
                    "suggested_improvement",
                    ""
                )
            )
        }

    except Exception:

        # --------------------------------------------------
        # Never allow evaluator failure to crash the interview.
        # --------------------------------------------------

        return {
            "technical_correctness": 0,
            "communication": 0,
            "confidence": 0,
            "relevance": 0,
            "problem_solving": 0,
            "overall_score": 0,
            "strength": "",
            "weakness": "",
            "feedback": (
                "The answer could not be evaluated automatically."
            ),
            "suggested_improvement": "",
            "raw_response": response
        }
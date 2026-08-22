def generate_performance_report(conversation):
    """
    Generate a performance report from the completed interview.

    Uses the evaluations stored with each candidate answer.
    """

    evaluations = []

    for message in conversation:
        if message.get("role") == "user":
            evaluation = message.get("evaluation")

            if evaluation:
                evaluations.append(evaluation)

    # No evaluations available
    if not evaluations:
        return {
            "overall_score": 0,
            "technical_score": 0,
            "communication_score": 0,
            "confidence_score": 0,
            "relevance_score": 0,
            "problem_solving_score": 0,
            "strengths": [],
            "weaknesses": [],
            "recommendations": []
        }

    # Calculate averages
    def average(key):
        values = [
            evaluation.get(key, 0)
            for evaluation in evaluations
            if isinstance(evaluation.get(key, 0), (int, float))
        ]

        if not values:
            return 0

        return round(sum(values) / len(values), 1)

    technical_score = average("technical_correctness")
    communication_score = average("communication")
    confidence_score = average("confidence")
    relevance_score = average("relevance")
    problem_solving_score = average("problem_solving")
    overall_score = average("overall_score")

    # Collect strengths and weaknesses
    strengths = []
    weaknesses = []

    for evaluation in evaluations:

        strength = evaluation.get("strength", "").strip()
        weakness = evaluation.get("weakness", "").strip()

        if strength and strength not in strengths:
            strengths.append(strength)

        if weakness and weakness not in weaknesses:
            weaknesses.append(weakness)

    # Generate recommendations based on scores
    recommendations = []

    if technical_score < 7:
        recommendations.append(
            "Strengthen your core technical concepts and practice explaining your approach clearly."
        )

    if communication_score < 7:
        recommendations.append(
            "Practice giving structured and concise answers instead of jumping between ideas."
        )

    if confidence_score < 7:
        recommendations.append(
            "Practice speaking through your reasoning confidently, even when you are unsure."
        )

    if relevance_score < 7:
        recommendations.append(
            "Focus on directly answering the question before adding extra details."
        )

    if problem_solving_score < 7:
        recommendations.append(
            "Practice breaking problems into smaller steps and explaining your reasoning."
        )

    if not recommendations:
        recommendations.append(
            "Excellent performance. Continue practicing increasingly difficult interview problems."
        )

    return {
        "overall_score": overall_score,
        "technical_score": technical_score,
        "communication_score": communication_score,
        "confidence_score": confidence_score,
        "relevance_score": relevance_score,
        "problem_solving_score": problem_solving_score,
        "strengths": strengths[:5],
        "weaknesses": weaknesses[:5],
        "recommendations": recommendations[:5],
        "questions_evaluated": len(evaluations)
    }
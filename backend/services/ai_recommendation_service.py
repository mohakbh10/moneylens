from services.supabase_service import (
    get_insight_by_upload_id,
    get_transactions_by_upload_id,
    update_ai_recommendations,
)

from services.recommendation_prompt import (
    build_recommendation_prompt,
)

from services.gemini_client import (
    client,
    MODEL,
)


def generate_ai_recommendations(
    upload_id: str,
):

    insight = get_insight_by_upload_id(
        upload_id
    )

    if not insight:
        raise Exception(
            "Insight not found"
        )

    if insight.get(
        "ai_recommendations"
    ):

        return {
            "recommendations":
            insight[
                "ai_recommendations"
            ]
        }

    transactions = (
        get_transactions_by_upload_id(
            upload_id
        )
    )

    prompt = (
        build_recommendation_prompt(
            insight,
            transactions,
        )
    )

    response = (
        client.models.generate_content(
            model=MODEL,
            contents=prompt,
        )
    )

    recommendations = (
        response.text.strip()
    )

    update_ai_recommendations(
        upload_id,
        recommendations,
    )

    return {
        "recommendations":
        recommendations
    }
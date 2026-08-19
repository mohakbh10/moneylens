from services.supabase_service import (
    get_insight_by_upload_id,
    get_transactions_by_upload_id,
    update_ai_recommendations,
)

from services.recommendation_prompt import (
    build_recommendation_prompt,
)

from services.gemini_client import generate_content
from fastapi import HTTPException


def generate_ai_recommendations(
    upload_id: str,
):

    insight = get_insight_by_upload_id(
        upload_id
    )

    if not insight:
        raise HTTPException(
            status_code=404,
            detail="Statement analysis not found.",
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

    recommendations = generate_content(contents=prompt)

    update_ai_recommendations(
        upload_id,
        recommendations,
    )

    return {
        "recommendations":
        recommendations
    }

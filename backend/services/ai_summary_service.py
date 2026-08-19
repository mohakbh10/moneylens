from services.supabase_service import (
    get_insight_by_upload_id,
    get_transactions_by_upload_id,
    update_ai_summary,
)

from services.prompt_builder import (
    build_summary_prompt,
)

from services.gemini_client import generate_content
from fastapi import HTTPException

def generate_ai_summary(upload_id: str):

    insight = get_insight_by_upload_id(upload_id)

    if not insight:
        raise HTTPException(
            status_code=404,
            detail="Statement analysis not found.",
        )

    # Already cached?
    if insight.get("ai_summary"):
        return {
            "summary": insight["ai_summary"]
        }
    transactions = get_transactions_by_upload_id(upload_id)
    prompt = build_summary_prompt(
        insight,
        transactions,
    )

    summary = generate_content(contents=prompt)
    update_ai_summary(
        upload_id,
        summary,
    )
    return {
        "summary": summary
    }

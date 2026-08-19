from services.supabase_service import (
    get_insight_by_upload_id,
    get_transactions_by_upload_id,
    update_ai_summary,
)

from services.prompt_builder import (
    build_summary_prompt,
)

from services.gemini_client import client, MODEL

def generate_ai_summary(upload_id: str):

    insight = get_insight_by_upload_id(upload_id)

    if not insight:
        raise Exception("Insight not found")

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

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
    )

    summary = response.text.strip()
    update_ai_summary(
        upload_id,
        summary,
    )
    return {
        "summary": summary
    }

from services.gemini_client import generate_content
from fastapi import HTTPException

from services.supabase_service import (
    get_insight_by_upload_id,
    get_transactions_by_upload_id,
    get_ai_summary,
)

def ask_ai(upload_id, question):

    insight = get_insight_by_upload_id(
        upload_id
    )

    if not insight:
        raise HTTPException(
            status_code=404,
            detail="Statement analysis not found.",
        )

    transactions = (
        get_transactions_by_upload_id(
            upload_id
        )
    )
    summary = get_ai_summary(
        upload_id
    )

    transaction_text = "\n".join(

        [
            f"{t['transaction_date']} | "
            f"{t['description']} | "
            f"{t['category']} | "
            f"{t['amount']}"

            for t in transactions
        ]

    )

    prompt = f"""
    You are MoneyLens AI.

    You are an experienced personal finance advisor.

    Your goal is to help users understand their finances instead of simply answering questions.

    Always:

    • Explain WHY.

    • Reference actual transaction amounts whenever possible.

    • Give practical, realistic financial advice.

    • Keep answers conversational.

    • Never invent data.

    • If information is unavailable, clearly state that.

    • Encourage healthier financial habits without sounding judgmental.

    ------------------------
    FINANCIAL PROFILE
    ------------------------

    Income:
    {insight["total_income"]}

    Expense:
    {insight["total_expense"]}

    Savings:
    {insight["net_savings"]}

    Highest Spending Category:
    {insight["top_category"]}

    Largest Expense:
    {insight["largest_expense"]}

    Largest Expense Description:
    {insight["largest_expense_description"]}

    ------------------------
    AI SUMMARY
    ------------------------

    {summary}

    ------------------------
    TRANSACTIONS
    ------------------------

    {transaction_text}

    ------------------------
    USER QUESTION
    ------------------------

    {question}

    ------------------------
    RULES
    ------------------------

    - Answer only using the provided data.
    - Never invent transactions.
    - If information is unavailable, clearly say so.
    - Explain your reasoning.
    - Give actionable financial advice whenever appropriate.
    - Keep responses under 150 words.
    - Use a friendly conversational tone.
    """
    return {
        "answer": generate_content(contents=prompt)
    }

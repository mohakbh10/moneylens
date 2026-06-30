from services.gemini_client import (
    client,
    MODEL,
)

from services.supabase_service import (
    get_insight_by_upload_id,
    get_transactions_by_upload_id,
)

def ask_ai(upload_id, question):

    insight = get_insight_by_upload_id(
        upload_id
    )

    transactions = (
        get_transactions_by_upload_id(
            upload_id
        )
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

You are answering questions about ONE user's bank statement.

Financial Summary

Income: {insight["total_income"]}

Expense: {insight["total_expense"]}

Savings: {insight["net_savings"]}

Top Category:
{insight["top_category"]}

Transactions

{transaction_text}

User Question

{question}

Rules

- Answer only using this data.
- If the answer is not available,
  clearly say so.
- Keep answers under 120 words.
- Be friendly.
"""

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
    )

    return {
        "answer": response.text
    }
def build_summary_prompt(
    insight: dict,
    transactions: list,
) -> str:

    transaction_text = "\n".join(
    [
        f"{t['description']} | {t['category']} | ₹{t['amount']}"
        for t in transactions
    ]
)

    return f"""
You are MoneyLens, an AI personal finance assistant.

Using the following financial information, write a concise financial summary.

Requirements:
- Maximum 120 words.
- Mention total income.
- Mention total expenses.
- Mention net savings.
- Mention the highest spending category.
- Mention the largest expense.
- Mention one useful financial tip.
- Use a friendly, conversational tone.
- Return plain text only.

Financial Insights

Total Income: {insight["total_income"]}
Total Expense: {insight["total_expense"]}
Net Savings: {insight["net_savings"]}
Top Category: {insight["top_category"]}
Largest Expense: {insight["largest_expense"]}
Largest Expense Description: {insight["largest_expense_description"]}
Transaction Count: {insight["transaction_count"]}

Transactions

{transaction_text}
"""


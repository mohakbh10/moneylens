import json
import google.generativeai as genai
from dotenv import load_dotenv
import os
import json


load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


def extract_transactions(raw_text: str):

    prompt = f"""
You are a financial statement parser.

Extract ONLY the bank transactions from the statement.

Ignore:
- account details
- opening balance
- closing balance
- offers
- RBI notices
- footer text
- page numbers

Return ONLY valid JSON.

Format:

[
    {{
        "transaction_date": "2026-01-02",
        "description": "UPI/BUBAI ENTERPRIS",
        "amount": 80.00,
        "transaction_type": "credit"
    }}
]

Rules:

1. Return only JSON.
2. No markdown.
3. No explanations.
4. Use YYYY-MM-DD dates.
5. Amount must be numeric.
6. transaction_type must be either:
   - credit
   - debit
7. Handle multiline descriptions.
8. Extract every transaction.

Statement:

{raw_text}
"""

    response = model.generate_content(
        prompt
    )

    cleaned = response.text.strip()

    if cleaned.startswith("```json"):
        cleaned = cleaned.replace(
            "```json",
            ""
        )

    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    print(response.text)
    return json.loads(
        cleaned.strip()
    )
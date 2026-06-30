import json
from urllib import response
from dotenv import load_dotenv
import os
import json
from services.gemini_client import client, MODEL

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

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
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

def categorize_transactions(
    transactions
):

    prompt = f"""
You are a financial transaction categorizer.

Possible categories:

- Food
- Transport
- Shopping
- Bills
- Education
- Entertainment
- Income
- Transfer
- Other

Return ONLY JSON.

Format:

[
    {{
        "id":"transaction_id",
        "category":"Food"
    }}
]

Transactions:

{transactions}
"""

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
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
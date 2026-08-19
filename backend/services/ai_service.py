import json
from typing import Literal

from fastapi import HTTPException
from pydantic import BaseModel, Field, ValidationError

from services.gemini_client import generate_content


class ExtractedTransaction(BaseModel):
    transaction_date: str = Field(pattern=r"^\d{4}-\d{2}-\d{2}$")
    description: str = Field(min_length=1, max_length=1_000)
    amount: float = Field(gt=0)
    transaction_type: Literal["credit", "debit"]


class TransactionCategory(BaseModel):
    id: str = Field(min_length=1)
    category: Literal[
        "Food",
        "Transport",
        "Shopping",
        "Bills",
        "Education",
        "Entertainment",
        "Income",
        "Transfer",
        "Other",
    ]


def parse_ai_json(raw_response: str, item_model: type[BaseModel]) -> list[dict]:
    try:
        payload = json.loads(raw_response)
        if not isinstance(payload, list):
            raise ValueError("Expected a JSON array.")
        return [item_model.model_validate(item).model_dump() for item in payload]
    except (json.JSONDecodeError, ValidationError, ValueError, TypeError) as error:
        raise HTTPException(
            status_code=502,
            detail="AI returned an invalid statement analysis. Please try again.",
        ) from error

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

    response = generate_content(
        contents=prompt,
        response_mime_type="application/json",
    )

    return parse_ai_json(response, ExtractedTransaction)

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

    response = generate_content(
        contents=prompt,
        response_mime_type="application/json",
    )

    categories = parse_ai_json(response, TransactionCategory)
    transaction_ids = {str(transaction["id"]) for transaction in transactions}

    if any(category["id"] not in transaction_ids for category in categories):
        raise HTTPException(
            status_code=502,
            detail="AI returned an invalid statement analysis. Please try again.",
        )

    return categories

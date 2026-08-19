from fastapi import Depends, APIRouter, HTTPException
from uuid import uuid4

from dependencies.auth import (
    get_current_user,
)

from dependencies.upload_access import (
    verify_upload_access,
)

from models.transaction_request import (
    TransactionRequest
)

from services.supabase_service import (
    download_pdf,
    update_raw_text,
    clear_processed_statement_data,
    insert_transactions,
    save_insights
)

from services.pdf_service import (
    extract_text
)

from services.ai_service import (
    extract_transactions,
    categorize_transactions
)

from services.insight_service import (
    generate_insights,
    validate_insights,
)

from services.statement_validation import (
    validate_extracted_text,
    validate_pdf_bytes,
)

router = APIRouter()

@router.post(
    "/process-statement"
)
def process_statement(
    request: TransactionRequest,
    user=Depends(get_current_user),
):

    upload = verify_upload_access(
        str(request.upload_id),
        user["sub"],
    )
    pdf_bytes = download_pdf(
        upload["file_url"]
    )
    validate_pdf_bytes(pdf_bytes)
    raw_text = extract_text(
        pdf_bytes
    )
    validate_extracted_text(raw_text)
    if not raw_text.strip():
        raise HTTPException(
            status_code=400,
            detail="No readable text was found in this PDF.",
        )
    update_raw_text(
        str(request.upload_id),
        raw_text
    )
    transactions = (
        extract_transactions(
            raw_text
        )
    )
    if not transactions:
        raise HTTPException(
            status_code=400,
            detail=(
                "No transactions were found in this PDF. "
                "Please upload a valid bank statement."
            ),
        )
    new_transactions = []
    for transaction in transactions:
        new_transactions.append({
            **transaction,
            "id": str(uuid4()),
            "upload_id": str(request.upload_id),
            "category": None,
        })

    categories = (
        categorize_transactions(
            new_transactions
        )
    )

    categories_by_id = {
        item["id"]: item["category"]
        for item in categories
    }
    for transaction in new_transactions:
        transaction["category"] = categories_by_id.get(
            transaction["id"],
            "Other",
        )

    insights = validate_insights(
        generate_insights(
            new_transactions
        )
    )
    insights[
        "upload_id"
    ] = str(request.upload_id)

    # All AI/parsing/calculation work has completed. Only now replace prior data.
    clear_processed_statement_data(str(request.upload_id))
    insert_transactions(
        new_transactions
    )
    save_insights(
        insights
    )
    return {
        "success": True,
        "insights": insights
    }

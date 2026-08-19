from fastapi import Depends, APIRouter, HTTPException

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
    get_upload_by_id,
    download_pdf,
    update_raw_text,
    insert_transactions,
    get_transactions_by_upload_id,
    update_transaction_category,
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
    generate_insights
)

router = APIRouter()

@router.post(
    "/process-statement"
)
def process_statement(
    request: TransactionRequest,
    user=Depends(get_current_user),
):

    verify_upload_access(
        request.upload_id,
        user["sub"],
    )

    upload = get_upload_by_id(
        request.upload_id
    )
    pdf_bytes = download_pdf(
        upload["file_url"]
    )
    raw_text = extract_text(
        pdf_bytes
    )
    update_raw_text(
        request.upload_id,
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
    for transaction in transactions:

        transaction[
            "upload_id"
        ] = request.upload_id
    insert_transactions(
        transactions
    )
    transactions = (
        get_transactions_by_upload_id(
            request.upload_id
        )
    )
    categories = (
        categorize_transactions(
            transactions
        )
    )
    for item in categories:

        update_transaction_category(
            item["id"],
            item["category"]
        )
    transactions = (
        get_transactions_by_upload_id(
            request.upload_id
        )
    )
    insights = (
        generate_insights(
            transactions
        )
    )
    insights[
        "upload_id"
    ] = request.upload_id

    save_insights(
        insights
    )
    return {
        "success": True,
        "insights": insights
    }

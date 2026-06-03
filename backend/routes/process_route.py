from fastapi import APIRouter

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
    request: TransactionRequest
):

    print("STEP 1")
    upload = get_upload_by_id(
        request.upload_id
    )
    print("STEP 2")
    pdf_bytes = download_pdf(
        upload["file_url"]
    )
    print("STEP 3")
    raw_text = extract_text(
        pdf_bytes
    )
    print("STEP 4")
    update_raw_text(
        request.upload_id,
        raw_text
    )
    print("STEP 5")
    transactions = (
        extract_transactions(
            raw_text
        )
    )
    print("STEP 6")
    for transaction in transactions:

        transaction[
            "upload_id"
        ] = request.upload_id
    print("STEP 7")
    insert_transactions(
        transactions
    )
    print("STEP 8")
    transactions = (
        get_transactions_by_upload_id(
            request.upload_id
        )
    )
    print("STEP 9")
    categories = (
        categorize_transactions(
            transactions
        )
    )
    print("STEP 10")
    for item in categories:

        update_transaction_category(
            item["id"],
            item["category"]
        )
    print("STEP 11")
    transactions = (
        get_transactions_by_upload_id(
            request.upload_id
        )
    )
    print("STEP 12")
    insights = (
        generate_insights(
            transactions
        )
    )
    print("STEP 13")
    insights[
        "upload_id"
    ] = request.upload_id

    save_insights(
        insights
    )
    print("STEP 14")
    return {
        "success": True,
        "insights": insights
    }
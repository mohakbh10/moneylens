from fastapi import APIRouter

from models.transaction_request import (
    TransactionRequest
)

from services.supabase_service import (
    get_raw_text,
    insert_transactions
)

from services.ai_service import (
    extract_transactions
)

router = APIRouter()


@router.post(
    "/extract-transactions"
)
def extract_transactions_route(
    request: TransactionRequest
):

    raw_text = get_raw_text(
        request.upload_id
    )

    transactions = (
        extract_transactions(
            raw_text
        )
    )

    for transaction in transactions:

        transaction[
            "upload_id"
        ] = request.upload_id

    insert_transactions(
        transactions
    )

    return {
        "success": True,
        "transactions": len(
            transactions
        )
    }
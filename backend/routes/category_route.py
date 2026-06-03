from fastapi import APIRouter

from models.transaction_request import (
    TransactionRequest
)

from services.supabase_service import (
    get_transactions_by_upload_id,
    update_transaction_category
)

from services.ai_service import (
    categorize_transactions
)

router = APIRouter()


@router.post(
    "/categorize-transactions"
)
def categorize_route(
    request: TransactionRequest
):

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

    return {
        "success": True,
        "categorized": len(
            categories
        )
    }
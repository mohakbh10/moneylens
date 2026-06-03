from fastapi import APIRouter

from models.transaction_request import (
    TransactionRequest
)

from services.supabase_service import (
    get_transactions_by_upload_id,
    save_insights
)

from services.insight_service import (
    generate_insights
)

router = APIRouter()


@router.post(
    "/generate-insights"
)
def generate_insights_route(
    request: TransactionRequest
):

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

    insights["upload_id"] = (
        request.upload_id
    )

    save_insights(
        insights
    )

    return {
        "success": True,
        "insights": insights
    }
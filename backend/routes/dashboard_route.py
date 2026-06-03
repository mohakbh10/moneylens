from fastapi import APIRouter

from services.supabase_service import (
    get_insight_by_upload_id,
    get_transactions_by_upload_id,
    get_uploads
)

router = APIRouter()

@router.get(
    "/insights/{upload_id}"
)
def get_insight(
    upload_id: str
):

    return (
        get_insight_by_upload_id(
            upload_id
        )
    )


@router.get(
    "/transactions/{upload_id}"
)
def get_transactions(
    upload_id: str
):

    return (
        get_transactions_by_upload_id(
            upload_id
        )
    )

@router.get(
    "/uploads"
)
def get_uploads_route():

    return get_uploads()
from fastapi import HTTPException

from services.supabase_service import (
    get_upload_by_id_and_user,
)


def verify_upload_access(
    upload_id: str,
    user_id: str,
):

    upload = get_upload_by_id_and_user(
        upload_id,
        user_id,
    )

    if not upload:
        raise HTTPException(
            status_code=404,
            detail="Statement not found",
        )

    return upload
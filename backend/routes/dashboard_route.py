from dependencies.upload_access import (
    verify_upload_access,
)
from fastapi import APIRouter, Depends
from uuid import UUID

from services.supabase_service import (
    get_insight_by_upload_id,
    get_transactions_by_upload_id,
    get_uploads_by_user,
    get_statement_history_by_user,
    delete_statement,
    delete_statement_file,
)

from dependencies.auth import (
    get_current_user,
)

router = APIRouter()

@router.get(
    "/insights/{upload_id}"
)
def get_insight(
    upload_id: UUID,
    user=Depends(get_current_user),
):

    user_id = user["sub"]

    verify_upload_access(
        str(upload_id),
        user_id,
    )

    return get_insight_by_upload_id(
        str(upload_id)
    )


@router.get(
    "/transactions/{upload_id}"
)
def get_transactions(
    upload_id: UUID,
    user=Depends(get_current_user),
):

    user_id = user["sub"]

    verify_upload_access(
        str(upload_id),
        user_id,
    )

    return get_transactions_by_upload_id(
        str(upload_id)
    )

@router.get(
    "/uploads"
)
def get_uploads_route(
    user=Depends(get_current_user)
):

    user_id = user["sub"]

    return get_uploads_by_user(
        user_id
    )
#get uploads by user sub means get uploads for the currently authenticated user and not for any other user. This is important for security and privacy reasons. The user sub is a unique identifier for the authenticated user, and it ensures that the uploads returned are only those that belong to that specific user.
# this is unlike the get_uploads_by_user function in the supabase_service.py file, which takes a user_id as an argument and returns uploads for that user_id. In this route, we are using the get_current_user dependency to get the authenticated user's sub and passing it to the get_uploads_by_user function to ensure that only the uploads for the authenticated user are returned.
@router.get(
    "/statement-history"
)
def get_statement_history(
    user=Depends(get_current_user),
):

    user_id = user["sub"]

    return get_statement_history_by_user(
        user_id
    )

@router.delete(
    "/statements/{upload_id}"
)
def delete_statement_route(
    upload_id: UUID,
    user=Depends(get_current_user),
):

    user_id = user["sub"]

    upload = verify_upload_access(
        str(upload_id),
        user_id,
    )

    if upload.get("file_url"):

        delete_statement_file(
            upload["file_url"]
        )

    delete_statement(
        str(upload_id)
    )

    return {
        "success": True
    }

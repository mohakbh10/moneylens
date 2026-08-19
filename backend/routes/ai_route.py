from services.ai_recommendation_service import generate_ai_recommendations
from fastapi import APIRouter, Depends
from pydantic import (
    BaseModel,
)
from uuid import UUID
from services.ai_summary_service import (
    generate_ai_summary,
)

from dependencies.auth import (
    get_current_user,
)

from dependencies.upload_access import (
    verify_upload_access,
)


router = APIRouter()

class SummaryRequest(BaseModel):

    upload_id: UUID


@router.post("/ai-summary")
def ai_summary(
    request: SummaryRequest,
    user=Depends(get_current_user),
):

    user_id = user["sub"]

    verify_upload_access(
        str(request.upload_id),
        user_id,
    )

    return generate_ai_summary(
        str(request.upload_id)
    )

class RecommendationRequest(
    BaseModel
):
    upload_id: UUID


@router.post(
    "/ai-recommendations"
)
def ai_recommendations(
    request:
    RecommendationRequest,
    user=Depends(
        get_current_user
    ),
):

    verify_upload_access(
        str(request.upload_id),
        user["sub"],
    )

    return (
        generate_ai_recommendations(
            str(request.upload_id)
        )
    )

from fastapi import APIRouter
from pydantic import BaseModel

from services.ai_summary_service import (
    generate_ai_summary,
)

router = APIRouter()


class SummaryRequest(BaseModel):
    upload_id: str


@router.post("/ai-summary")
def ai_summary(
    request: SummaryRequest,
):

    return generate_ai_summary(
        request.upload_id
    )
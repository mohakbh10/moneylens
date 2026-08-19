from fastapi import Depends, APIRouter
from pydantic import (
    BaseModel,
    Field,
)
from uuid import UUID
from dependencies.auth import (
    get_current_user,
)

from dependencies.upload_access import (
    verify_upload_access,
)

from services.chat_service import (
    ask_ai,
)

router = APIRouter()


class ChatRequest(BaseModel):
    upload_id: UUID
    question: str = Field(

        min_length=3,

        max_length=300,

    )




@router.post("/ask-ai")
def ask_ai_route(
    request: ChatRequest,
    user=Depends(get_current_user),
):

    verify_upload_access(
        str(request.upload_id),
        user["sub"],
    )
    return ask_ai(
        str(request.upload_id),
        request.question,
    )

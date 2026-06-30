from fastapi import APIRouter
from pydantic import BaseModel

from services.chat_service import ask_ai

router = APIRouter()


class ChatRequest(BaseModel):
    upload_id: str
    question: str


@router.post("/ask-ai")
def ask_ai_route(request: ChatRequest):
    return ask_ai(
        request.upload_id,
        request.question,
    )
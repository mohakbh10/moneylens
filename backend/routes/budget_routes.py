from fastapi import APIRouter
from pydantic import BaseModel

from services.supabase_service import (
    get_budgets_by_user_and_month,
    upsert_budget,
)


router = APIRouter()


class BudgetRequest(BaseModel):
    user_id: str
    category: str
    amount: float
    month: str


@router.get("/budgets")
def get_budgets(
    user_id: str,
    month: str,
):

    return get_budgets_by_user_and_month(
        user_id,
        month,
    )


@router.post("/budgets")
def save_budget(
    request: BudgetRequest,
):

    return upsert_budget(
        request.user_id,
        request.category,
        request.amount,
        request.month,
    )
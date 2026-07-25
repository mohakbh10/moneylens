from fastapi import (
    APIRouter,
    Depends,
)

from pydantic import BaseModel

from dependencies.auth import (
    get_current_user,
)

from services.supabase_service import (
    get_budgets_by_user_and_month,
    upsert_budget,
)


router = APIRouter()


class BudgetRequest(BaseModel):
    category: str
    amount: float
    month: str


@router.get("/budgets")
def get_budgets(
    month: str,
    user=Depends(get_current_user),
):

    user_id = user["sub"]

    return get_budgets_by_user_and_month(
        user_id,
        month,
    )


@router.post("/budgets")
def save_budget(
    request: BudgetRequest,
    user=Depends(get_current_user),
):

    user_id = user["sub"]

    return upsert_budget(
        user_id,
        request.category,
        request.amount,
        request.month,
    )
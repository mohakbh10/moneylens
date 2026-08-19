from fastapi import (
    APIRouter,
    Depends,
)

from pydantic import (
    BaseModel,
    Field,
)
from typing import Annotated

from dependencies.auth import (
    get_current_user,
)

from services.supabase_service import (
    get_budgets_by_user_and_month,
    upsert_budget,
)


router = APIRouter()

Month = Annotated[str, Field(pattern=r"^\d{4}-(0[1-9]|1[0-2])$")]

class BudgetRequest(BaseModel):
    category: str = Field(
        min_length=2,
        max_length=40,

    )
    amount: float = Field(
        gt=0,

    )
    month: Month


@router.get("/budgets")
def get_budgets(
    month: Month,
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

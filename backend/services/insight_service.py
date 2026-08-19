from pydantic import BaseModel, Field


class InsightData(BaseModel):
    total_income: float
    total_expense: float
    net_savings: float
    top_category: str = Field(min_length=1, max_length=100)
    largest_expense: float = Field(ge=0)
    largest_expense_description: str
    transaction_count: int = Field(ge=1)


def validate_insights(insights: dict) -> dict:
    return InsightData.model_validate(insights).model_dump()


def generate_insights(
    transactions
):

    total_income = 0
    total_expense = 0

    largest_expense = 0
    largest_expense_description = ""

    category_totals = {}

    for txn in transactions:

        amount = float(
            txn["amount"]
        )

        category = (
            txn["category"]
            or "Other"
        )

        if (
            txn["transaction_type"]
            == "credit"
        ):
            total_income += amount

        else:
            total_expense += amount

            if amount > largest_expense:

                largest_expense = amount

                largest_expense_description = (
                    txn["description"]
                )

        category_totals[
            category
        ] = (
            category_totals.get(
                category,
                0
            )
            + amount
        )

    top_category = max(
        category_totals,
        key=category_totals.get
    )

    return {
        "total_income":
            round(
                total_income,
                2
            ),

        "total_expense":
            round(
                total_expense,
                2
            ),

        "net_savings":
            round(
                total_income
                - total_expense,
                2
            ),

        "top_category":
            top_category,

        "largest_expense":
            round(
                largest_expense,
                2
            ),

        "largest_expense_description":
            largest_expense_description,

        "transaction_count":
            len(transactions)
    }

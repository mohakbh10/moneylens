from services.supabase_client import supabase
from fastapi import HTTPException
from postgrest.exceptions import APIError

def get_uploads() -> list:

    response = (
        supabase
        .table("uploads")
        .select("*")
        .order(
            "created_at",
            desc=True
        )
        .execute()
    )

    return response.data

def get_upload_by_id(upload_id: str)-> dict | None:
    response = (
        supabase
        .table("uploads")
        .select("*")
        .eq("id", upload_id)
        .single()
        .execute()
    )   

    return response.data

def get_upload_by_id_and_user(
    upload_id: str,
    user_id: str,
):
    try:
        response = (
                supabase
                .table("uploads")
                .select("*")
                .eq("id", upload_id)
                .eq("user_id", user_id)
                .execute()
            )
    except APIError as error:
        if error.code == "22P02":
            raise HTTPException(
                status_code=400,
                detail="Invalid upload id."
            )
        raise
    
    if response.data:
        return response.data[0]

    return None

def get_uploads_by_user(
    user_id: str
):

    response = (
        supabase
        .table("uploads")
        .select("*")
        .eq("user_id", user_id)
        .order(
            "created_at",
            desc=True,
        )
        .execute()
    )

    return response.data

def update_raw_text(
    upload_id: str,
    raw_text: str
):
    (
        supabase
        .table("uploads")
        .update({
            "raw_text": raw_text
        })
        .eq("id", upload_id)
        .execute()
    )


def clear_processed_statement_data(upload_id: str):
    """Remove prior derived data before reprocessing an owned statement."""
    (
        supabase
        .table("insights")
        .delete()
        .eq("upload_id", upload_id)
        .execute()
    )
    (
        supabase
        .table("transactions")
        .delete()
        .eq("upload_id", upload_id)
        .execute()
    )

def download_pdf(file_path: str):
    bucket = supabase.storage.from_("bank-statements")

    response = bucket.download(
        file_path
    )


    return response

def get_raw_text(upload_id: str)-> str:

    response = (
        supabase
        .table("uploads")
        .select("raw_text")
        .eq("id", upload_id)
        .single()
        .execute()
    )

    return response.data["raw_text"]

def insert_transactions(
    transactions: list
):

    response = (
        supabase
        .table("transactions")
        .insert(transactions)
        .execute()
    )

    return response.data

def get_transactions_by_upload_id(
    upload_id: str
)-> list:

    response = (
        supabase
        .table("transactions")
        .select("*")
        .eq(
            "upload_id",
            upload_id
        )
        .execute()
    )

    return response.data

def update_transaction_category(
    transaction_id: str,
    category: str
):

    (
        supabase
        .table("transactions")
        .update(
            {
                "category": category
            }
        )
        .eq(
            "id",
            transaction_id
        )
        .execute()
    )

def save_insights(insight_data)->list:

    response = (
        supabase
        .table("insights")
        .insert(insight_data)
        .execute()
    )

    return response.data

def get_insight_by_upload_id(
    upload_id
):
    try:
        response = (
                supabase
                .table("insights")
                .select("*")
                .eq(
                    "upload_id",
                    upload_id
                )
                .execute()
            )
    except APIError:

        raise HTTPException(
            status_code=500,
            detail="Unable to fetch insights."
        )
    if response.data:
        return response.data[0]
    return None

def update_ai_summary(
    upload_id: str,
    summary: str
):
    (
        supabase
        .table("insights")
        .update({
            "ai_summary": summary
        })
        .eq(
            "upload_id",
            upload_id
        )
        .execute()
    )

def get_budgets_by_user_and_month(
    user_id: str,
    month: str,
):

    response = (
        supabase
        .table("budgets")
        .select("*")
        .eq("user_id", user_id)
        .eq("month", month)
        .order("category")
        .execute()
    )

    return response.data


def upsert_budget( #upsert means insert if not exists, else update
    user_id: str,
    category: str,
    amount: float,
    month: str,
):
    try:
        response = (
            supabase
            .table("budgets")
            .upsert(
                {
                    "user_id": user_id,
                    "category": category,
                    "amount": amount,
                    "month": month,
                },
                on_conflict="user_id,category,month",
            )
            .execute()
        )

        return response.data

    except APIError:
        raise HTTPException(
            status_code=500,
            detail="Unable to save budget."
        )

def get_statement_history_by_user(
    user_id: str
):

    uploads_response = (
        supabase
        .table("uploads")
        .select(
            "id, file_name, created_at"
        )
        .eq(
            "user_id",
            user_id
        )
        .order(
            "created_at",
            desc=True
        )
        .execute()
    )

    uploads = uploads_response.data

    history = []

    for upload in uploads:

        transactions_response = (
            supabase
            .table("transactions")
            .select(
                "transaction_date",
                count="exact"
            )
            .eq(
                "upload_id",
                upload["id"]
            )
            .order(
                "transaction_date"
            )
            .limit(1)
            .execute()
        )

        transactions = (
            transactions_response.data
        )

        statement_month = None

        if transactions:

            statement_month = (
                transactions[0][
                    "transaction_date"
                ][:7]
            )

        history.append({
            "id": upload["id"],
            "file_name": upload["file_name"],
            "created_at": upload["created_at"],
            "statement_month": statement_month,
            "transaction_count":
                transactions_response.count or 0,
        })

    return history

#delete statement and associated transactions and insights
def delete_statement(
    upload_id: str
):
    try: 
        # Delete insights
        (
            supabase
            .table("insights")
            .delete()
            .eq("upload_id", upload_id)
            .execute()
        )

        # Delete transactions
        (
            supabase
            .table("transactions")
            .delete()
            .eq("upload_id", upload_id)
            .execute()
        )

        # Delete upload row
        response = (
            supabase
            .table("uploads")
            .delete()
            .eq("id", upload_id)
            .execute()
        )

        return response.data
    except APIError:
        raise HTTPException(
            status_code=500,
            detail="Unable to delete statement."
        )
    
#delete statement file from supabase storage
def delete_statement_file(
    file_path: str
):

    (
        supabase
        .storage
        .from_("bank-statements")
        .remove([
            file_path
        ])
    )

def get_ai_summary(
    upload_id: str,
):
    try:
        response = (
            supabase
            .table("insights")
            .select("ai_summary")
            .eq(
                "upload_id",
                upload_id,
            )
            .single()
            .execute()
        )

        return response.data.get(
            "ai_summary"
        )
    except APIError:
        raise HTTPException(
            status_code=500,
            detail="Unable to fetch AI summary."
        )

def update_ai_recommendations(
    upload_id: str,
    recommendations: str,
):

    (
        supabase
        .table("insights")
        .update(
            {
                "ai_recommendations":
                recommendations
            }
        )
        .eq(
            "upload_id",
            upload_id
        )
        .execute()
    )

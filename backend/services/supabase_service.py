from services.supabase_client import supabase


def get_upload_by_id(upload_id: str):
    response = (
        supabase
        .table("uploads")
        .select("*")
        .eq("id", upload_id)
        .single()
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

def download_pdf(file_path: str):

    print("DOWNLOADING:", file_path)

    bucket = supabase.storage.from_("bank-statements")

    response = bucket.download(
        file_path
    )

    print(type(response))
    print(len(response))

    return response

"""
def download_pdf(file_path: str):
    response = (
        supabase
        .storage
        .from_("bank-statements")
        .download(file_path)
    )

    return response #returns bytes of the file to extract_text function
"""
def get_raw_text(upload_id: str):

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
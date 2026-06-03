from pydantic import BaseModel


class TransactionRequest(
    BaseModel
):
    upload_id: str
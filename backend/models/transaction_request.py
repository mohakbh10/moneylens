from pydantic import (
    BaseModel,
)
from uuid import UUID

class TransactionRequest(BaseModel):

    upload_id: UUID

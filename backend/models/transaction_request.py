from pydantic import (
    BaseModel,
    Field,
)

class TransactionRequest(BaseModel):

    upload_id: str = Field(

        min_length=1,

    )
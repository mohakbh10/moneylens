from pydantic import BaseModel

class ExtractRequest(BaseModel):
    upload_id: str

"""
what is this: 
This is a Pydantic model that defines the structure of the request body for the extract text endpoint. It has a single field, upload_id, which is a string that represents the ID of the uploaded PDF file for which we want to extract text. This model will be used to validate and parse the incoming request data in the extract_route.py file.
"""
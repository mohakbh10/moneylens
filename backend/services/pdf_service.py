import pdfplumber
from fastapi import HTTPException
from io import BytesIO


def extract_text(pdf_bytes: bytes) -> str:
    text = ""

    try:
        with pdfplumber.open(
            BytesIO(pdf_bytes)
        ) as pdf:

            for page in pdf.pages:

                page_text = (
                    page.extract_text()
                )

                if page_text:
                    text += (
                        page_text + "\n"
                    )
    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid PDF statement.",
        ) from error

    return text

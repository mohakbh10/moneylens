import pdfplumber
from io import BytesIO


def extract_text(pdf_bytes: bytes) -> str:
    text = ""

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

    return text
"""
this function takes in the bytes of a PDF file and extracts the text from it using the pdfplumber library. It iterates through each page of the PDF and concatenates the extracted text into a single string, which is then returned.
bytes-> fake file thru bytesio -> pdfplumber can read it and extract text from it.
"""
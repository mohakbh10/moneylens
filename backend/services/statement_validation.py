from fastapi import HTTPException


MAX_PDF_BYTES = 10 * 1024 * 1024
MAX_EXTRACTED_TEXT_CHARS = 100_000


def validate_pdf_bytes(pdf_bytes: bytes) -> None:
    if len(pdf_bytes) > MAX_PDF_BYTES:
        raise HTTPException(
            status_code=413,
            detail="Statement is too large to process.",
        )

    if not pdf_bytes or not pdf_bytes.startswith(b"%PDF-"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid PDF statement.",
        )


def validate_extracted_text(raw_text: str) -> None:
    if len(raw_text) > MAX_EXTRACTED_TEXT_CHARS:
        raise HTTPException(
            status_code=413,
            detail="Statement is too large to process.",
        )

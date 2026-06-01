from fastapi import APIRouter

from models.extract_request import (
    ExtractRequest
)

from services.supabase_service import (
    get_upload_by_id,
    update_raw_text,
    download_pdf
)

from services.pdf_service import (
    extract_text
)

router = APIRouter()


@router.post("/extract-text")
def extract_statement(
    request: ExtractRequest
):
    upload = get_upload_by_id(
        request.upload_id
    )
    print(upload)

    if not upload:
        return {
            "success": False,
            "message": "Upload not found"
        }

    pdf_bytes = download_pdf(
        upload["file_url"]
    )

    text = extract_text(
        pdf_bytes
    )

    update_raw_text(
        request.upload_id,
        text
    )

    return {
        "success": True,
        "characters": len(text)
    }
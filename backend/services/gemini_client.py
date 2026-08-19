from fastapi import HTTPException
from google import genai
from google.genai import types
from dotenv import load_dotenv
import os

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("Gemini environment is not configured.")

client = genai.Client(
    api_key=GEMINI_API_KEY,
    http_options=types.HttpOptions(
        timeout=30_000,
        retry_options=types.HttpRetryOptions(
            attempts=2,
            initial_delay=1.0,
            max_delay=3.0,
        ),
    ),
)

MODEL = "gemini-2.5-flash"


def generate_content(*, contents: str, response_mime_type: str | None = None):
    config = (
        types.GenerateContentConfig(response_mime_type=response_mime_type)
        if response_mime_type
        else None
    )

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=contents,
            config=config,
        )
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail="AI service is temporarily unavailable. Please try again.",
        ) from error

    if not response.text:
        raise HTTPException(
            status_code=502,
            detail="AI service returned an empty response. Please try again.",
        )

    return response.text.strip()

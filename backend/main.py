from fastapi import FastAPI

from services.supabase_client import supabase

from routes.extract_route import (
    router as extract_router
)

app = FastAPI()

app.include_router(
    extract_router
)
from fastapi import FastAPI

from services.supabase_client import supabase

from routes.process_route import (
    router as process_router
)
from routes.dashboard_route import (
    router as dashboard_router
)

app = FastAPI()

app.include_router(
    process_router
)

app.include_router(
    dashboard_router
)
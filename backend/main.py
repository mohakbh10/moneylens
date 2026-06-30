from fastapi import FastAPI
from fastapi.middleware.cors import (
    CORSMiddleware
)

from services.supabase_client import supabase

from routes.process_route import (
    router as process_router
)

from routes.dashboard_route import (
    router as dashboard_router
)

from routes.ai_route import (
    router as ai_router,
)

from routes.chat_routes import router as chat_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    process_router
)

app.include_router(
    dashboard_router
)

app.include_router(ai_router)

app.include_router(chat_router)
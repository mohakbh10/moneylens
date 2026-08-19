from fastapi import FastAPI
from fastapi.middleware.cors import (
    CORSMiddleware
)
import os

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
from routes.budget_routes import router as budget_router

app = FastAPI()

allowed_origins = ["http://localhost:3000"]
production_origin = os.getenv("FRONTEND_ORIGIN")
if production_origin:
    allowed_origins.append(production_origin.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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

app.include_router(budget_router)

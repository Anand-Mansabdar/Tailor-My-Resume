from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api.routes import router
from app.config import settings
from app.database import connect_to_mongo, close_mongo_connection

import logging

logging.basicConfig(
  level=logging.INFO,
  format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
  """Application lifespan events"""
  # Startup
  logger.info("Starting up application...")
  connect_to_mongo()
  yield
  # Shutdown
  logger.info("Shutting down application...")
  close_mongo_connection()

app = FastAPI(
  title=settings.app_name,
  version=settings.app_version,
  description="AI powered resume tailoring backend",
  lifespan=lifespan
)

app.add_middleware(
  CORSMiddleware,
  allow_origins=[
    "https://tailor-my-resume-frontend.onrender.com",
    "http://localhost:5173",
  ],
  allow_credentials=True,
  allow_headers=["*"],
  allow_methods=["*"],
)

app.include_router(router=router, prefix="/api")

@app.get("/")
async def root():
  return {
    "message": settings.app_name,
    "status": "Running...."
  } 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.config import settings

app = FastAPI(
  title=settings.app_name,
  version=settings.app_version,
  description="AI powered resume tailoring backend"
)

app.add_middleware(
  CORSMiddleware,
  allow_origins=[
    settings.frontend_url,
  ],
  allow_credentials=True,
  allow_headers=["*"],
  allow_methods=["*"],
)

app.include_router(router=router, prefix="/api")

@app.get("/")
async def root():
  return {
    "message": "AI Resume Tailoring API",
    "status": "Running...."
  } 
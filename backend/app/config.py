from functools import lru_cache
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()

class Settings(BaseSettings):
  groq_api_key: str = ""
  frontend_url: str = "http://localhost:5173"
  
  app_name: str = "Tailor My Resume"
  app_version: str = "0.1.0"
  
  max_mb_file_limit: int = 5
  llm_timeout_seconds: int = 60
  
  max_resume_characters: int = 30000
  max_job_description_characters:int = 15000
  
  model_config = SettingsConfigDict(
    env_file=".env",
    env_file_encoding="utf-8",
    extra="ignore",
  )
  
@lru_cache
def get_settings() -> Settings:
  return Settings()


settings = get_settings()
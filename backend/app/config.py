from functools import lru_cache
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()

class Settings(BaseSettings):
  groq_api_key: str = ""
  frontend_url: str = ""
  
  app_name: str = "Tailor My Resume"
  app_version: str = "0.1.0"
  
  model_config = SettingsConfigDict(
    env_file=".env",
    env_file_encoding="utf-8",
    extra="ignore",
  )
  
@lru_cache
def get_settings() -> Settings:
  return Settings()


settings = get_settings()
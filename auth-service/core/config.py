from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Validate environment param"""
    DATABASE_URL: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    APP_ENV: str
    
    USER_SERVICE_INTERNAL_BASE_URL: str
    
    model_config = SettingsConfigDict(env_file='.env', extra="ignore")
    
settings = Settings()
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Model cài đặt biến môi trường"""
    DATABASE_URL: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int
    MAIL_SERVER: str
    MAIL_STARTTLS: bool
    MAIL_SSL_TLS: bool
    
    AUTH_SERVICE_INTERNAL_BASE_URL: str
    
    APP_ENV: str = "development"
    
    model_config = SettingsConfigDict(env_file='.env', extra="ignore")
    
settings = Settings()
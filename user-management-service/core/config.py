from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Model cài đặt biến môi trường"""
    DATABASE_URL: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    
    model_config = SettingsConfigDict(env_file='.env', ignored_types="extra")
    
settings = Settings()
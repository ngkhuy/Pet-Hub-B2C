import enum
from typing import Optional, List
from uuid import UUID
from datetime import datetime, date, timezone
from sqlmodel import SQLModel, Field, Relationship, Column, VARCHAR
from sqlalchemy import Enum as SAEnum, JSONB
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql.expression import text

# Tạo Enum
class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"
    
class OTPType(str, enum.Enum):
    EMAIL_VERIFICATION = "email_verification"
    RESET_PASSWORD = "reset_password"
    PHONE_VERIFICATION = "phone_verification"
    
class PetType(str, enum.Enum):
    DOG = "dog"
    CAT = "cat"
    

# Định nghĩa các bảng trong DB

class User(SQLModel, table=True):
    __tablename__ = "user"
    
    id: UUID = Field(sa_column=Column("id", VARCHAR, primary_key=True, default=text("gen_random_uuid()")))
    
    
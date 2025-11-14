from sqlmodel import SQLModel, Field, text, Column
from uuid import UUID
from typing import Optional
from datetime import datetime, timezone
from sqlalchemy.sql.sqltypes import TIMESTAMP

class User(SQLModel, table=True):
    """Model CSDL cho bảng public.user"""
    __tablename__ = "user"
    
    id: Optional[UUID] = Field(default=None, primary_key=True, sa_column_kwargs=({"default": text("gen_random_uuid()")}))
    
    phone_number: str = Field(sa_column=Column("phone_number", nullable=False, unique=True, index=True))
    
    full_name: str = Field(sa_column=Column("full_name"), nullable=False)
    
    gender: str = Field(sa_column=Column("gender"), nullable=False)
    
    date_of_birth: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), sa_column=Column(TIMESTAMP(timezone=True), nullable=True))
    
    address: str = Field(sa_column=Column("address"), nullable=True)
    
    avatar_base64: str = Field(sa_column=Column("avatar_base64"), nullable=True)
    
    bio: str = Field(sa_column=Column("bio"), nullable=True)
    
    is_active: bool = Field(default=True, sa_column=Column("is_active"))
    
    
    
    
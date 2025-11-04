from enum import Enum
from typing import Optional, List
from uuid import UUID
from sqlmodel import Field, SQLModel, Relationship, Column, VARCHAR
from datetime import datetime, timezone
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql.expression import text



# Refresh Token Model
class RefreshToken(SQLModel, table=True):
    """Model lưu trữ refresh token"""
    __tablename__ = "refresh_token"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    token: str = Field(sa_column=Column("token", VARCHAR, unique=True, index=True))
    
    expired_at: datetime = Field(
        sa_column=Column(TIMESTAMP(timezone=True), nullable=False)
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(TIMESTAMP(timezone=True), nullable=False)
    )
    
    user_id: UUID = Field(foreign_key="user.id")
    
    # Định nghĩa mối quan hệ ngược lại với User
    user: "User" = Relationship(back_populates="refresh_tokens")
    
# User Models
class UserBase(SQLModel):
    """Base model cho các model user"""
    phone_number: str = Field(
        sa_column=Column("phone_number", VARCHAR, unique=True, index=True)
    )
    
class User(UserBase, table=True):
    """Model CSDL cho user"""
    __tablename__ = "user"
    
    id: Optional[UUID] = Field(
        default=None, primary_key=True, sa_column_kwargs=({"default": text("gen_random_uuid()")})
    )
    hashed_password: str
    
    # parameter nội bộ
    is_active: bool = Field(default=True)
    is_phone_verified: bool = Field(default=False, sa_column=Column("is_verified"))
    is_admin: bool = Field(default=False, nullable=False)
    
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(TIMESTAMP(timezone=True), nullable=False)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(TIMESTAMP(timezone=True), nullable=False)
    )
    
    refresh_tokens: List[RefreshToken] = Relationship(back_populates="user")


# Pydantic Models
class UserCreate(UserBase):
    """Model để tạo user mới (input)"""
    password: str

class UserRead(SQLModel):
    """Model để đọc/trả về user (output)"""
    id: UUID
    phone_number: str
    is_active: bool
    is_phone_verified: bool
    is_admin: bool
    created_at: datetime
    updated_at: datetime
    
    
# Token models

class Token(SQLModel):
    """Model để trả về JWT Token"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    
class TokenData(SQLModel):
    """Payload (nội dung) bên trong JWT"""
    phone_number: str
    is_admin: bool
    token_type: str

class TokenRefresh(SQLModel):
    """Model nhận refresh token từ body"""
    refresh_token: str
    
# Change password model
class UserChangePassword(SQLModel):
    """Model thay đổi mật khẩu"""
    old_password: str
    new_password: str
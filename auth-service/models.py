import time
from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship, Column, VARCHAR, UniqueConstraint
from pydantic import EmailStr
from datetime import datetime, timezone
from sqlalchemy.sql.sqltypes import TIMESTAMP


# --- Bảng trung gian User-Role ---
class UserRole(SQLModel, table=True):
    __tablename__ = "user_role"
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    role_id: int = Field(foreign_key="role.id", primary_key=True)

# --- Bảng Role ---
class Role(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(sa_column=Column("name", VARCHAR, unique=True, index=True))
    description: Optional[str] = None
    users: List["User"] = Relationship(back_populates="roles", link_model=UserRole)

# --- Bảng RefreshToken ---
class RefreshToken(SQLModel, table=True):
    __tablename__ = "refresh_token"
    id: Optional[int] = Field(default=None, primary_key=True)
    token: str = Field(sa_column=Column("token", VARCHAR, unique=True, index=True))
    expires_at: datetime = Field(
        sa_column=Column(TIMESTAMP(timezone=True), nullable=False)
    )
    is_revoked: bool = Field(default=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(TIMESTAMP(timezone=True), nullable=False)
    )
    user_id: int = Field(foreign_key="user.id")
    user: "User" = Relationship(back_populates="refresh_tokens")


# --- Bảng User ---
class UserBase(SQLModel):
    email: EmailStr = Field(sa_column=Column("email", VARCHAR, unique=True, index=True))
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(TIMESTAMP(timezone=True), nullable=False)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(TIMESTAMP(timezone=True), nullable=False)
    )
    roles: List[Role] = Relationship(back_populates="users", link_model=UserRole)
    refresh_tokens: List[RefreshToken] = Relationship(back_populates="user")

# --- Các model Pydantic cho API (Input/Output) ---
class UserCreate(UserBase):
    """Model để tạo user mới (input)"""
    password: str

class UserRead(UserBase):
    """Model để đọc/trả về user (output)"""
    id: int
    created_at: datetime

class Token(SQLModel):
    """Model để trả về JWT Token"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    
# Define Model for TokenData
class TokenData(SQLModel):
    """get payload"""
    email: str
    
# define refresh function for token
class TokenRefresh(SQLModel):
    """Model xoá token khỏi DB"""
    refresh_token: str
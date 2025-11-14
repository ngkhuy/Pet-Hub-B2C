from typing import Optional, List
from uuid import UUID
from enum import Enum
from sqlmodel import Field, SQLModel, Relationship, Column, VARCHAR
from datetime import datetime, timezone
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql.expression import text
from sqlalchemy import Enum as SAEnum


class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"


# Refresh Token Model
class RefreshToken(SQLModel, table=True):
    """Model lưu trữ refresh token"""

    __tablename__ = "refresh_token"

    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_token: str = Field(
        sa_column=Column("hashed_token", VARCHAR, unique=True, index=True)
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(TIMESTAMP(timezone=True), nullable=False),
    )

    user_id: UUID = Field(foreign_key="user.id")

    # Định nghĩa mối quan hệ ngược lại với User
    user: "User" = Relationship(back_populates="refresh_tokens")


# User Models
class UserBase(SQLModel):
    """Base model cho các model user"""

    email: str = Field(sa_column=Column("email", VARCHAR, unique=True, index=True))


class User(UserBase, table=True):
    """Model CSDL cho user"""

    __tablename__ = "user"

    id: Optional[UUID] = Field(
        default=None,
        primary_key=True,
        sa_column_kwargs=({"default": text("gen_random_uuid()")}),
    )
    hashed_password: str = Field(
        sa_column=Column("hashed_password", VARCHAR, nullable=False)
    )

    active_status: bool = Field(
        sa_column=Column("active_status", nullable=False, default=True)
    )

    role: UserRole = Field(
        default=UserRole.USER,
        sa_column=Column(SAEnum(UserRole, values_callable=lambda x: [e.value for e in x]), nullable=False, default=UserRole.USER.value),
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(TIMESTAMP(timezone=True), nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(TIMESTAMP(timezone=True), nullable=False),
    )

    refresh_tokens: List[RefreshToken] = Relationship(back_populates="user")


# Pydantic Models
class UserCreate(UserBase):
    """Model để tạo user mới (input)"""

    password: str


class UserRead(SQLModel):
    """Model để đọc/trả về user (output)"""

    id: UUID
    email: str
    active_status: bool
    role: str
    created_at: datetime
    updated_at: datetime


# Token models
class AccessTokenResponse(SQLModel):
    """Model để trả về JWT Access Token"""

    access_token: str
    token_type: str = "bearer"


# Change password model
class UserChangePassword(SQLModel):
    """Model thay đổi mật khẩu"""

    old_password: str
    new_password: str

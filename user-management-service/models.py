import enum
from typing import Optional, List
from uuid import UUID
from datetime import datetime, date, timezone
from sqlmodel import SQLModel, Field, Relationship, Column, VARCHAR, ForeignKey
from sqlalchemy import Enum as SAEnum, func
from sqlalchemy.dialects.postgresql import JSONB
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
    """Model CSDL cho user profile"""
    __tablename__ = "user"
    
    id: UUID = Field(primary_key=True)
    
    email: str = Field(sa_column=Column("email", VARCHAR, unique=True, nullable=False, index=True))
    
    role: UserRole = Field(
        default=UserRole.USER,
        sa_column=Column(
            SAEnum(UserRole, values_callable=lambda x: [e.value for e in x]), 
            nullable=False,
            default=UserRole.USER.value
        )
    )
    
    active_status: bool = Field(sa_column=Column("active_status", nullable=False, default=True))
    
    full_name: Optional[str] = Field(sa_column=Column("full_name", VARCHAR, nullable=True))
    
    phone_number: Optional[str] = Field(sa_column=Column("phone_number", VARCHAR, unique=True, nullable=True, index=True))
    
    avt_url: Optional[str] = Field(sa_column=Column("avt_url", VARCHAR, nullable=True))
    
    bio: Optional[str] = Field(sa_column=Column("bio", VARCHAR, nullable=True))
    
    day_of_birth: Optional[date] = Field(sa_column=Column("day_of_birth", nullable=True))
    
    is_email_verified: bool = Field(sa_column=Column("is_email_verified", nullable=False, default=False))
    
    is_phone_verified: bool = Field(sa_column=Column("is_phone_verified", nullable=False, default=False))
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), sa_column=Column("created_at", TIMESTAMP(timezone=True), nullable=False, server_default=text("now()")))
    
    updated_at: datetime = Field(
        default=None, 
        sa_column=Column(
            TIMESTAMP(timezone=True), 
            nullable=True, 
            server_default=text("now()"), 
            onupdate=func.now()
        )
    )
    
    # Relationships
    pets: List["Pet"] = Relationship(back_populates="owner")
    

class OTP(SQLModel, table=True):
    """Model CSDL cho OTP"""
    __tablename__ = "otp"
    
    id: int = Field(sa_column=Column("id", primary_key=True, autoincrement=True))
    
    hashed_otp: str = Field(sa_column=Column("hashed_otp", VARCHAR, nullable=False))
    
    user_id: UUID = Field(sa_column=Column("user_id", ForeignKey("user.id"), nullable=False))
    
    purpose: OTPType = Field(
        sa_column=Column(
            SAEnum(OTPType, values_callable=lambda x: [e.value for e in x]), 
            nullable=False
        )
    )
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), sa_column=Column("create_at", TIMESTAMP(timezone=True), nullable=False, server_default=text("now()")))
    
    expires_at: datetime = Field(sa_column=Column("expires_at", TIMESTAMP(timezone=True), nullable=False))
    

class Pet(SQLModel, table=True):
    """Model CSDL cho thú cưng"""
    __tablename__ = "pet"
    
    id: UUID = Field(
        default_factory=UUID, 
        primary_key=True, 
        sa_column_kwargs=({"server_default": text("gen_random_uuid()")})
    )
    
    name: str = Field(sa_column=Column("name", VARCHAR, nullable=False))
    
    species: PetType = Field(
        sa_column=Column(
            SAEnum(PetType, values_callable=lambda x: [e.value for e in x]), 
            nullable=False
        )
    )
    
    breed: Optional[str] = Field(sa_column=Column("breed", VARCHAR, nullable=True))
    
    birthday: Optional[date] = Field(sa_column=Column("birth", nullable=True))
    
    owner_id: UUID = Field(sa_column=Column("user_id", ForeignKey("user.id"), nullable=False))
    
    note: Optional[str] = Field(sa_column=Column("note", VARCHAR, nullable=True))
    
    # Relationships
    owner: "User" = Relationship(back_populates="pets")
    

class AuditLog(SQLModel, table=True):
    """Model CSDL lưu trữ lịch sử hoạt động"""
    __tablename__ = "audit_log"
    
    id: int = Field(sa_column=Column("id", primary_key=True, autoincrement=True))
    
    actor_id: UUID = Field(sa_column=Column("actor_id", ForeignKey("user.id"), nullable=False, index=True))
    
    action: str = Field(sa_column=Column("action", VARCHAR, nullable=False, index=True))
    
    target_id: Optional[UUID] = Field(sa_column=Column("target_id", nullable=True, index=True))
    
    detail: Optional[dict] = Field(sa_column=Column("detail", JSONB, nullable=True))
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), sa_column=Column("created_at", TIMESTAMP(timezone=True), nullable=False, server_default=text("now()")))
    
    target_type: str = Field(sa_column=Column("target_type", VARCHAR, nullable=False, index=True))
    
    
""" Pydantic models"""

class S2SUserCreate(SQLModel):
    """
    Schema để nhận tín hiệu 'user.created' từ Auth Service
    (Dùng cho RabbitMQ Consumer)
    """
    user_id: UUID
    email: str
    
# --- Schemas cho User ---

class UserRead(SQLModel):
    """Schema trả về thông tin profile của User"""
    id: UUID
    email: str
    role: UserRole
    full_name: Optional[str]
    phone_number: Optional[str]
    avatar_url: Optional[str]
    date_of_birth: Optional[date]
    bio: Optional[str]
    is_email_verified: bool
    is_phone_verified: bool
    active_status: bool

class UserUpdate(SQLModel):
    """Schema cho phép user cập nhật profile của họ"""
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    date_of_birth: Optional[date] = None


# --- Schemas cho Pet ---

class PetCreate(SQLModel):
    """Schema để tạo một thú cưng mới"""
    name: str
    species: PetType
    breed: Optional[str] = None
    birth: Optional[date] = None
    note: Optional[str] = None

class PetRead(SQLModel):
    """Schema trả về thông tin thú cưng"""
    id: UUID
    name: str
    species: PetType
    breed: Optional[str]
    birth: Optional[date]
    note: Optional[str]
    owner_id: UUID

class PetUpdate(SQLModel):
    """Schema cập nhật thông tin thú cưng"""
    name: Optional[str] = None
    species: Optional[PetType] = None
    breed: Optional[str] = None
    birth: Optional[date] = None
    note: Optional[str] = None
    
# OTP

class RequestOTP(SQLModel):
    purpose: OTPType

class VerifyOTP(SQLModel):
    purpose: OTPType
    otp: str
    
class RequestPasswordOTP(SQLModel):
    purpose: OTPType
    email: str
    
class ResetPassword(SQLModel):
    otp: str
    email: str
    new_password: str
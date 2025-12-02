# models.py
from enum import Enum
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from pytz import timezone

from sqlmodel import Field, SQLModel, Column, Relationship, TEXT
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql.expression import text
from sqlalchemy import Enum as SAEnum

VN_TZ = timezone("Asia/Ho_Chi_Minh")


# === ENUMS ===
class BookingStatus(str, Enum):
    PENDING = "Pending"
    CONFIRMED = "Confirmed"
    CANCELLED = "Cancelled"
    COMPLETED = "Completed"
    NO_SHOW = "No_show"


# === BẢNG CHÍNH ===
class VetService(SQLModel, table=True):
    __tablename__ = "VET_SERVICES"

    id: Optional[UUID] = Field(
        default=None,
        primary_key=True,
        sa_column_kwargs={"default": text("gen_random_uuid()")}
    )
    name: str = Field(index=True)
    description: Optional[str] = Field(default=None, sa_column=Column(TEXT, nullable=True))
    base_price: float
    duration_minutes: int
    follow_up_interval_days: Optional[int] = Field(default=None)
    doses_required: Optional[int] = Field(default=None)
    dose_interval_days: Optional[int] = Field(default=None)

    # Quan hệ ngược
    booking_services: List["VetBookingService"] = Relationship(back_populates="service")


class VetBooking(SQLModel, table=True):
    __tablename__ = "VET_BOOKINGS"

    id: Optional[UUID] = Field(
        default=None,
        primary_key=True,
        sa_column_kwargs={"default": text("gen_random_uuid()")}
    )
    user_id: UUID = Field(index=True)
    pet_id: UUID = Field(index=True)
    start_time: datetime = Field(sa_column=Column(TIMESTAMP(timezone=True), nullable=False))
    end_time: datetime = Field(sa_column=Column(TIMESTAMP(timezone=True), nullable=False))
    symptoms: Optional[str] = Field(default=None, sa_column=Column(TEXT, nullable=True))
    notes: Optional[str] = Field(default=None, sa_column=Column(TEXT, nullable=True))
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(VN_TZ),
        sa_column=Column(TIMESTAMP(timezone=True), nullable=False)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(VN_TZ),
        sa_column=Column(TIMESTAMP(timezone=True), nullable=False)
    )

    # Quan hệ
    booking_services: List["VetBookingService"] = Relationship(back_populates="booking")


class VetBookingService(SQLModel, table=True):
    __tablename__ = "VET_BOOKING_SERVICES"

    booking_id: UUID = Field(foreign_key="VET_BOOKINGS.id", primary_key=True)
    service_id: UUID = Field(foreign_key="VET_SERVICES.id", primary_key=True)

    booking: VetBooking = Relationship(back_populates="booking_services")
    service: VetService = Relationship(back_populates="booking_services")


# === CREATE MODELS ===
class VetBookingCreate(SQLModel):
    user_id: UUID
    pet_id: UUID
    start_time: datetime
    end_time: datetime
    service_ids: List[UUID]
    symptoms: Optional[str] = None
    notes: Optional[str] = None


class VetServiceCreate(SQLModel):
    name: str
    description: Optional[str] = None
    base_price: float
    duration_minutes: int
    follow_up_interval_days: Optional[int] = None
    doses_required: Optional[int] = None
    dose_interval_days: Optional[int] = None


# === UPDATE MODELS ===
class VetBookingUpdate(SQLModel):
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    symptoms: Optional[str] = None
    notes: Optional[str] = None


class AdminVetBookingUpdate(VetBookingUpdate):
    status: Optional[BookingStatus] = None
    
class VetServiceUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    base_price: Optional[float] = None
    duration_minutes: Optional[int] = None
    follow_up_interval_days: Optional[int] = None
    doses_required: Optional[int] = None
    dose_interval_days: Optional[int] = None

# === RESPONSE MODELS ===
class ServiceResponse(SQLModel):
    id: UUID
    name: str
    description: Optional[str]
    base_price: float
    duration_minutes: int
    follow_up_interval_days: Optional[int]
    doses_required: Optional[int]
    dose_interval_days: Optional[int]


class BookingResponse(SQLModel):
    id: UUID
    user_id: UUID
    pet_id: UUID
    start_time: datetime
    end_time: datetime
    symptoms: Optional[str]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    services: List[ServiceResponse] = []
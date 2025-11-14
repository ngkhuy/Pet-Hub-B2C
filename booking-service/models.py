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

class BookingStatus(str, Enum):
    PENDING = "Pending"
    CONFIRMED = "Confirmed"
    CANCELLED = "Cancelled"
    COMPLETED = "Completed"
    NO_SHOW = "No_show"

class PetTypes(str, Enum):
    DOG = "Dog"
    CAT = "Cat"
    ALL = "All"

class ServiceTypes(str, Enum):
    SPA = "Spa"
    HOTEL = "Hotel"

# === BẢNG CHÍNH ===
class Booking(SQLModel, table=True):
    __tablename__ = "BOOKINGS"

    id: Optional[UUID] = Field(default=None, primary_key=True, sa_column_kwargs={"default": text("gen_random_uuid()")})
    
    user_id: UUID
    pet_id: UUID
    start_time: datetime = Field(sa_column=Column(TIMESTAMP(timezone=True), nullable=False))
    end_time: datetime = Field(sa_column=Column(TIMESTAMP(timezone=True), nullable=False))  # Bắt buộc
    status: BookingStatus = Field(sa_column=Column(SAEnum(BookingStatus, name="booking_status"), nullable=False, default=BookingStatus.PENDING))
    total_price: float
    notes: Optional[str] = Field(default=None, sa_column=Column(TEXT, nullable=True))
    created_at: datetime = Field(default_factory=lambda: datetime.now(VN_TZ), sa_column=Column(TIMESTAMP(timezone=True), nullable=False))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(VN_TZ), sa_column=Column(TIMESTAMP(timezone=True), nullable=False))

    services: List["Service"] = Relationship(
        sa_relationship_kwargs={"secondary": "BOOKING_SERVICES", "lazy": "selectin"}
    )

class BookingService(SQLModel, table=True):
    __tablename__ = "BOOKING_SERVICES"
    booking_id: Optional[UUID] = Field(default=None, foreign_key="BOOKINGS.id", primary_key=True)
    service_id: Optional[UUID] = Field(default=None, foreign_key="SERVICES.id", primary_key=True)

class Service(SQLModel, table=True):
    __tablename__ = "SERVICES"
    id: Optional[UUID] = Field(default=None, primary_key=True, sa_column_kwargs={"default": text("gen_random_uuid()")})
    name: str
    service_type: ServiceTypes = Field(sa_column=Column(SAEnum(ServiceTypes, name="service_types"), nullable=False))
    pet_type: PetTypes = Field(sa_column=Column(SAEnum(PetTypes, name="pet_types"), nullable=False))
    price_per_hour: float
    duration_hours: float

# === UPDATE & FILTER ===
class BookingUpdate(SQLModel):
    notes: Optional[str] = None

class AdminBookingUpdate(BookingUpdate):
    status: Optional[BookingStatus] = None

# === RESPONSE MODELS ===
class ServiceResponse(SQLModel):
    id: UUID
    name: str
    service_type: ServiceTypes
    pet_type: PetTypes
    price_per_hour: float
    duration_hours: Optional[float] = None

class BookingResponse(SQLModel):
    id: UUID
    user_id: UUID
    pet_id: UUID
    start_time: datetime
    end_time: datetime
    total_price: float
    status: BookingStatus
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    services: List[ServiceResponse] = []

class CareBookingResponse(BookingResponse): pass
class HotelBookingResponse(BookingResponse): pass

# === CREATE MODELS ===
class CareBookingCreate(SQLModel):
    user_id: UUID
    pet_id: UUID
    start_time: datetime
    service_ids: List[UUID]
    notes: Optional[str] = None

class HotelBookingCreate(SQLModel):
    user_id: UUID
    pet_id: UUID
    start_time: datetime
    hotel_hours: float  # Người dùng nhập số giờ
    service_id: UUID    # Chỉ 1 service loại Hotel
    notes: Optional[str] = None
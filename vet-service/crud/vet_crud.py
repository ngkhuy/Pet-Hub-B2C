# vet_crud.py
from typing import List, Optional
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from sqlalchemy.orm import selectinload
from uuid import UUID
from pytz import timezone
from datetime import datetime
from models import (
    VetBooking, VetBookingService, VetService, VetServiceCreate,
    VetBookingCreate, VetBookingUpdate, ServiceResponse, BookingResponse
)

VN_TZ = timezone("Asia/Ho_Chi_Minh")

async def create_booking(
    db: AsyncSession,
    booking_in: VetBookingCreate
) -> BookingResponse:
    # Kiểm tra trùng lịch
    overlap = await db.exec(
        select(VetBooking).where(
            VetBooking.pet_id == booking_in.pet_id,
            VetBooking.start_time < booking_in.end_time,
            VetBooking.end_time > booking_in.start_time
        )
    )
    if overlap.first():
        raise ValueError("Pet đã có lịch hẹn trùng thời gian")

    # Tạo booking
    booking = VetBooking(**booking_in.dict(exclude={"service_ids"}))
    db.add(booking)
    await db.flush()

    # Gắn dịch vụ
    for service_id in booking_in.service_ids:
        link = VetBookingService(booking_id=booking.id, service_id=service_id)
        db.add(link)

    await db.commit()
    await db.refresh(booking)

    return await get_booking_by_id(db, booking.id)


async def get_booking_by_id(db: AsyncSession, booking_id: UUID) -> Optional[BookingResponse]:
    result = await db.exec(
        select(VetBooking).where(VetBooking.id == booking_id)
        .options(selectinload(VetBooking.booking_services).joinedload(VetBookingService.service))
    )
    booking = result.first()
    if not booking:
        return None

    services = [
        ServiceResponse.from_orm(bs.service)
        for bs in booking.booking_services
    ]

    return BookingResponse(
        **booking.dict(),
        services=services
    )


async def get_bookings(
    db: AsyncSession,
    user_id: Optional[UUID] = None,
    pet_id: Optional[UUID] = None,
    skip: int = 0,
    limit: int = 100
) -> List[BookingResponse]:
    stmt = select(VetBooking).options(
        selectinload(VetBooking.booking_services).joinedload(VetBookingService.service)
    )

    if user_id:
        stmt = stmt.where(VetBooking.user_id == user_id)
    if pet_id:
        stmt = stmt.where(VetBooking.pet_id == pet_id)

    stmt = stmt.offset(skip).limit(limit)
    result = await db.exec(stmt)
    bookings = result.all()

    return [
        BookingResponse(
            **b.dict(),
            services=[ServiceResponse.from_orm(bs.service) for bs in b.booking_services]
        )
        for b in bookings
    ]


async def update_booking(
    db: AsyncSession,
    booking_id: UUID,
    update_data: VetBookingUpdate
) -> Optional[BookingResponse]:
    result = await db.exec(select(VetBooking).where(VetBooking.id == booking_id))
    booking = result.first()
    if not booking:
        return None

    update_dict = update_data.dict(exclude_unset=True)
    for key, val in update_dict.items():
        setattr(booking, key, val)
    booking.updated_at = datetime.now(VN_TZ)

    await db.commit()
    await db.refresh(booking)
    return await get_booking_by_id(db, booking_id)


async def delete_booking(db: AsyncSession, booking_id: UUID) -> bool:
    result = await db.exec(select(VetBooking).where(VetBooking.id == booking_id))
    booking = result.first()
    if not booking:
        return False

    # Xóa quan hệ
    await db.exec(
        VetBookingService.delete().where(VetBookingService.booking_id == booking_id)
    )
    await db.delete(booking)
    await db.commit()
    return True


# === SERVICE CRUD ===
async def create_service(db: AsyncSession, service_in: VetServiceCreate) -> VetService:
    service = VetService(**service_in.dict())
    db.add(service)
    await db.commit()
    await db.refresh(service)
    return service


async def get_services(db: AsyncSession) -> List[VetService]:
    result = await db.exec(select(VetService))
    return result.all()
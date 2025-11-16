from typing import Optional, List
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from sqlalchemy import and_
from sqlalchemy.orm import selectinload
from uuid import UUID
from datetime import datetime, timedelta
from pytz import timezone
from models import Booking, Service, HotelBookingCreate, ServiceTypes

VN_TZ = timezone("Asia/Ho_Chi_Minh")

async def get_all_bookings(db: AsyncSession, limit: int = 100, offset: int = 0) -> List[Booking]:
    statement = (
        select(Booking)
        .options(selectinload(Booking.services))
        .where(Booking.services.any(Service.service_type == ServiceTypes.HOTEL))
        .limit(limit)
        .offset(offset)
    )
    result = await db.exec(statement)
    return result.all()

async def get_bookings_by_user(
    db: AsyncSession,
    user_id: UUID,
    limit: int = 100,
    offset: int = 0
) -> List[Booking]:
    statement = (
        select(Booking)
        .options(selectinload(Booking.services))
        .where(
            Booking.user_id == user_id,
            Booking.services.any(Service.service_type == ServiceTypes.HOTEL)
        )
        .limit(limit)
        .offset(offset)
    )
    result = await db.exec(statement)
    return result.all()

async def get_all_services(db: AsyncSession, limit: int = 100, offset: int = 0) -> List[Service]:
    statement = (
        select(Service)
        .where(Service.service_type == ServiceTypes.HOTEL)
        .limit(limit)
        .offset(offset)
    )
    result = await db.exec(statement)
    return result.all()

async def add_hotel_booking(db: AsyncSession, data: HotelBookingCreate) -> Booking:
    # 1. Lấy service Hotel
    service_statement = select(Service).where(
        Service.id == data.service_id,
        Service.service_type == ServiceTypes.HOTEL
    )
    result = await db.exec(service_statement)
    service = result.first()

    if not service:
        raise ValueError("Service Hotel không tồn tại hoặc không hợp lệ")

    # 2. Tính end_time
    end_time = data.start_time + timedelta(hours=data.hotel_hours)

    # 3. Tính giá
    total_price = service.price_per_hour * data.hotel_hours

    # 4. Tạo booking
    booking_data = data.model_dump(exclude={"service_id", "hotel_hours"})
    booking_data.update({
        "total_price": total_price,
        "end_time": end_time
    })
    booking = Booking(**booking_data)
    booking.services = [service]

    db.add(booking)
    await db.commit()
    db.expunge(booking)
    return booking

# async def get_booking_by_id(db: AsyncSession, id: UUID) -> Optional[Booking]:
#     statement = (
#         select(Booking)
#         .options(selectinload(Booking.services))
#         .where(Booking.id == id)
#     )
#     result = await db.exec(statement)
#     return result.first()

# async def update_booking_status(db: AsyncSession, booking_id: UUID, update_data: BookingUpdate) -> Optional[Booking]:
#     statement = select(Booking).where(Booking.id == booking_id)
#     result = await db.exec(statement)
#     booking = result.first()
#     if not booking:
#         return None

#     update_dict = update_data.model_dump(exclude_unset=True)
#     for key, value in update_dict.items():
#         setattr(booking, key, value)

#     booking.updated_at = datetime.now(VN_TZ)
#     db.add(booking)
#     await db.commit()
#     await db.refresh(booking)
#     return booking

async def get_bookings_by_time_range(
    db: AsyncSession,
    start_from: Optional[datetime] = None,
    start_to: Optional[datetime] = None,
    limit: int = 100,
    offset: int = 0
) -> List[Booking]:
    statement = (
        select(Booking)
        .options(selectinload(Booking.services))
        .where(Booking.services.any(Service.service_type == ServiceTypes.HOTEL))
    )

    if start_from or start_to:
        conditions = []
        if start_from:
            start_from = VN_TZ.localize(start_from) if start_from.tzinfo is None else start_from
            conditions.append(Booking.start_time >= start_from)
        if start_to:
            start_to = VN_TZ.localize(start_to) if start_to.tzinfo is None else start_to
            conditions.append(Booking.start_time <= start_to)
        statement = statement.where(and_(*conditions))

    statement = statement.offset(offset).limit(limit)
    result = await db.exec(statement)
    return result.all()
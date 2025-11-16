from typing import Optional, List
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from sqlalchemy import and_, or_
from sqlalchemy.orm import selectinload
from uuid import UUID
from datetime import datetime, timedelta
from pytz import timezone
from models import Booking, Service, CareBookingCreate, ServiceTypes, BookingStatus, PetTypes

VN_TZ = timezone("Asia/Ho_Chi_Minh")

async def _validate_user_pet_services(db: AsyncSession, owner: UUID, pet_id: UUID, service_ids: List[UUID]):
    # user = (await db.exec(select(User).where(User.id == owner))).first()
    # if not user:
    #     raise ValueError("User không tồn tại")

    # pet = (await db.exec(select(Pet).where(Pet.id == pet_id, Pet.owner == owner))).first()
    # if not pet:
    #     raise ValueError("Pet không tồn tại")

    services = (await db.exec(select(Service).where(
        Service.id.in_(service_ids),
        Service.service_type == ServiceTypes.SPA
    ))).all()

    if len(services) != len(service_ids):
        raise ValueError("Một hoặc nhiều service không tồn tại hoặc không phải Spa")

    return services

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
            Booking.services.any(Service.service_type == ServiceTypes.SPA)
        )
        .limit(limit)
        .offset(offset)
    )
    result = await db.exec(statement)
    return result.all()

async def get_all_bookings(db: AsyncSession, limit: int = 100, offset: int = 0) -> List[Booking]:
    statement = (
        select(Booking)
        .options(selectinload(Booking.services))
        .where(Booking.services.any(Service.service_type == ServiceTypes.SPA))
        .limit(limit)
        .offset(offset)
    )
    result = await db.exec(statement)
    return result.all()

async def get_services(
    db: AsyncSession, 
    pet_type: Optional[PetTypes] = None, 
    limit: int = 100, 
    offset: int = 0
) -> List[Service]:
    statement = select(Service).where(Service.service_type == ServiceTypes.SPA)

    if pet_type is not None:
        if pet_type == PetTypes.DOG:
            statement = statement.where(
                or_(Service.pet_type == PetTypes.DOG, Service.pet_type == PetTypes.ALL)
            )
        elif pet_type == PetTypes.CAT:
            statement = statement.where(
                or_(Service.pet_type == PetTypes.CAT, Service.pet_type == PetTypes.ALL)
            )
        elif pet_type == PetTypes.ALL:
            # Nếu truyền All → vẫn lấy All + Dog + Cat → tức là tất cả → không cần điều kiện
            pass  # không thêm where

    statement = statement.limit(limit).offset(offset)
    result = await db.exec(statement)
    return result.all()

async def add_care_booking(db: AsyncSession, data: CareBookingCreate) -> Booking:
    services = await _validate_user_pet_services(db, data.user_id, data.pet_id, data.service_ids)

    total_duration = sum(s.duration_hours for s in services)
    total_price = sum(s.price_per_hour * s.duration_hours for s in services)
    end_time = data.start_time + timedelta(hours=total_duration)

    booking_data = data.model_dump(exclude={"service_ids"})
    booking_data.update({
        "total_price": total_price,
        "end_time": end_time,
        "status": BookingStatus.PENDING
    })
    booking = Booking(**booking_data)
    booking.services = services

    db.add(booking)
    await db.commit()
    await db.refresh(booking)
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
        .where(Booking.services.any(Service.service_type == ServiceTypes.SPA))
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
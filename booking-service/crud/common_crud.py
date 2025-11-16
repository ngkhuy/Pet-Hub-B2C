from typing import Optional
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from sqlalchemy.orm import selectinload
from uuid import UUID
from datetime import datetime
from pytz import timezone
from models import Booking, BookingUpdate, BookingStatus, BookingService, ServiceCreate, Service, ServiceUpdate

VN_TZ = timezone("Asia/Ho_Chi_Minh")

async def get_booking_by_id(db: AsyncSession, booking_id: UUID) -> Optional[Booking]:
    statement = (
        select(Booking)
        .options(selectinload(Booking.services))
        .where(Booking.id == booking_id)
    )
    result = await db.exec(statement)
    return result.first()

async def update_booking_status(db: AsyncSession, booking_id: UUID, update_data: BookingUpdate) -> Optional[Booking]:
    booking = await get_booking_by_id(db, booking_id)
    if not booking:
        return None
    
    update_dict = update_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(booking, key, value)
    
    booking.updated_at = datetime.now(VN_TZ)
    db.add(booking)
    await db.commit()
    # await db.refresh(booking, with=[selectinload(Booking.services)])
    return booking

async def cancel_booking(db: AsyncSession, booking_id: UUID) -> bool:
    booking = await get_booking_by_id(db, booking_id)
    if not booking:
        return False
    
    booking.status = BookingStatus.CANCELLED
    booking.updated_at = datetime.now(VN_TZ)
    db.add(booking)
    await db.commit()
    return True

async def create_service(db: AsyncSession, data: ServiceCreate) -> Service:
    # Kiểm tra trùng tên + loại
    exists = await db.exec(
        select(Service).where(
            Service.name == data.name,
            Service.pet_type == data.pet_type,
            Service.service_type == data.service_type
        )
    )
    if exists.first():
        raise ValueError("Dịch vụ đã tồn tại với tên, loại pet và loại dịch vụ này")

    service = Service(**data.model_dump())
    db.add(service)
    await db.commit()
    await db.refresh(service)
    return service

async def update_service(db: AsyncSession, service_id: UUID, data: ServiceUpdate) -> Optional[Service]:
    # ĐÚNG: await + tách result
    result = await db.exec(select(Service).where(Service.id == service_id))
    service = result.first()
    if not service:
        return None

    update_dict = data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(service, key, value)

    db.add(service)
    await db.commit()
    await db.refresh(service)
    return service

async def delete_service(db: AsyncSession, service_id: UUID) -> bool:
    # ĐÚNG: await + tách result
    result = await db.exec(select(Service).where(Service.id == service_id))
    service = result.first()
    if not service:
        return False

    # Kiểm tra đang dùng trong booking
    in_use_result = await db.exec(
        select(BookingService).where(BookingService.service_id == service_id)
    )
    if in_use_result.first():
        raise ValueError("Không thể xóa service đang được sử dụng trong booking")

    await db.delete(service)
    await db.commit()
    return True
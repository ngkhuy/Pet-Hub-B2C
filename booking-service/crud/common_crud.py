from typing import Optional
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from sqlalchemy.orm import selectinload
from uuid import UUID
from datetime import datetime
from pytz import timezone
from models import Booking, BookingUpdate, BookingStatus

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
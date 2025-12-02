from fastapi import HTTPException
from typing import List, Optional
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from sqlalchemy.orm import selectinload
from sqlalchemy import delete
from uuid import UUID
from pytz import timezone
from datetime import datetime
from models import (
    VetBooking,
    VetBookingService,
    VetService,
    VetServiceCreate,
    VetBookingCreate,
    VetBookingUpdate,
    ServiceResponse,
    BookingResponse,
    VetServiceUpdate,
    BookingStatus
)

VN_TZ = timezone("Asia/Ho_Chi_Minh")


async def create_booking(
    db: AsyncSession, booking_in: VetBookingCreate
) -> BookingResponse:
    # Kiểm tra trùng lịch
    overlap = await db.exec(
        select(VetBooking).where(
            VetBooking.pet_id == booking_in.pet_id,
            VetBooking.start_time < booking_in.end_time,
            VetBooking.end_time > booking_in.start_time,
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


async def get_booking_by_id(
    db: AsyncSession, booking_id: UUID
) -> Optional[BookingResponse]:
    result = await db.exec(
        select(VetBooking)
        .where(VetBooking.id == booking_id)
        .options(
            selectinload(VetBooking.booking_services).joinedload(
                VetBookingService.service
            )
        )
    )
    booking = result.first()
    if not booking:
        return None

    services = [ServiceResponse.model_validate(bs.service) for bs in booking.booking_services]

    return BookingResponse(**booking.model_dump(), services=services)


# async def get_booking(
#     db: AsyncSession, user_id: Optional[UUID] = None, skip: int = 0, limit: int = 100
# ) -> List[BookingResponse]:
#     stmt = select(VetBooking).options(
#         selectinload(VetBooking.booking_services).joinedload(VetBookingService.service)
#     )

#     if user_id:
#         stmt = stmt.where(VetBooking.user_id == user_id)

#     stmt = stmt.offset(skip).limit(limit)
#     result = await db.exec(stmt)
#     bookings = result.all()

#     return [
#         BookingResponse(
#             **b.model_dump(),
#             services=[ServiceResponse.from_orm(bs.service) for bs in b.booking_services]
#         )
#         for b in bookings
#     ]


async def get_bookings(
    db: AsyncSession,
    user_id: Optional[UUID] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    status: Optional[BookingStatus] = None,
    skip: int = 0,
    limit: int = 100,
) -> List[BookingResponse]:
    stmt = select(VetBooking).options(
        selectinload(VetBooking.booking_services).joinedload(VetBookingService.service)
    )

    # Filter theo user nếu có
    if user_id:
        stmt = stmt.where(VetBooking.user_id == user_id)

    # Filter theo khoảng thời gian
    if start_date and end_date:
        # Lịch hẹn có giao nhau với khoảng [start_date, end_date]
        stmt = stmt.where(
            VetBooking.start_time < end_date, VetBooking.end_time > start_date
        )
    elif start_date:
        stmt = stmt.where(VetBooking.end_time > start_date)
    elif end_date:
        stmt = stmt.where(VetBooking.start_time < end_date)

    if status:
        stmt = stmt.where(VetBooking.status == status)

    stmt = stmt.order_by(VetBooking.start_time.asc())  # Sắp xếp theo thời gian
    stmt = stmt.offset(skip).limit(limit)

    result = await db.exec(stmt)
    bookings = result.all()

    return [
        BookingResponse(
            **b.model_dump(),
            services=[ServiceResponse.model_validate(bs.service) for bs in b.booking_services]
        )
        for b in bookings
    ]


async def update_booking(
    db: AsyncSession, booking_id: UUID, update_data: VetBookingUpdate
) -> Optional[BookingResponse]:
    result = await db.exec(select(VetBooking).where(VetBooking.id == booking_id))
    booking = result.first()
    if not booking:
        return None

    update_dict = update_data.model_dump(exclude_unset=True)
    for key, val in update_dict.items():
        setattr(booking, key, val)
    booking.updated_at = datetime.now(VN_TZ)

    await db.commit()
    await db.refresh(booking)
    return await get_booking_by_id(db, booking_id)


async def cancel_booking(
    db: AsyncSession, 
    booking_id: UUID,
    user_id: Optional[UUID] = None
) -> Optional[BookingResponse]:
    result = await db.exec(
        select(VetBooking).where(VetBooking.id == booking_id)
    )
    booking = result.first()
    
    if not booking:
        return None

    # Chỉ cho phép người dùng hủy lịch của chính mình
    if user_id:
        if str(booking.user_id) != str(user_id):
            raise HTTPException(status_code=403, detail=f"You can only cancel your own bookings")

    # Chỉ hủy được nếu đang Pending hoặc Confirmed
    if booking.status not in [BookingStatus.PENDING, BookingStatus.CONFIRMED]:
        raise HTTPException(status_code=400, detail=f"Booking is {booking.status.value} and cannot be cancelled")

    # Cập nhật trạng thái
    booking.status = BookingStatus.CANCELLED
    booking.updated_at = datetime.now(VN_TZ)

    await db.commit()
    await db.refresh(booking)

    return await get_booking_by_id(db, booking_id)


async def delete_booking(db: AsyncSession, booking_id: UUID) -> bool:
    await db.exec(
        delete(VetBookingService).where(VetBookingService.booking_id == booking_id)
    )

    result = await db.exec(
        delete(VetBooking).where(VetBooking.id == booking_id)
    )

    if result.rowcount == 0:
        return False
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

# === SERVICE CRUD - UPDATE & DELETE ===
async def update_service(
    db: AsyncSession, service_id: UUID, service_update: VetServiceUpdate
) -> Optional[VetService]:
    result = await db.exec(select(VetService).where(VetService.id == service_id))
    service = result.first()
    if not service:
        return None

    update_data = service_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(service, key, value)

    await db.commit()
    await db.refresh(service)
    return service


async def delete_service(db: AsyncSession, service_id: UUID) -> bool:
    result = await db.exec(select(VetService).where(VetService.id == service_id))
    service = result.first()
    if not service:
        return False

    # Kiểm tra xem service có đang được dùng trong booking nào không
    in_use = await db.exec(
        select(VetBookingService).where(VetBookingService.service_id == service_id).limit(1)
    )
    if in_use.first():
        raise ValueError("Không thể xóa dịch vụ đang được sử dụng trong lịch hẹn")

    await db.delete(service)
    await db.commit()
    return True
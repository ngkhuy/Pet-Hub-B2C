# vet_router.py
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Optional
from uuid import UUID

from database import get_session
from models import (
    VetBookingCreate,
    VetBookingUpdate,
    AdminVetBookingUpdate,
    VetServiceCreate,
    BookingResponse,
    VetService,
    VetServiceUpdate,
    BookingStatus
)
from crud import vet_crud as crud
from dependency.dependency import require_user, require_admin

router = APIRouter()


# ====================== BOOKING ======================
@router.get("/bookings", response_model=List[BookingResponse])
async def get_bookings(
    user_id: UUID | None = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    status: Optional[BookingStatus] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_session),
    creds: dict = Depends(require_user),
):
    if creds["role"] == "user":
        # User chỉ xem lịch của mình → vẫn hỗ trợ filter ngày
        return await crud.get_bookings(
            db,
            user_id=creds["sub"],
            start_date=start_date,
            end_date=end_date,
            status=status,
            skip=skip,
            limit=limit,
        )
    elif creds["role"] == "admin":
        return await crud.get_bookings(
            db,
            user_id=user_id,  # có thể filter theo user cụ thể
            start_date=start_date,
            end_date=end_date,
            status=status,
            skip=skip,
            limit=limit,
        )
    else:
        return await crud.get_bookings(db, skip, limit)
    
@router.post("/bookings", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    booking_in: VetBookingCreate,
    db: AsyncSession = Depends(get_session),
    creds: str = Depends(require_user),
):
    try:
        return await crud.create_booking(db, booking_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/bookings/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: UUID,
    db: AsyncSession = Depends(get_session),
    creds: str = Depends(require_user),
):
    booking = await crud.get_booking_by_id(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking


@router.patch("/bookings/{booking_id}", response_model=BookingResponse)
async def update_booking(
    booking_id: UUID,
    update_data: VetBookingUpdate,
    db: AsyncSession = Depends(get_session),
    creds: str = Depends(require_user),
):
    updated = await crud.update_booking(db, booking_id, update_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Booking not found")
    return updated

@router.patch("/booking/{booking_id}/cancel", response_model=BookingResponse)
async def cancel_booking(
    booking_id: UUID,
    db: AsyncSession = Depends(get_session),
    creds: dict = Depends(require_user),
):
    """
    Người dùng hủy lịch hẹn của chính mình
    Chỉ cho phép hủy nếu booking chưa bắt đầu và đang ở trạng thái Pending/Confirmed
    """
    if creds["role"] == "user":
        cancelled_booking = await crud.cancel_booking(db, booking_id, user_id=creds["sub"])
    elif creds["role"] == "admin":
        cancelled_booking = await crud.cancel_booking(db, booking_id)

    if not cancelled_booking:
        raise HTTPException(status_code=404, detail="Booking not found or cannot be cancelled")
    
    return cancelled_booking

# ====================== ADMIN ======================
@router.patch("/bookings/admin/{booking_id}", response_model=BookingResponse)
async def admin_update_booking(
    booking_id: UUID,
    update_data: AdminVetBookingUpdate,
    db: AsyncSession = Depends(get_session),
    creds: str = Depends(require_admin),
):
    updated = await crud.update_booking(db, booking_id, update_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Booking not found")
    return updated


@router.delete("/bookings/admin/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_booking(
    booking_id: UUID,
    db: AsyncSession = Depends(get_session),
    creds: str = Depends(require_admin),
):
    deleted = await crud.delete_booking(db, booking_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Booking not found")
    return None

# ====================== SERVICE ======================
@router.get("/services", response_model=List[VetService])
async def get_services(
    db: AsyncSession = Depends(get_session), creds: str = Depends(require_user)
):
    return await crud.get_services(db)

@router.post("/services", response_model=VetService, status_code=status.HTTP_201_CREATED)
async def create_service(
    service_in: VetServiceCreate,
    db: AsyncSession = Depends(get_session),
    creds: str = Depends(require_admin),
):
    return await crud.create_service(db, service_in)

@router.patch("/services/admin/{service_id}", response_model=VetService)
async def admin_update_service(
    service_id: UUID,
    service_update: VetServiceUpdate,
    db: AsyncSession = Depends(get_session),
    creds: str = Depends(require_admin),  # Chỉ admin được sửa
):
    updated_service = await crud.update_service(db, service_id, service_update)
    if not updated_service:
        raise HTTPException(status_code=404, detail="Service not found")
    return updated_service


@router.delete("/services/admin/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_service(
    service_id: UUID,
    db: AsyncSession = Depends(get_session),
    creds: str = Depends(require_admin),  # Chỉ admin được xóa
):
    try:
        deleted = await crud.delete_service(db, service_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Service not found")
        return None
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
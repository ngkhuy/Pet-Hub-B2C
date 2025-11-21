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
)
from crud import vet_crud as crud
from dependency.dependency import require_user, require_admin

router = APIRouter()


# ====================== BOOKING ======================
@router.post(
    "/bookings", response_model=BookingResponse, status_code=status.HTTP_201_CREATED
)
async def create_booking(
    booking_in: VetBookingCreate,
    db: AsyncSession = Depends(get_session),
    creds: str = Depends(require_user),
):
    try:
        return await crud.create_booking(db, booking_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/bookings", response_model=List[BookingResponse])
async def read_bookings(
    user_id: UUID | None = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
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
            skip=skip,
            limit=limit,
        )
    elif creds["role"] == "admin":
        return await crud.get_bookings(
            db,
            user_id=user_id,  # có thể filter theo user cụ thể
            start_date=start_date,
            end_date=end_date,
            skip=skip,
            limit=limit,
        )
    else:
        return await crud.get_bookings(db, skip, limit)


@router.get("/bookings/{booking_id}", response_model=BookingResponse)
async def read_booking(
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


@router.delete("/bookings/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_booking(
    booking_id: UUID,
    db: AsyncSession = Depends(get_session),
    creds: str = Depends(require_user),
):
    deleted = await crud.delete_booking(db, booking_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Booking not found")
    return None


# ====================== ADMIN ======================
@router.patch("/admin/bookings/{booking_id}", response_model=BookingResponse)
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


# ====================== SERVICE ======================
@router.post(
    "/services", response_model=VetService, status_code=status.HTTP_201_CREATED
)
async def create_service(
    service_in: VetServiceCreate,
    db: AsyncSession = Depends(get_session),
    creds: str = Depends(require_admin),
):
    return await crud.create_service(db, service_in)


@router.get("/services", response_model=List[VetService])
async def read_services(
    db: AsyncSession = Depends(get_session), creds: str = Depends(require_user)
):
    return await crud.get_services(db)

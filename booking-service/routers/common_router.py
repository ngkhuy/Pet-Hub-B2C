from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import Annotated
from uuid import UUID

from database import get_session
from models import BookingResponse, AdminBookingUpdate, BookingUpdate, ServiceResponse, ServiceCreate, ServiceUpdate
from crud import common_crud
from core import security
from dependency import dependency

router = APIRouter(prefix="/common", tags=["Common Booking"])

# === LẤY BOOKING THEO ID ===
@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking_by_id(
    db: Annotated[AsyncSession, Depends(get_session)],
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security.oauth2_schema)],
    booking_id: UUID
):
    dependency.authorization_credentials(credentials)
    
    booking = await common_crud.get_booking_by_id(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking không tồn tại")
    
    # Dùng BookingResponse chung (có services)
    return BookingResponse(
        **booking.model_dump(exclude={"services"}),
        services=[ServiceResponse(**s.model_dump()) for s in booking.services]
    )

# === CẬP NHẬT BOOKING ===
@router.patch("/admin/{booking_id}", response_model=BookingResponse)
async def admin_update_booking_by_id(
    booking_id: UUID,
    update_data: AdminBookingUpdate,
    db: Annotated[AsyncSession, Depends(get_session)],
    admin_data: Annotated[dict, Depends(dependency.require_admin)]
):
    booking = await common_crud.update_booking_status(db, booking_id, update_data)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking không tồn tại")
    
    return BookingResponse(
        **booking.model_dump(exclude={"services"}),
        services=[ServiceResponse(**s.model_dump()) for s in booking.services]
    )

@router.patch("/user/{booking_id}", response_model=BookingResponse)
async def user_update_booking_by_id(
    booking_id: UUID,
    update_data: BookingUpdate,
    db: Annotated[AsyncSession, Depends(get_session)],
    user_data = Depends(dependency.require_user)
):
    booking = await common_crud.update_booking_status(db, booking_id, update_data)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking không tồn tại")
    
    return BookingResponse(
        **booking.model_dump(exclude={"services"}),
        services=[ServiceResponse(**s.model_dump()) for s in booking.services]
    )

# === HỦY BOOKING (soft delete hoặc đổi status) ===
@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_booking_by_id(
    booking_id: UUID,
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security.oauth2_schema)],
    db: Annotated[AsyncSession, Depends(get_session)]
):
    dependency.authorization_credentials(credentials)

    success = await common_crud.cancel_booking(db, booking_id)
    if not success:
        raise HTTPException(status_code=404, detail="Booking không tồn tại")
    return None

@router.post("/admin/service/create", response_model=ServiceResponse)
async def admin_create_service(
    create_data: ServiceCreate,
    db: Annotated[AsyncSession, Depends(get_session)],
    admin_data: Annotated[dict, Depends(dependency.require_admin)]
):
    try:
        service = await common_crud.create_service(db, create_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return ServiceResponse(**service.model_dump())

@router.patch("/admin/service/{service_id}", response_model=ServiceResponse)
async def admin_update_service(
    service_id: UUID,
    update_data: ServiceUpdate,
    db: Annotated[AsyncSession, Depends(get_session)],
    admin_data: Annotated[dict, Depends(dependency.require_admin)]
):
    service = await common_crud.update_service(db, service_id, update_data)
    if not service:
        raise HTTPException(status_code=404, detail="Service không tồn tại")
    
    return ServiceResponse(**service.model_dump())

# === XÓA SERVICE ===
@router.delete("/admin/service/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_service(
    service_id: UUID,
    db: Annotated[AsyncSession, Depends(get_session)],
    admin_data: Annotated[dict, Depends(dependency.require_admin)]
):
    try:
        success = await common_crud.delete_service(db, service_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    if not success:
        raise HTTPException(status_code=404, detail="Service không tồn tại")
    
    return None
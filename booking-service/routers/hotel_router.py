from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import HTTPAuthorizationCredentials
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import Annotated, List, Optional
from database import get_session
from datetime import datetime
from uuid import UUID
from models import HotelBookingCreate, HotelBookingResponse, ServiceResponse
from crud import hotel_crud
from core import security
from dependency.dependency import require_admin, require_user, authorization_credentials

router = APIRouter(prefix="/hotel", tags=["Hotel Booking"])

@router.get("/", response_model=List[HotelBookingResponse])
async def get_bookings(
    db: Annotated[AsyncSession, Depends(get_session)],
    current_user: Annotated[dict, Depends(require_user)],
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    user_id = current_user["sub"]
    is_admin = current_user.get("role") == "admin"

    if is_admin:
        bookings = await hotel_crud.get_all_bookings(db, limit=limit, offset=offset)
    else:
        bookings = await hotel_crud.get_bookings_by_user(db, user_id=UUID(user_id), limit=limit, offset=offset)

    return [
        HotelBookingResponse(
            **b.model_dump(exclude={"services"}),
            services=[ServiceResponse(**s.model_dump()) for s in b.services]
        )
        for b in bookings
    ]

@router.get("/services", response_model=List[ServiceResponse])
async def get_services(
    db: Annotated[AsyncSession, Depends(get_session)],
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security.oauth2_schema)],
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    authorization_credentials(credentials)

    services = await hotel_crud.get_all_services(db, limit=limit, offset=offset)
    return [ServiceResponse(**service.model_dump()) for service in services]

@router.get("/admin/filter", response_model=List[HotelBookingResponse])
async def admin_filter_bookings(
    db: Annotated[AsyncSession, Depends(get_session)],
    admin_data = Depends(require_admin),
    start_time_from: Optional[datetime] = Query(None),
    start_time_to: Optional[datetime] = Query(None),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    bookings = await hotel_crud.get_bookings_by_time_range(db, start_time_from, start_time_to, limit, offset)
    return [
        HotelBookingResponse(
            **b.model_dump(exclude={"services"}),
            services=[ServiceResponse(**s.model_dump()) for s in b.services]
        )
        for b in bookings
    ]

@router.get("/admin/filter/{user_id}", response_model=List[HotelBookingResponse])
async def admin_get_bookings_by_user_id(
    user_id: UUID,
    db: Annotated[AsyncSession, Depends(get_session)],
    admin_data: Annotated[dict, Depends(require_admin)],
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    bookings = await hotel_crud.get_bookings_by_user(
        db,
        user_id=user_id,
        limit=limit,
        offset=offset
    )

    return [
        HotelBookingResponse(
            **booking.model_dump(exclude={"services"}),
            services=[ServiceResponse(**s.model_dump()) for s in booking.services]
        )
        for booking in bookings
    ]

@router.post("/create", response_model=HotelBookingResponse)
async def create_booking(
    db: Annotated[AsyncSession, Depends(get_session)],
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security.oauth2_schema)],
    form_data: HotelBookingCreate
):
    authorization_credentials(credentials)

    try:
        booking = await hotel_crud.add_hotel_booking(db, form_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return HotelBookingResponse(
        **booking.model_dump(exclude={"services"}),
        services=[ServiceResponse(**s.model_dump()) for s in booking.services]
    )
from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import Annotated

from database import get_session
from models import User as UserProfile, UserRole, S2SUserCreate
from crud import user_crud
from dependency import dependency

router = APIRouter()

@router.post(
    "/user-created",
    status_code=status.HTTP_201_CREATED,
    response_model=UserProfile,
    dependencies=[Depends(dependency.verify_internal_token)]
)
async def handle_user_created(
    s2s_data: S2SUserCreate, 
    db: Annotated[AsyncSession, Depends(get_session)]
):
    """
    API nội bộ (S2S) để "hứng" sự kiện 'user.created' từ Auth Service.
    """
    print(f"[UMS] Nhận được S2S event: tạo user {s2s_data.user_id}")
        
    # Kiểm tra ID
    user_by_id = await user_crud.get_user_by_id(db, s2s_data.user_id)
    if user_by_id:
        print(f" [UMS] Profile (ID) {s2s_data.user_id} đã tồn tại, bỏ qua.")
        return user_by_id

    # Kiểm tra EMAIL
    user_by_email = await user_crud.get_user_by_email(db, s2s_data.email)
    if user_by_email:
        print(f" [UMS] Lỗi: Email {s2s_data.email} đã tồn tại với một ID khác.")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Email {s2s_data.email} đã tồn tại với một ID khác."
        )
    # -----------------------

    new_profile = UserProfile(
        id=s2s_data.user_id,    
        email=s2s_data.email,   
        role=UserRole.USER,     
        active_status=True      
    )
    
    created_user = await user_crud.create_user_profile(db, new_profile)
    print(f" [UMS] Đã tạo profile thành công cho user {created_user.id}")
    
    return created_user
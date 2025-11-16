from fastapi import APIRouter, Depends, status
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
    API này sẽ tạo User Profile trong database của UMS.
    """
    print(f"[UMS] Nhận được S2S event: tạo user {s2s_data.user_id}")
    
    existing = await user_crud.get_user_by_id(db, s2s_data.user_id)
    if existing:
        print(f" [UMS] Profile cho user {s2s_data.user_id} đã tồn tại, bỏ qua.")
        return existing

    new_profile = UserProfile(
        id=s2s_data.user_id,  
        email=s2s_data.email,  
        role=UserRole.USER,  
        active_status=True     
    )
    
    # 3. Lưu vào DB
    created_user = await user_crud.create_user_profile(db, new_profile)
    print(f" [UMS] Đã tạo profile thành công cho user {created_user.id}")
    
    return created_user
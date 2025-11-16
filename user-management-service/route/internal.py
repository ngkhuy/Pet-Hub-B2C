from fastapi import APIRouter, Depends, HTTPException, status
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
    # BẢO VỆ API NÀY:
    # Chỉ chấp nhận token S2S hợp lệ (đã check scope, aud, iss)
    dependencies=[Depends(dependency.verify_internal_token)]
)
async def handle_user_created(
    # Nhận body: {"user_id": "...", "email": "..."}
    s2s_data: S2SUserCreate, 
    db: Annotated[AsyncSession, Depends(get_session)]
):
    """
    API nội bộ (S2S) để "hứng" sự kiện 'user.created' từ Auth Service.
    API này sẽ tạo User Profile trong database của UMS.
    """
    print(f"[UMS] Nhận được S2S event: tạo user {s2s_data.user_id}")
    
    # 1. Kiểm tra xem (vì lý do gì đó) profile đã tồn tại chưa
    existing = await user_crud.get_user_by_id(db, s2s_data.user_id)
    if existing:
        print(f" [UMS] Profile cho user {s2s_data.user_id} đã tồn tại, bỏ qua.")
        # Trả về 200 OK (dù đã tồn tại) để AS không báo lỗi
        return existing

    # 2. Tạo đối tượng User (profile) mới
    new_profile = UserProfile(
        id=s2s_data.user_id,    # Lấy ID từ AS
        email=s2s_data.email,  # Lấy email từ AS
        role=UserRole.USER,    # Mặc định là user
        active_status=True     # Mặc định là active
    )
    
    # 3. Lưu vào DB
    created_user = await user_crud.create_user_profile(db, new_profile)
    print(f" [UMS] Đã tạo profile thành công cho user {created_user.id}")
    
    return created_user
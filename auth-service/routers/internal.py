from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import Annotated
from uuid import UUID

from database import get_session
from models import UserRole, User
from crud import user_crud
from dependency.dependency import s2s_token_verifier

router = APIRouter()

@router.patch(
    "/users/{user_id}/status",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(s2s_token_verifier("user_status_update"))]
)
async def internal_update_status(
    user_id: UUID,
    active_status: bool,
    db: Annotated[AsyncSession, Depends(get_session)]
):
    """(S2S) Nhận lệnh từ UMS để ban/unban user."""
    
    # Dùng str() vì hàm get_user_by_id (AS) đang nhận str
    db_user = await user_crud.get_user_by_id(db, user_id=str(user_id)) 
    
    if not db_user:
        # User tồn tại ở UMS nhưng không ở AS (lỗi lạ), chỉ log
        return {"status": "warning", "detail": "User không tìm thấy trong Auth DB"}
        
    await user_crud.update_user_active_status(
        db, db_user=db_user, active_status=active_status
    )
    return {"status": "ok", "message": "User status updated in AS"}

@router.patch(
    "/users/{user_id}/role",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(s2s_token_verifier("user_role_update"))]
)
async def internal_update_role(
    user_id: UUID,
    role: UserRole,
    db: Annotated[AsyncSession, Depends(get_session)]
):
    """(S2S) Nhận lệnh từ UMS để đổi role user."""
    
    db_user = await user_crud.get_user_by_id(db, user_id=str(user_id))
    
    if not db_user:
        return {"status": "warning", "detail": "User không tìm thấy trong Auth DB"}
        
    await user_crud.update_user_role(db, db_user=db_user, role=role)
    return {"status": "ok", "message": "User role updated in AS"}

@router.patch(
    "/reset-password", # Khớp với URL mà UMS gọi [cite: user.py, line 269]
    status_code=status.HTTP_200_OK,
    # Bảo vệ: Yêu cầu S2S token có scope "reset_password" [cite: user.py, line 261]
    dependencies=[Depends(s2s_token_verifier("reset_password"))]
)
async def internal_reset_password(
    # Nhận body từ UMS [cite: user.py, line 273-276]
    body: dict, 
    db: Annotated[AsyncSession, Depends(get_session)]
):
    """(S2S) Nhận lệnh từ UMS để reset password."""
    
    user_id = body.get("user_id")
    new_hash = body.get("hashed_password")

    if not user_id or not new_hash:
        raise HTTPException(status_code=400, detail="Thiếu user_id hoặc hashed_password")

    db_user = await user_crud.get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=44, detail="User không tìm thấy trong Auth DB")
        
    # 1. Cập nhật mật khẩu mới
    await user_crud.update_user_password(db, db_user, new_hash)
    
    # 2. (Rất quan trọng) Thu hồi mọi Refresh Token cũ
    await user_crud.revoke_refresh_token(db, db_user.id)
    
    return {"status": "ok", "message": "Password reset in AS"}
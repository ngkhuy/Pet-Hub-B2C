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
    
    db_user = await user_crud.get_user_by_id(db, user_id=str(user_id)) 
    
    if not db_user:
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
    "/reset-password", 
    status_code=status.HTTP_200_OK,
    
    dependencies=[Depends(s2s_token_verifier("reset_password"))]
)
async def internal_reset_password(
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
        raise HTTPException(status_code=404, detail="User không tìm thấy trong Auth DB")
        
    #Cập nhật mật khẩu mới
    await user_crud.update_user_password(db, db_user, new_hash)
    
    #Thu hồi mọi Refresh Token cũ
    await user_crud.revoke_refresh_token(db, db_user.id)
    
    return {"status": "ok", "message": "Password reset in AS"}
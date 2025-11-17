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
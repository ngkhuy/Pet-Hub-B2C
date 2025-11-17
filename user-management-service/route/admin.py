from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import Annotated, List
from uuid import UUID

from database import get_session
from dependency import dependency
from models import (
    User, UserRead, UserRole,
    PetRead,
    AuditLog
)
from crud import user_crud, pet_crud, log_crud
from core.s2s_client import notify_role_update, notify_status_update

router = APIRouter(dependencies=[Depends(dependency.get_current_admin)])

@router.get("/users", response_model=List[User])
async def admin_get_all_users(db: Annotated[AsyncSession, Depends(get_session)],
                              skip=0,
                              limit=50):
    """[ADMIN] API lấy danh sách user"""
    users = await user_crud.get_user_list(db, offset=skip, limit=limit)
    
    return users

@router.get("/users/{user_id}", response_model=UserRead)
async def admin_get_user_by_id(user_id: UUID, db: Annotated[AsyncSession, Depends(get_session)]):
    """[ADMIN] API lấy thông tin cụ thể của user theo ID"""
    
    user = await user_crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy user")
    
    return user

@router.patch("/users/{user_id}/status", response_model=UserRead)
async def admin_update_user_active_status(user_id: UUID, active_status: bool,
                                          admin_user: Annotated[User, Depends(dependency.get_current_admin)],
                                          db: Annotated[AsyncSession, Depends(get_session)]):
    """[ADMIN] API cập nhật trạng thái hoạt động của tài khoản (ban event)"""
    db_user = await user_crud.get_user_by_id(db, user_id)
    
    if not db_user:
        raise HTTPException(status_code=404, detail="Không tìm thấy user")
    
    if db_user.id == admin_user.id:
        raise HTTPException(status_code=400, detail="Admin không thể tự ban chính mình")
    
    updated_user = await user_crud.update_user_active_status(db, db_user, active_status)
    
    # gửi s2s cho AS
    await notify_status_update(db_user.id, active_status)
    
    # ghi log
    await log_crud.create_audit_log(
        db=db,
        actor_id=admin_user.id,
        action="ADMIN_UPDATE_USER_ACTIVE",
        target_type="USER",
        target_id=db_user.id,
        details={"active_status": active_status}
    )
    
    return updated_user

@router.patch("/users/{user_id}/role", response_model=UserRead)
async def admin_update_user_role(
    user_id: UUID,
    role: UserRole,
    admin_user: Annotated[User, Depends(dependency.get_current_admin)],
    db: Annotated[AsyncSession, Depends(get_session)]
):
    """
    [Admin] Thay đổi vai trò (role) của một user.
    """
    db_user = await user_crud.get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="Không tìm thấy user")

    # Admin không thể tự tước quyền của mình
    if db_user.id == admin_user.id:
        raise HTTPException(status_code=400, detail="Admin không thể tự thay đổi vai trò của mình")
        
    updated_user = await user_crud.update_user_role(
        db=db, db_user=db_user, role=role
    )
    
    # gửi s2s cho AS
    await notify_role_update(db_user.id, role)
    
    # Ghi log
    await log_crud.create_audit_log(
        db=db,
        actor_id=admin_user.id,
        action="ADMIN_UPDATE_ROLE",
        target_type="USER",
        target_id=db_user.id,
        details={"new_role": role.value}
    )
    
    return updated_user

# API quản lý thú cưng của user
@router.get("/users/{user_id}/pets", response_model=List[PetRead])
async def admin_get_pets_for_user(
    user_id: UUID,
    db: Annotated[AsyncSession, Depends(get_session)]
):
    """
    [Admin] Lấy danh sách thú cưng của một user cụ thể.
    """
    db_user = await user_crud.get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="Không tìm thấy user")
        
    pets = await pet_crud.get_pets_by_owner_id(db=db, owner_id=user_id)
    return pets

# API xem log của admin
@router.get("/logs", response_model=List[AuditLog])
async def admin_get_audit_logs(
    db: Annotated[AsyncSession, Depends(get_session)],
    skip: int = 0,
    limit: int = 100
):
    """
    [Admin] Lấy danh sách lịch sử hành động (audit log).
    """
    logs = await log_crud.get_audit_logs(db=db, skip=skip, limit=limit)
    return logs
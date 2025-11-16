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

router = APIRouter(
    dependencies=[Depends(dependency.get_current_admin)]
)

# =======================================================
# 1. API Quản lý User (Admin)
# =======================================================

@router.get("/users", response_model=List[UserRead])
async def admin_get_all_users(
    # Các tham số Depends và có default có thể đứng lẫn lộn
    db: Annotated[AsyncSession, Depends(get_session)],
    skip: int = 0,
    limit: int = 100
):
    users = await user_crud.get_users_list(db=db, skip=skip, limit=limit)
    return users

@router.get("/users/{user_id}", response_model=UserRead)
async def admin_get_user_by_id(
    user_id: UUID, # Non-default (Path)
    db: Annotated[AsyncSession, Depends(get_session)] # Default (Depends)
):
    user = await user_crud.get_user_by_id(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy user")
    return user

@router.patch("/users/{user_id}/status", response_model=UserRead)
async def admin_update_user_status(
    user_id: UUID, # Non-default (Path)
    active_status: bool = Body(..., embed=True), # Non-default (Body)
    admin_user: Annotated[User, Depends(dependency.get_current_admin)], # Default (Depends)
    db: Annotated[AsyncSession, Depends(get_session)] # Default (Depends)
):
    db_user = await user_crud.get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="Không tìm thấy user")
    if db_user.id == admin_user.id:
        raise HTTPException(status_code=400, detail="Admin không thể tự ban chính mình")

    updated_user = await user_crud.update_user_active_status(
        db=db, db_user=db_user, active_status=active_status
    )
    
    action = "ADMIN_BAN_USER" if not active_status else "ADMIN_UNBAN_USER"
    await log_crud.create_audit_log(
        db=db,
        actor_id=admin_user.id,
        action=action,
        target_type="USER",
        target_id=db_user.id
    )
    return updated_user

@router.patch("/users/{user_id}/role", response_model=UserRead)
async def admin_update_user_role(
    user_id: UUID, # Non-default (Path)
    role: UserRole = Body(..., embed=True), # Non-default (Body)
    admin_user: Annotated[User, Depends(dependency.get_current_admin)], # Default (Depends)
    db: Annotated[AsyncSession, Depends(get_session)] # Default (Depends)
):
    db_user = await user_crud.get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="Không tìm thấy user")
    if db_user.id == admin_user.id:
        raise HTTPException(status_code=400, detail="Admin không thể tự thay đổi vai trò của mình")
        
    updated_user = await user_crud.update_user_role(
        db=db, db_user=db_user, role=role
    )
    
    await log_crud.create_audit_log(
        db=db,
        actor_id=admin_user.id,
        action="ADMIN_UPDATE_ROLE",
        target_type="USER",
        target_id=db_user.id,
        details={"new_role": role.value}
    )
    return updated_user

# =======================================================
# 2. API Quản lý Thú cưng (Admin)
# =======================================================

@router.get("/users/{user_id}/pets", response_model=List[PetRead])
async def admin_get_pets_for_user(
    user_id: UUID, # Non-default (Path)
    db: Annotated[AsyncSession, Depends(get_session)] # Default (Depends)
):
    db_user = await user_crud.get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=44, detail="Không tìm thấy user")
        
    pets = await pet_crud.get_pets_by_owner_id(db=db, owner_id=user_id)
    return pets

# =======================================================
# 3. API Xem Log (Admin)
# =======================================================

@router.get("/logs", response_model=List[AuditLog])
async def admin_get_audit_logs(
    db: Annotated[AsyncSession, Depends(get_session)], # Default (Depends)
    skip: int = 0, # Default
    limit: int = 100 # Default
):
    logs = await log_crud.get_audit_logs(db=db, skip=skip, limit=limit)
    return logs
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, OAuth2PasswordRequestForm
from fastapi.concurrency import run_in_threadpool
from sqlmodel.ext.asyncio.session import AsyncSession

from datetime import datetime, timezone, timedelta
from typing import Annotated

from database import get_session
from models import (
    UserChangePassword,
    UserCreate,
    UserRead,
    Token,
    User,
)
from crud import user_crud
from core import security
from core.config import settings
from dependency import dependency

# Config
router = APIRouter()

# sign-up endpoint
@router.post("/signup", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def signup(
    user_create: UserCreate, db: Annotated[AsyncSession, Depends(get_session)]
):
    """Đăng ký user mới"""

    # kiểm tra username đó tồn tại trong db chưa
    exist_user = await user_crud.get_user_by_email(db, email=user_create.email)
    if exist_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="email này đã được sử dụng"
        )

    # chưa tồn tại -> tạo user mới
    # băm mk
    hashed_password = await run_in_threadpool(
        security.get_password_hash, user_create.password
    )
    user_data = user_create.model_dump(exclude={"password"})
    db_user = User(**user_data, hashed_password=hashed_password)

    user = await user_crud.create_user(db, db_user)
    return user


# Login endpoint
@router.post("/login", response_model=Token, status_code=status.HTTP_200_OK)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[AsyncSession, Depends(get_session)],
):
    """Đăng nhập bằng email và password"""

    # tìm user
    user = await user_crud.get_user_by_email(db, email=form_data.username)
    if user:
        is_password_valid = await run_in_threadpool(
            security.verify_password, form_data.password, user.hashed_password
        )

    if not user or not is_password_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="SĐT hoặc mật khẩu không đúng",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.active_status:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy user",
        )

    # tìm được user -> tạo access token, refresh token cho user
    access_token = security.create_jwt_token(
        data={
            "sub": user.id,
            "email": user.email,
            "is_active": user.active_status,
            "role": user.role,
            "token_type": "access",
        },
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    refresh_token = security.create_jwt_token(
        data={
            "sub": user.id,
            "token_type": "refresh",
        },
        expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    # thu hồi refresh token cũ của user
    await user_crud.revoke_refresh_token(db, user.id)
    # lưu refresh token vào database
    await user_crud.refresh_token_to_db(db, user.id, refresh_token)

    return Token(access_token=access_token, refresh_token=refresh_token)


# Refresh token endpoint
@router.post("/refresh", status_code=status.HTTP_200_OK)
async def recreate_access_token(
    db: Annotated[AsyncSession, Depends(get_session)],
    user: Annotated[User, Depends(dependency.get_current_active_user)],
):
    """Tìm RT của user hiện tại, tạo AT mới cho user đó"""
    # tìm RT của user
    refresh_token = await user_crud.get_refresh_token(db, user.id)

    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token không hợp lệ hoặc đã hết hạn",
        )
    # nếu còn refresh token, tạo access token mới
    access_token = security.create_jwt_token(
        data={
            "sub": user.id,
            "email": user.email,
            "is_active": user.active_status,
            "role": user.role,
            "token_type": "access",
        },
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return {"access_token": access_token}


# Endpoint logout
@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    current_user: Annotated[User, Depends(dependency.get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_session)],
):
    """Đăng xuất user hiện tại"""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Lỗi hệ thống, không đăng xuất được",
        )

    # xoá access token của user
    await user_crud.revoke_refresh_token(db, user_id=current_user.id)


# Change-password endpoint
@router.post("/user/change-password", status_code=status.HTTP_200_OK)
async def change_password(
    password_data: UserChangePassword,
    curernt_user: Annotated[User, Depends(dependency.get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_session)],
):
    """Đổi mật khẩu của user hiện tại"""
    # xác minh mật khẩu cũ
    is_valid = await run_in_threadpool(
        security.verify_password,
        password_data.old_password,
        curernt_user.hashed_password,
    )
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mật khẩu hiện tại không chính xác",
        )

    # cập nhật mk mới
    new_password = await run_in_threadpool(
        security.get_password_hash, password_data.new_password
    )
    await user_crud.update_user_password(db, curernt_user, new_password)

    # xoá TẤT CẢ refresh token
    if curernt_user.id:
        await user_crud.revoke_refresh_token(db, curernt_user.id)

    return {"message": "Đổi mật khẩu thành công"}

# Get Me endpoint
@router.get("/me", response_model=UserRead)
async def read_me(
    current_user: Annotated[User, Depends(dependency.get_current_active_user)],
):
    """Lấy thông tin của người dùng đang login"""
    return current_user

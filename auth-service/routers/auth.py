from fastapi import APIRouter, Depends, HTTPException, status, Response, Cookie
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.concurrency import run_in_threadpool
from sqlmodel.ext.asyncio.session import AsyncSession

from datetime import timedelta
from typing import Annotated
from .internal_client import notify_user_created

from database import get_session
from models import (
    UserChangePassword,
    UserCreate,
    UserRead,
    AccessTokenResponse,
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
    
    # tạo message cho UMS
    try:
        await notify_user_created(str(user.id), user.email)
    except Exception as e:
        print("Lỗi khi gửi S2S event:", e)

    return user


# Login endpoint
@router.post(
    "/login", response_model=AccessTokenResponse, status_code=status.HTTP_200_OK
)
async def login(
    response: Response,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[AsyncSession, Depends(get_session)],
):
    """
    Đăng nhập bằng email/password.
    Trả về Access Token trong JSON.
    Set Refresh Token vào HttpOnly Cookie.
    """

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
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User đã bị vô hiệu hoá",
        )

    # tìm được user -> tạo access token, refresh token cho user
    access_token = security.create_jwt_token(
        data={
            "sub": str(user.id),
            "role": user.role.value,
            "token_type": "access",
        },
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    # tạo refresh token
    refresh_token = security.create_jwt_token(
        data={
            "sub": str(user.id),
            "token_type": "refresh",
        },
        expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    
    # thu hồi refresh token cũ của user
    await user_crud.revoke_refresh_token(db, user.id)
    
    # lưu refresh token mới vào db
    hashed_refresh_token = await run_in_threadpool(
        security.get_password_hash, refresh_token
    )
    
    await user_crud.refresh_token_to_db(db, user.id, hashed_refresh_token)
    
    # đưa RT vào HttpOnly cookie
    is_production = settings.APP_ENV == "production"
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=is_production,
        samesite="lax",
        path="/api/auth",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )

    return AccessTokenResponse(access_token=access_token)


# Refresh token endpoint
@router.post("/refresh", status_code=status.HTTP_200_OK, response_model=AccessTokenResponse)
async def recreate_access_token(
    db: Annotated[AsyncSession, Depends(get_session)],
    rt_cookie: Annotated[str | None, Cookie(alias="refresh_token")]
):
    """
    Đọc Refresh Token (RT) từ HttpOnly Cookie.
    Xác thực nó và trả về Access Token (AT) mới.
    """
    if rt_cookie is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Không tìm thấy RT nào")
    
    # xác thực RT
    token_data = security.decode_token(rt_cookie)
    if not token_data or token_data.get("token_type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="RT không hợp lệ")
    
    user_id = token_data.get("sub")
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="RT không hợp lệ")
    
    # tìm user và RT trong DB
    user = await user_crud.get_user_by_id(db, user_id)
    db_rt_token = await user_crud.get_refresh_token(db, user_id)
    if not user or not db_rt_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="RT không hợp lệ hoặc hết hạn")
    
    if not user.active_status:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User đã bị vô hiệu hoá")
    
    # so sánh RT từ cookie và DB
    is_rt_valid = await run_in_threadpool(security.verify_password, rt_cookie, db_rt_token.hashed_token)
    
    if not is_rt_valid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="RT không hợp lệ hoặc đã hết hạn")
    
    # hợp lệ tạo AT mới
    access_token = security.create_jwt_token(
        data={
            "sub": str(user.id),
            "role": user.role.value,
            "token_type": "access",
        },
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return AccessTokenResponse(access_token=access_token)

# Endpoint logout
@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    response: Response,
    current_user: Annotated[User, Depends(dependency.get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_session)],
):
    """Đăng xuất: Thu hồi RT trong DB và xoá cookie"""
    if not current_user:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Lỗi hệ thống, không đăng xuất được")
    
    # thu hồi RT trong DB
    await user_crud.revoke_refresh_token(db, current_user.id)
    
    # xoá cookie RT
    is_production = settings.APP_ENV == "production"
    response.delete_cookie(
        key="refresh_token",
        path="/api/auth",
        secure=is_production,
        httponly=True,
        samesite="lax"
    )

# Change-password endpoint
@router.post("/user/change-password", status_code=status.HTTP_200_OK)
async def change_password(
    password_data: UserChangePassword,
    current_user: Annotated[User, Depends(dependency.get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_session)],
):
    """Đổi mật khẩu của user hiện tại"""
    # xác minh mật khẩu cũ
    is_valid = await run_in_threadpool(
        security.verify_password,
        password_data.old_password,
        current_user.hashed_password,
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
    await user_crud.update_user_password(db, current_user, new_password)

    # xoá TẤT CẢ refresh token
    if current_user.id:
        await user_crud.revoke_refresh_token(db, current_user.id)

    return {"message": "Đổi mật khẩu thành công"}


# Get Me endpoint
@router.get("/me", response_model=UserRead)
async def read_me(
    current_user: Annotated[User, Depends(dependency.get_current_active_user)],
):
    """Lấy thông tin của người dùng đang login"""
    return current_user

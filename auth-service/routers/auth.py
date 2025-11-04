from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.concurrency import run_in_threadpool
from sqlmodel.ext.asyncio.session import AsyncSession

from datetime import datetime, timezone, timedelta
from typing import Annotated

from database import get_session
from models import ForgotPasswordRequest, UserChangePassword, UserCreate, UserRead, Token, User, TokenRefresh
from crud import user_crud
from core import security
from core.config import settings
from dependency import dependency

# Config
router = APIRouter()

# End-points API

# sign-up endpoint
@router.post("/signup", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def signup(user_create: UserCreate, db: Annotated[AsyncSession, Depends(get_session)]):
    """Đăng ký user mới"""
    
    # kiểm tra username đó tồn tại trong db chưa
    exist_user = await user_crud.get_user_by_phone(db, phone_number=user_create.phone_number)
    if exist_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="SĐT này đã được sử dụng")
    
    # băm mk
    hashed_password = await run_in_threadpool(security.get_password_hash, user_create.password)
    user_data = user_create.model_dump(exclude={"password"})
    db_user = User(**user_data, hashed_password=hashed_password)
    
    user = await user_crud.create_user(db, db_user)
    return user

# Login endpoint
@router.post("/login", response_model=Token)
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Annotated[AsyncSession, Depends(get_session)]):
    """Đăng nhập bằng sđt và password"""
    user = await user_crud.get_user_by_phone(db, phone_number=form_data.username)
    if user:
        is_password_valid = await run_in_threadpool(security.verify_password, form_data.password, user.hashed_password)

    
    if not user or not is_password_valid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
                            detail="SĐT hoặc mật khẩu không đúng",
                            headers={"WWW-Authenticate": "Bearer"})
    
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tài khoản đã bị vô hiệu hoá")

    token_data = {
        "sub": user.phone_number,
        "is_admin": user.is_admin
    }
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(token_data, access_token_expires)
    
    refresh_token = security.create_refresh_token(token_data)
    
    # lưu refresh token cho user
    refresh_token_expires = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    if user.id is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Lỗi server: không tìm thấy user")
    
    # tạo mới
    await user_crud.create_refresh_token(db, user.id, refresh_token, refresh_token_expires)
    
    return Token(access_token=access_token, refresh_token=refresh_token)

# Refresh token endpoint
@router.post("/refresh", response_model=Token)
async def refresh_access_token(token_data: TokenRefresh, db: Annotated[AsyncSession, Depends(get_session)]):
    """Làm mới access token bằng refresh token"""
    refresh_token_str = token_data.refresh_token
    
    # kiểm tra trong db
    refresh_token = await user_crud.get_valid_refresh_token(db, refresh_token_str)
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Refresh token không hợp lệ hoặc hết hạn")
    
    # giải mã refresh token
    try:
        token_payload = security.jwt.decode(refresh_token_str, settings.JWT_SECRET_KEY, [settings.JWT_ALGORITHM])
        if token_payload.get("token_type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="Refresh token không hợp lệ hoặc hết hạn")
        
        phone_number = token_payload.get("sub")
        is_admin = token_payload.get("is_admin", False)
        
        if not phone_number:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="Refresh token không hợp lệ hoặc hết hạn")
        
    except security.JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Refresh token không hợp lệ hoặc hết hạn")
        
    # tạo access token mới
    new_access_token = security.create_access_token(data={
        "sub": phone_number,
        "is_admin": is_admin
    })
    
    return Token(access_token=new_access_token, refresh_token=refresh_token_str, token_type="bearer")

# Endpoint logout
@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(current_user: Annotated[User, Depends(dependency.get_current_active_user)],
                 db: Annotated[AsyncSession, Depends(get_session)]):
    """Đăng xuất user hiện tại"""
    if not current_user:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Lỗi server: không tìm thấy user")
    
    # xoá access token của user
    await user_crud.revoke_refresh_token(db, user_id=current_user.id)
    
# Change-password endpoint
@router.post("/change-password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(password_data: UserChangePassword, curernt_user: Annotated[User, Depends(dependency.get_current_active_user)], db: Annotated[AsyncSession, Depends(get_session)]):
    """Đổi mật khẩu của user hiện tại"""
    # xác minh mật khẩu cũ
    is_valid = await run_in_threadpool(security.verify_password, password_data.old_password, curernt_user.hashed_password)
    if not is_valid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
                            detail="Mật khẩu hiện tại không chính xác")
        
    # cập nhật mk mới
    new_password = await run_in_threadpool(security.get_password_hash, password_data.new_password)
    await user_crud.update_user_password(db, curernt_user, new_password)
    
    # xoá TẤT CẢ refresh token
    if curernt_user.id:
        await user_crud.revoke_refresh_token(db, curernt_user.id)
        
    return 

# Forgot password endpoint
@router.post("/forgot-password", status_code=status.HTTP_204_NO_CONTENT)
async def forgot_password(request_data: ForgotPasswordRequest, db: Annotated[AsyncSession, Depends(get_session)]):
    """API tạo otp khi user quên mk"""
    
    # tìm user theo phone
    user = await user_crud.get_user_by_phone(db, phone_number=request_data.phone_number)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Không tìm thấy user")
        
    # nếu tìm ra user -> tạo otp gửi cho user và lưu vào db
    otp = security.generate_otp()
    hashed_otp = await run_in_threadpool(security.get_password_hash, otp)
    
    # lưu vào db đặt expired_at 5p
    await user_crud.create_or_update_otp(db, user.id, "password_reset", otp_hash=hashed_otp, expired_at=datetime.now(timezone.utc) + timedelta(minutes=5))
    
    # gửi cho user qua sms
    await security.simulate_sms(request_data.phone_number, otp)
    
    return

# Testing endpoint 
@router.get("/me", response_model=UserRead)
async def read_me(current_user: Annotated[User, Depends(dependency.get_current_active_user)]):
    """Lấy thông tin của người dùng đang login"""
    return current_user
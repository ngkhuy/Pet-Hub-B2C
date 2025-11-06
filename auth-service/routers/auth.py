from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, OAuth2PasswordRequestForm
from fastapi.concurrency import run_in_threadpool
from sqlmodel.ext.asyncio.session import AsyncSession

from datetime import datetime, timezone, timedelta
from typing import Annotated

from database import get_session
from models import (
    OTPPurpose,
    RequestOTP,
    ResetPassword,
    UserChangePassword,
    UserCreate,
    UserRead,
    Token,
    User,
    VerifyOTP,
)
from crud import user_crud
from core import security
from core.config import settings
from dependency import dependency

# Config
router = APIRouter()

# End-points API


# sign-up endpoint
@router.post("/signup", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def signup(
    user_create: UserCreate, db: Annotated[AsyncSession, Depends(get_session)]
):
    """Đăng ký user mới"""

    # kiểm tra username đó tồn tại trong db chưa
    exist_user = await user_crud.get_user_by_phone(
        db, phone_number=user_create.phone_number
    )
    if exist_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="SĐT này đã được sử dụng"
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
    """Đăng nhập bằng sđt và password"""

    # tìm user
    user = await user_crud.get_user_by_phone(db, phone_number=form_data.username)
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

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tài khoản đã bị vô hiệu hoá",
        )

    # tìm được user -> tạo access token, refresh token cho user
    access_token = security.create_jwt_token(
        data={
            "sub": user.phone_number,
            "is_admin": user.is_admin,
            "token_type": "access",
        },
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    refresh_token = security.create_jwt_token(
        data={
            "sub": user.phone_number,
            "is_admin": user.is_admin,
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
    current_user: Annotated[User, Depends(dependency.get_current_active_user)],
):
    """Tìm RT của user hiện tại, tạo AT mới cho user đó"""
    # tìm RT của user
    refresh_token = await user_crud.get_refresh_token(db, current_user.id)

    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token không hợp lệ hoặc đã hết hạn",
        )
    # nếu còn refresh token, tạo access token mới
    access_token = security.create_jwt_token(
        data={
            "sub": current_user.phone_number,
            "is_admin": current_user.is_admin,
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
            detail="Lỗi server: không tìm thấy user",
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


# Forgot password endpoint
@router.post("/otp/send-otp", status_code=status.HTTP_200_OK)
async def forgot_password(
    request_data: RequestOTP, db: Annotated[AsyncSession, Depends(get_session)]
):
    """API tạo otp khi user quên mk"""

    phone_number = request_data.phone_number

    user = await user_crud.get_user_by_phone(db, phone_number)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy user"
        )

    if request_data.purpose == OTPPurpose.phone_verification and user.is_phone_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Số điện thoại đã được xác minh",
        )

    otp = security.generate_otp()
    hashed_otp = await run_in_threadpool(security.get_password_hash, otp)

    await user_crud.create_or_update_otp(
        db,
        user_id=user.id,
        purpose=request_data.purpose.value,  # lưu enum value dạng string
        otp_hash=hashed_otp,
        expired_at=datetime.now(timezone.utc) + timedelta(minutes=5),
    )

    await security.simulate_sms(phone_number, otp)

    return {"message": f"Đã gửi OTP {request_data.purpose.value} đến số {phone_number}"}


# Verify OTP endpoint
@router.post("/otp/verify", status_code=status.HTTP_200_OK)
async def verify_otp(
    otp_data: VerifyOTP, db: Annotated[AsyncSession, Depends(get_session)]
):
    """Xác minh OTP cho nhiều mục đích"""
    phone_number = otp_data.phone_number

    # tìm user = phone number
    user = await user_crud.get_user_by_phone(db, phone_number=phone_number)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy user")
    
    # tìm otp
    otp = await user_crud.get_active_otp(db, user.id, otp_data.purpose)
    if not otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP không hợp lệ hoặc đã hết hạn",
        )

    # Nếu purpose là xác minh sđt -> sinh token verify
    if otp_data.purpose == OTPPurpose.phone_verification:
        token = security.create_jwt_token(
            data={"sub": phone_number, "token_type": "phone-verify"},
            expires_delta=timedelta(minutes=5),
        )
        return {
            "message": "Xác minh OTP thành công",
            "verify_token": token,
            "purpose": otp_data.purpose,
        }

    # Nếu purpose là reset password -> sinh token reset
    elif otp_data.purpose == OTPPurpose.password_reset:
        token = security.create_jwt_token(
            data={"sub": phone_number, "token_type": "reset-password"},
            expires_delta=timedelta(minutes=5),
        )
        return {
            "message": "Xác minh OTP thành công",
            "reset_token": token,
            "purpose": otp_data.purpose,
        }

    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Purpose không hợp lệ"
        )


# Reset Password endpoint after OTP
@router.post("/user/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(
    password_data: ResetPassword,
    credentials: Annotated[
        HTTPAuthorizationCredentials, Depends(security.reset_oauth2_schema)
    ],
    db: Annotated[AsyncSession, Depends(get_session)],
):
    """API đặt lại mk"""
    token = credentials.credentials
    token_data = security.decode_token(token)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ hoặc đã hết hạn",
        )

    # tìm user:
    phone_number = token_data.get("sub")
    user = await user_crud.get_user_by_phone(db, phone_number)
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy user")
    
    # kiểm tra type của token
    if token_data.get("token_type") != "reset-password":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token không hợp lệ")
    
    # kiểm tra expire time của token
    if token_data.get("exp") < datetime.now(timezone.utc).timestamp():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token đã hết hạn")
    
    # cập nhật mk mới cho user
    # hash pass
    new_hash_password = security.get_password_hash(password_data.new_password)
    
    await user_crud.update_user_password(db, user, new_hash_password)
    
    return {"message": "Đặt lại mật khẩu thành công"}


# Endpoint xác minh sđt cho user
@router.patch("/user/verify", status_code=status.HTTP_200_OK)
async def update_verified_status(
    credentials: Annotated[
        HTTPAuthorizationCredentials, Depends(security.reset_oauth2_schema)
    ],
    db: Annotated[AsyncSession, Depends(get_session)],
):
    """Cập nhật trạng thái xác minh sđt sau khi đã có verify_token"""
    token = credentials.credentials
    token_data = security.decode_token(token)

    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ hoặc đã hết hạn",
        )

    user = await user_crud.get_user_by_phone(db, token_data.get("sub"))
    # kiểm tra user
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy user"
        )

    # kiểm tra type
    if token_data.get("token_type") != "phone-verify":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token không hợp lệ")
    
    # kiểm tra time expires
    if token_data.get("exp") < datetime.now(timezone.utc).timestamp():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token đã hết hạn")
    
    user.is_phone_verified = True
    await db.commit()
    await db.refresh(user)

    return {"message": "Cập nhật trạng thái xác minh thành công", "verified": True}


# Get Me endpoint
@router.get("/me", response_model=UserRead)
async def read_me(
    current_user: Annotated[User, Depends(dependency.get_current_active_user)],
):
    """Lấy thông tin của người dùng đang login"""
    return current_user

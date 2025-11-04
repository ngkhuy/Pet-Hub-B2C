import asyncio
import random
from fastapi.security import OAuth2PasswordBearer
from pwdlib import PasswordHash
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone

from models import TokenData
from core.config import settings

# Config 
oauth2_schema = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
pwd_context = PasswordHash.recommended()

# Password methods
def get_password_hash(password: str):
    """Băm mật khẩu"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    """Kiểm tra mật khẩu"""
    return pwd_context.verify(plain_password, hashed_password)

# JWT methods
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """Tạo JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
    to_encode.update({"exp": expire,
                      "token_type": "access"})
    
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, settings.JWT_ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    """
    Tạo Refresh Token (payload giờ sẽ chứa token_type='refresh')
    """
    expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    expire_time = datetime.now(timezone.utc) + expires
    
    to_encode = data.copy()
    to_encode.update({
        "exp": expire_time,
        "token_type": "refresh"
    })
    
    encoded_jwt = jwt.encode(
        to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt

def decode_token(token: str, expected_type: str = "access"):
    """
    Giải mã Token, kiểm tra type, và trả về payload (dưới dạng TokenData).
    Mặc định, hàm này CHỈ chấp nhận "access" token.
    """
    try:
        payload = jwt.decode(
            token, key=settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        
        if payload.get("token_type") != expected_type:
            return None

        phone_number: str | None = payload.get("sub")
        is_admin: bool = payload.get("is_admin", False)
        
        if phone_number is None:
            return None
            
        return TokenData(
            phone_number=phone_number,
            is_admin=is_admin,
            token_type=expected_type
        )
    except JWTError:
        # Token hết hạn, sai chữ ký, hoặc không hợp lệ
        return None

# OTP methods
def generate_otp(length: int = 6):
    """Hàm tạo OTP"""
    return "".join([str(random.randint(0, 9)) for _ in range(length)])

# Hàm giả lập sms gửi qua console thay vì sđt thật
async def simulate_sms(phone_number: str, otp: str):
    print("------------------------------------------------")
    print(f"MOCK SMS: Gửi OTP {otp} đến số điện thoại {phone_number}")
    print("------------------------------------------------")
    
    await asyncio.sleep(0)
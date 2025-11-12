import asyncio
import random
from fastapi.security import OAuth2PasswordBearer, HTTPBearer
from pwdlib import PasswordHash
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone

from core.config import settings

# Config
# Schema cho access token (login)
oauth2_schema = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login", scheme_name="Access Token Auth"
)

# Schema cho reset token (verify OTP)
reset_oauth2_schema = HTTPBearer(scheme_name="Reset Token Auth")

pwd_context = PasswordHash.recommended()


# Password methods
def get_password_hash(password: str):
    """Băm mật khẩu"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    """Kiểm tra mật khẩu"""
    return pwd_context.verify(plain_password, hashed_password)


# JWT methods
def create_jwt_token(data: dict, expires_delta: timedelta | None = None):
    """Tạo JWT Token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, settings.JWT_ALGORITHM)

    return encoded_jwt


def decode_token(token: str):
    """
    Giải mã Token, kiểm tra type, và trả về payload
    """
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, [settings.JWT_ALGORITHM])
        if payload is None:
            return None

        return payload

    except JWTError:
        # Token hết hạn, sai chữ ký, hoặc không hợp lệ
        return None


# OTP methods
def generate_otp(length: int = 6):
    """Hàm tạo OTP"""
    return "".join([str(random.randint(0, 9)) for _ in range(length)])


# Hàm giả lập sms gửi qua console thay vì sđt thật
async def simulate_sms(email: str, otp: str):
    print("------------------------------------------------")
    print(f"MOCK SMS: Gửi OTP {otp} đến {email}")
    print("------------------------------------------------")

    await asyncio.sleep(0)

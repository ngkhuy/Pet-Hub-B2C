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
# Schema nội bộ với UMS
internal_bearer = HTTPBearer()

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


def decode_token(token: str, audience: str = None | None):
    """
    Giải mã Token và trả về payload
    """
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, [settings.JWT_ALGORITHM], audience=audience)
        if payload is None:
            return None

        return payload

    except JWTError:
        # Token hết hạn, sai chữ ký, hoặc không hợp lệ
        return None


from fastapi.security import HTTPBearer, OAuth2PasswordBearer
from jose import JWSError, jwt
from core.config import settings
from pwdlib import PasswordHash
from datetime import datetime, timedelta, timezone
import random

pwd_context = PasswordHash.recommended()

# schema đọc request từ client
oauth2_schema = OAuth2PasswordBearer(tokenUrl=f"{settings.AUTH_SERVICE_INTERNAL_BASE_URL}/api/auth/login", scheme_name="Access Token Auth")

# schema đọc token từ AS gửi
internal_bearer = HTTPBearer()

# Hàm dùng để hash OTP

def get_password_hash(password: str):
    """Băm mật khẩu (hoặc OTP)"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    """Kiểm tra mật khẩu (hoặc OTP)"""
    return pwd_context.verify(plain_password, hashed_password)

# Hàm dùng để tạo và giải mã jwt token cho việc xác minh OTP
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

def decode_token(token: str, audience: str | None = None):
    """Giải mã access token từ auth service gửi kèm theo request user"""
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            [settings.JWT_ALGORITHM],
            audience=audience
        )
        
        return payload
    except JWSError:
        return None
    
# Hàm tạo OTP ngẫu nhiên
def generate_otp(len: int = 6):
    """Hàm tạo OTP ngẫu nhiên 6 số"""
    return "".join([str(random.randint(0, 9)) for _ in range(len)])
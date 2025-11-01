from typing import List
from fastapi.security import OAuth2PasswordBearer
from pwdlib import PasswordHash
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from models import TokenData
from core.config import settings

pwd_context = PasswordHash.recommended()

# create password hashing
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str):
    return pwd_context.hash(password)

# define OAuth2 scheme
# tokenUrl point to endpoint /login
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

# JWT creation and decoding
def create_access_token(data: dict, expires_delta: timedelta | None = None):
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
    expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    expire_time = datetime.now(timezone.utc) + expires
    
    to_encode = data.copy()
    to_encode.update({"exp": expire_time,
                      "token_type": "refresh"})
    
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_token(token: str):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, [settings.JWT_ALGORITHM])
        
        if payload.get("token_type") != "access":
            return None
        
        email: str | None = payload.get("sub")
        roles: List[str] = payload.get("roles", [])
        
        if email is None:
            return None
        return TokenData(email=email, roles=roles, token_type="access")
        
    except JWTError:
        return None
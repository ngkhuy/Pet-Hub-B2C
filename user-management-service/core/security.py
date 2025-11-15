from fastapi.security import OAuth2PasswordBearer
from jose import JWSError, jwt
from core.config import settings

oauth2_schema = OAuth2PasswordBearer(tokenUrl="/api/auth/login", scheme_name="Access Token Auth")

def decode_token(token: str):
    """Giải mã access token từ auth service gửi kèm theo request user"""
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            [settings.JWT_ALGORITHM]
        )
        
        return payload
    except JWSError:
        return None
from fastapi.security import OAuth2PasswordBearer, HTTPBearer
from jose import JWTError, jwt

from core.config import settings

oauth2_schema = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login",
    scheme_name="Access Token Auth"
)

oauth2_schema = HTTPBearer(scheme_name="Token Auth")
    
def decode_token(token: str):
    """
    Giải mã Token và trả về payload (nội dung)
    """
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, [settings.JWT_ALGORITHM])
        if payload is None:
            return None
        
        return payload
    
    except JWTError:
        return None
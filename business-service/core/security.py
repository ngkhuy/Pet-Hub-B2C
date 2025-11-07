# D:\HDV\Pet-Hub-B2B-main\Pet-Hub-B2B-main\business-service\core\security.py

from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime, timezone

from core.config import settings

# Config 
# Schema này dùng để FastAPI tự động lấy token từ Header
oauth2_schema = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login", # Đường dẫn này trỏ đến auth-service
    scheme_name="Access Token Auth"
)

# --- CHÚNG TA ĐÃ XÓA TẤT CẢ CODE LIÊN QUAN ĐẾN PWDLIB VÀ OTP ---

    
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
        # Token hết hạn, sai chữ ký, hoặc không hợp lệ
        return None
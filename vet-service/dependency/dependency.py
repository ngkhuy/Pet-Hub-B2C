from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from typing import Annotated
from core import security

# Giữ lại exception này
credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Không thể xác thực thông tin",
    headers={"WWW-Authenticate": "Bearer"},
)
    
def authorization_credentials(
    credentials: HTTPAuthorizationCredentials = Depends(security.oauth2_schema)
):
    token = credentials.credentials
    token_data = security.decode_token(token)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ hoặc đã hết hạn",
        )
    return token_data
    
def require_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security.oauth2_schema)]
):
    """Chỉ cần đăng nhập là được"""
    token_data = authorization_credentials(credentials)
    return token_data

def require_admin(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security.oauth2_schema)]
):
    """Phải là admin"""
    token_data = authorization_credentials(credentials)
    
    if not token_data.get("role") == "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Yêu cầu quyền admin"
        )
    return token_data
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from typing import Annotated
from core import security # Import security của service NÀY

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

# async def get_current_user_payload(
#     token: Annotated[str, Depends(security.oauth2_schema)]
# ) -> dict:
#     """
#     Dependency này chỉ GIẢI MÃ token và trả về payload.
#     Nó KHÔNG truy vấn CSDL. Đây là mấu chốt của microservice.
#     """
#     payload = security.decode_token(token)
#     if payload is None:
#         raise credentials_exception
    
#     # Check xem có phải access token không
#     token_type = payload.get("token_type")
#     if token_type != "access":
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid token type, expected 'access'",
#         )
#     return payload

# async def get_current_admin_payload(
#     payload: Annotated[dict, Depends(get_current_user_payload)]
# ) -> dict:
#     """
#     Dependency này check xem user có phải là ADMIN không,
#     dựa trên payload đã giải mã.
#     (Dựa trên code auth.py của bạn, payload có chứa 'is_admin')
#     """
#     is_admin = payload.get("is_admin", False)
#     if not is_admin:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Operation not permitted: Requires admin role",
#         )
#     return payload
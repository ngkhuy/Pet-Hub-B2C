from fastapi import Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import Annotated
from database import get_session
from crud import user_crud
from core import security
from fastapi.security import HTTPAuthorizationCredentials

# Tạo exception
credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Không thể xác thực thông tin",
    headers={"WWW-Authenticate": "Bearer"},
)


# Dependency methods
async def get_current_active_user(
    token: Annotated[str, Depends(security.oauth2_schema)],
    db: Annotated[AsyncSession, Depends(get_session)],
):
    """
    Decode JWT to get current active user
    Function acts as a dependency for protected endpoints
    """
    token_data = security.decode_token(token)
    if token_data is None:
        raise credentials_exception

    # get username = email
    user_id = token_data.get("sub")
    if user_id is None:
        raise credentials_exception

    user = await user_crud.get_user_by_id(db, user_id=user_id)
    if user is None:
        raise credentials_exception

    if not user.active_status:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Người dùng đã bị vô hiệu hoá",
        )

    return user

def s2s_token_verifier(expected_scope: str):
    """
    Factory: Tạo một dependency để check S2S token
    với scope (mục đích) cụ thể.
    """
    async def verify_s2s_from_ums(
        # Đọc token từ 'internal_bearer'
        creds: Annotated[HTTPAuthorizationCredentials, Depends(security.internal_bearer)]
    ):
        token = creds.credentials
        
        token_data = security.decode_token(token, audience="auth-service")
        
        if token_data is None:
            raise HTTPException(status_code=401, detail="S2S token không hợp lệ hoặc sai audience")
        
        if token_data.get("iss") != "user-service":
            raise HTTPException(status_code=403, detail="S2S token không phải từ User Service")
            
        if token_data.get("scope") != expected_scope:
            raise HTTPException(status_code=403, detail="S2S token có scope không hợp lệ")
            
        return token_data
    
    return verify_s2s_from_ums
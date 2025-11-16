from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import Annotated

from database import get_session
from core import security
from crud import user_crud
from models import User, UserRole 

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Không thể xác thực thông tin",
    headers={"WWW-Authenticate": "Bearer"}
)

admin_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="Không có quyền Admin",
)


async def get_current_user(
    token: Annotated[str, Depends(security.oauth2_schema)],
    db: Annotated[AsyncSession, Depends(get_session)]
):
    """
    Giải mã Access Token, lấy User từ DB và kiểm tra trạng thái active.
    """
    token_data = security.decode_token(token)
    if token_data is None:
        raise credentials_exception
    
    user_id = token_data.get("sub")
    if user_id is None:
        raise credentials_exception
    
    user_role_from_token = token_data.get("role")
    
    # Truy vấn user trong DB của UMS
    user = await user_crud.get_user_by_id(db, user_id=user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile của user không tồn tại (hãy thử lại sau giây lát)"
        )

    if not user.active_status:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản đã bị vô hiệu hoá"
        )
        
    if user.role.value != user_role_from_token:
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Thông tin vai trò không khớp, vui lòng đăng nhập lại"
        )
    
    return user


async def get_current_admin(
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    Đảm bảo user đang đăng nhập là Admin.
    Dùng cho các API trong 'admin_router.py'.
    """
    if current_user.role != UserRole.ADMIN:
        raise admin_exception
    
    return current_user

async def verify_internal_token(creds: Annotated[HTTPAuthorizationCredentials, Depends(security.internal_bearer)]):
    """Dependancy bảo vệy API nội bộ từ AS"""
    token = creds.credentials
    
    token_data = security.decode_token(token)
    
    if token_data is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    # check scope
    if token_data.get("scope") != "user_created":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid scope")
    
    # kiểm tra audience
    if token_data.get("aud") != "user-management":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Audience")
    
    # kiểm tra issuer
    if token_data.get("iss") != "auth-service":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Issuer")
    
    return token_data
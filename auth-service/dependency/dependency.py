from fastapi import Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import Annotated
from database import get_session
from crud import user_crud
from core import security
from models import User

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
    email = token_data.get("sub")
    if email is None:
        raise credentials_exception

    user = await user_crud.get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Người dùng đã bị vô hiệu hoá",
        )

    return user


async def get_current_admin_user(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    """Dependency để lấy user và kiểm tra quyền admin"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Quyền truy cập bị từ chối"
        )

    return current_user

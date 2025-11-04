from fastapi import Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import Annotated
from database import get_session
from models import User, TokenData
from crud import user_crud
from core import security

# Tạo exception chung
credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Không thể xác thực thông tin",
    headers={"WWW-Authenticate": "Bearer"},
)

# Dependency methods
async def get_current_active_user(token: Annotated[str, Depends(security.oauth2_schema)], db: Annotated[AsyncSession, Depends(get_session)]):
    """
    Decode JWT to get current active user
    Function acts as a dependency for protected endpoints
    """
    token_data = security.decode_token(token, expected_type="access")
    if token_data is None:
        raise credentials_exception
    
    # get phone_number
    user = await user_crud.get_user_by_phone(db, phone_number=token_data.phone_number)
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Không tìm thấy người dùng")
    
    return user

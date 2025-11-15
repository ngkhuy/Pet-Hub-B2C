from fastapi import Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import Annotated

from database import get_session
from core import security
from crud import user_crud

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Không thể xác thực thông tin",
    headers={"WWW-Authenticate": "Bearer"}
)

async def get_current_user(token: Annotated[str, Depends(security.oauth2_schema)],
                            db: Annotated[AsyncSession, Depends(get_session)]):
    """Decode Access Token"""
    token_data = security.decode_token(token)
    if token_data is None:
        raise credentials_exception
    
    user_id = token_data.get("sub")
    if user_id is None:
        raise credentials_exception
    
    
    
    user = await user_crud.get_user_by_id(db, user_id)
    if user is None:
        raise credentials_exception
    
    return user
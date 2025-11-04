from fastapi.concurrency import run_in_threadpool
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select, delete
from datetime import datetime, timezone
from uuid import UUID
from sqlalchemy.dialects.postgresql import insert

from models import User, RefreshToken
from core.security import get_password_hash, verify_password

async def get_user_by_phone(db: AsyncSession, phone_number: str):
    """
    Tìm kiếm user bằng số điện thoại
    """
    statement = select(User).where(User.phone_number == phone_number)
    result = await db.exec(statement)
    return result.first()


async def create_user(db: AsyncSession, user: User):
    """
    Tạo user mới trong CSDL.
    Mặc định is_admin=False.
    """
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    return user

async def create_refresh_token(db: AsyncSession, user_id: UUID, token: str, expired_at: datetime):
    """
    Tạo refresh token mới, và xoá TẤT CẢ các token cũ
    của user này.
    """
    
    delete_statement = delete(RefreshToken).where(
        (RefreshToken.user_id == user_id)
    )
    await db.exec(delete_statement)
    
    db_refresh_token = RefreshToken(
        user_id=user_id,
        token=token,
        expired_at=expired_at
    )
    db.add(db_refresh_token)
    await db.commit()
    await db.refresh(db_refresh_token)
    
    return db_refresh_token

async def get_valid_refresh_token(db: AsyncSession, token: str):
    """
    Kiểm tra xem refresh token có tồn tại trong CSDL và
    còn hợp lệ (chưa hết hạn) hay không.
    """
    statement = select(RefreshToken).where(
        RefreshToken.token == token,
        RefreshToken.expired_at > datetime.now(timezone.utc)
    )
    result = await db.exec(statement)
    return result.first()

async def revoke_refresh_token(db: AsyncSession, user_id: UUID):
    """
    Tìm và toàn bộ refresh token khỏi CSDL để vô hiệu hoá nó.
    """
    statement = delete(RefreshToken).where(RefreshToken.user_id == user_id)
    
    await db.exec(statement=statement)
    await db.commit()
    return True

async def update_user_password(db: AsyncSession, user: User, new_password: str):
    """Cập nhật mật khẩu của user vào db"""
    user.hashed_password = new_password
    user.updated_at = datetime.now(timezone.utc)
    
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    return user

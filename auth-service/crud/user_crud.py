from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select, delete
from datetime import datetime, timezone
from uuid import UUID
from models import User, RefreshToken


async def get_user_by_email(db: AsyncSession, email: str):
    """
    Tìm kiếm user bằng số điện thoại
    """
    statement = select(User).where(User.email == email)
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


async def refresh_token_to_db(db: AsyncSession, user_id: UUID, token: str):
    """
    Tạo refresh token mới, và xoá TẤT CẢ các token cũ
    của user này.
    """
    db_refresh_token = RefreshToken(user_id=user_id, token=token)
    db.add(db_refresh_token)
    await db.commit()
    await db.refresh(db_refresh_token)

    return db_refresh_token


async def get_refresh_token(db: AsyncSession, user_id: UUID):
    """
    Kiểm tra xem refresh token có tồn tại trong CSDL và
    còn hợp lệ (chưa hết hạn) hay không.
    """
    statement = select(RefreshToken).where(RefreshToken.user_id == user_id)
    result = await db.exec(statement)
    return result.first()


async def revoke_refresh_token(db: AsyncSession, user_id: UUID):
    """
    Tìm và xoá toàn bộ refresh token khỏi CSDL để vô hiệu hoá nó.
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
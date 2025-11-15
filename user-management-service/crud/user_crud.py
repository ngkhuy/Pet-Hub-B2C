from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from datetime import datetime, timezone
from uuid import UUID
from models import User

async def get_user_by_id(db: AsyncSession, user_id: str):
    """Tim user bằng id"""
    user_id = UUID(user_id)
    statement = select(User).where(User.id == user_id)
    result = await db.exec(statement=statement)
    return result.first()

async def get_user_by_email(db: AsyncSession, email:
    str):
    """Tìm user bằng email, cho API filter"""
    statement = select(User).where(User.email == email)
    result = await db.exec(statement=statement)
    return result.first()
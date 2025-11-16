from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select, delete
from uuid import UUID
from datetime import datetime, timedelta, timezone

from models import OTP, OTPType

async def get_active_otp(db: AsyncSession, user_id: UUID, purpose: OTPType):
    """Hàm lấy otp còn hạn và đúng mục đích"""
    statement = (
        select(OTP).where(
            OTP.user_id == user_id,
            OTP.purpose == purpose,
            OTP.expires_at > datetime.now(timezone.utc)
        )
    )
    
    result = await db.exec(statement=statement)
    return result.select_one_or_none()

async def delete_otp(db: AsyncSession, db_otp: OTP):
    """Hàm xoá otp sau khi dùng"""
    await db.delete(db_otp)
    await db.commit()
    
    return

async def delete_otp_by_purpose(db: AsyncSession, user_id: UUID, purpose: OTPType):
    """Hàm xoá OTP theo mục đích"""
    statement = (
        delete(OTP)
        .where(OTP.user_id == user_id,
               OTP.purpose == purpose)
    )
    await db.exec(statement)
    await db.commit()
    return

async def create_otp(db: AsyncSession, user_id: UUID, purpose: OTPType, otp_hash: str):
    """Hàm tạo otp"""
    
    # xoá OTP cũ có cùng purpose
    await delete_otp_by_purpose(db, user_id, purpose)
    
    # tạo expires time
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)
    
    # tạo otp
    db_otp = OTP(user_id=user_id, purpose=purpose, otp_hash=otp_hash, expires_at=expires_at)
    
    db.add(db_otp)
    await db.commit()
    await db.refresh(db_otp)
    
    return db_otp
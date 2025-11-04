from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import Enum, select, delete
from datetime import datetime, timezone
from uuid import UUID
from models import OTP, OTPPurpose, User, RefreshToken
from sqlalchemy.dialects.postgresql import insert
from fastapi.concurrency import run_in_threadpool
from core.security import verify_password

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

# OTP methods
async def create_or_update_otp(db: AsyncSession, user_id: UUID, purpose: OTPPurpose, otp_hash: str, expired_at: datetime):
    """Hàm tạo hoặc cập nhật OTP vào DB"""
    statement = (insert(OTP).values(
        user_id = user_id,
        otp_hash = otp_hash,
        purpose = purpose, 
        expired_at = expired_at
        ).on_conflict_do_update(
            index_elements=[OTP.user_id, OTP.purpose],
            set_={
                "otp_hash": otp_hash,
                "expired_at": expired_at
            }
        ).returning(OTP)
    )
    
    result = await db.exec(statement)
    await db.commit()
    return result.one()

async def get_valid_otp(db: AsyncSession, phone_number: str, purpose: OTPPurpose, otp: str):
    """Hàm lấy OTP từ DB và kiểm tra, xoá OTP nếu thành công"""
    # tìm user
    user = await get_user_by_phone(db, phone_number)
    if not user:
        return None
    
    # tìm otp khớp với user và purpose để có thể mở rộng ra verify phone number
    statement = select(OTP).where(
        OTP.user_id == user.id,
        OTP.purpose == purpose,
        OTP.expired_at > datetime.now(timezone.utc)
    )
    
    result = await db.exec(statement=statement)
    db_otp = result.first()
    
    if not db_otp:
        return None
    
    # xác minh OTP
    is_valid_otp = await run_in_threadpool(verify_password, otp, db_otp.otp_hash)
    if not is_valid_otp:
        return None
    
    # xác minh thành công xoá otp đó
    await db.delete(db_otp)
    await db.commit()
    
    return user
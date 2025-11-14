from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select, delete
from datetime import datetime, timedelta, timezone
from uuid import UUID
from models import OTP, OTPPurpose, User, RefreshToken


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
    statement = select(RefreshToken).where(
        RefreshToken.user_id == user_id
    )
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


# OTP methods
async def create_or_update_otp(
    db: AsyncSession,
    user_id: UUID,
    purpose: OTPPurpose,
    otp_hash: str,
    expired_at: datetime,
):
    """Hàm tạo hoặc cập nhật OTP vào DB"""
    existing_otp = await db.scalar(
        select(OTP)
        .where(
            OTP.user_id == user_id,
            OTP.purpose == purpose,
        )
        .order_by(OTP.expired_at.desc())
    )

    if existing_otp:
        now = datetime.now(timezone.utc)
        # otp còn hiệu lực và gửi chưa được 60s
        elapsed = (
            now - (existing_otp.expired_at - timedelta(minutes=5))
        ).total_seconds()
        if elapsed < 60:
            return False

        # qua thời gian cooldown, cho phép cập nhật mới
        existing_otp.otp_hash = otp_hash
        existing_otp.expired_at = expired_at
    else:
        # chưa có otp -> tạo mới
        db.add(
            OTP(
                user_id=user_id,
                purpose=purpose,
                otp_hash=otp_hash,
                expired_at=expired_at,
            )
        )
    await db.commit()
    return True


async def get_active_otp(db: AsyncSession, user_id: UUID, purpose: OTPPurpose):
    """Lấy OTP còn hạn cho user theo purpose"""
    statement = (
        select(OTP)
        .where(
            OTP.user_id == user_id,
            OTP.purpose == purpose,
            OTP.expired_at > datetime.now(timezone.utc),
        )
        .order_by(OTP.expired_at.desc())
    )

    result = await db.exec(statement)
    return result.first()

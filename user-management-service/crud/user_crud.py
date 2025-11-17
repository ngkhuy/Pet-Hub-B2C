from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from datetime import datetime, timezone
from uuid import UUID
from models import User, UserRole, UserUpdate

# Hàm cho s2s
async def create_user_profile(db: AsyncSession, user: User):
    """tạo user profile bằng thông tin từ AS"""
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
    
# Hàm lấy user từ API internal của AS
async def get_user_by_id(db: AsyncSession, user_id: UUID):
    """Tim user bằng id"""
    statement = select(User).where(User.id == user_id)
    result = await db.exec(statement=statement)
    return result.first()

# Hàm cho API từ client

async def get_user_by_email(db: AsyncSession, email:
    str):
    """Tìm user bằng email, cho API filter"""
    statement = select(User).where(User.email == email)
    result = await db.exec(statement=statement)
    return result.first()


async def update_user_profile(db: AsyncSession, db_user: User, update_data: UserUpdate):
    """Cập nhật thông tin cho user và lưu vào DB"""
    update_dict = update_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(db_user, key, value)
        
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    
    return db_user


# Hàm cho admin api
async def get_user_list(db: AsyncSession, offset: int = 0, limit: int = 100):
    """Lấy danh sách user"""
    statement = select(User).offset(offset=offset).limit(limit=limit)
    result = await db.exec(statement=statement)
    return result.all()


async def update_user_active_status(db: AsyncSession, db_user: User, new_active_status: bool):
    """Hàm cập nhật trạng thái tài khoản của user (BAN FUNCTION)"""
    db_user.active_status = new_active_status
    db.add(db_user)
    
    await db.commit()
    await db.refresh(db_user) 
    
    return db_user


async def update_user_role(db: AsyncSession, db_user: User, new_role: UserRole):
    """Hàm cập nhật role admin hay thu hồi admin"""
    db_user.role = new_role
    db.add(db_user)
    
    await db.commit()
    await db.refresh(db_user)
    
    return db_user
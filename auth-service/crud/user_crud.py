from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select, delete
from models import User, UserCreate, RefreshToken, Role, UserRole
from core.security import get_password_hash
from datetime import datetime, timezone

async def get_user_by_email(db: AsyncSession, email: str):
    """Get user by email"""
    statement = select(User).where(User.email == email)
    result = await db.exec(statement)
    return result.first()

async def create_user(db: AsyncSession, user: UserCreate):
    """Create a new user in database"""
    hashed_password = get_password_hash(user.password)
    user_data = user.model_dump(exclude={"password"})
    db_user = User(**user_data, hashed_password=hashed_password)
    
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    
    return db_user

async def create_refresh_token(db: AsyncSession, user_id: int, token: str, expires_at: datetime):
    """Create a new refresh token"""
    delete_statement = delete(RefreshToken).where(
        (RefreshToken.user_id == user_id) | 
        (RefreshToken.expires_at < datetime.now(timezone.utc))
    )
    await db.exec(delete_statement)
    
    db_refresh_token = RefreshToken(user_id=user_id, token=token, expires_at=expires_at)
    db.add(db_refresh_token)
    await db.commit()
    await db.refresh(db_refresh_token)
    
    return db_refresh_token


async def get_role_by_name(db: AsyncSession, role_name: str):
    statement = select(Role).where(Role.name == role_name)
    result = await db.exec(statement)
    return result.first()  

async def revoke_refresh_token(db: AsyncSession, token: str):
    """Find and remove refresh token from db""" 
    statement = select(RefreshToken).where(RefreshToken.token == token)
    result = await db.exec(statement=statement)
    db_token = result.first()
    
    if db_token:
        await db.delete(db_token)
        await db.commit()
        return True
    return False

async def get_valid_refresh_token(db: AsyncSession, token: str):
    """Select refresh token in database which is valid"""
    
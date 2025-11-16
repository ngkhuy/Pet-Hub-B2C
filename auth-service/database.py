from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession
from core.config import settings

# get database url 
SUPABASE_URL = settings.DATABASE_URL

# create async engine
async_engine = create_async_engine(url=SUPABASE_URL, echo=True, pool_recycle=300,
    pool_pre_ping=True)
        
# get session 
async def get_session():
    """Dependency của FastAPI, lấy session cho mỗi request"""
    async_session = sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        yield session
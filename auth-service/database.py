from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import SQLModel
from core.config import settings

# get database url 
SUPABASE_URL = settings.DATABASE_URL

async_engine = create_async_engine(url=SUPABASE_URL, echo=True)

# create table
async def create_db_and_tables():
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
        
# get session 
async def get_session() -> AsyncSession:
    """Dependency for getting session of each request"""
    async_session = sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        yield session
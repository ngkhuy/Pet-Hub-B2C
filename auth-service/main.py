from fastapi import FastAPI
from contextlib import asynccontextmanager

from routers import auth as auth_router
from database import create_db_and_tables, async_engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Khởi động server")
    yield
    print("Đóng server")
    await async_engine.dispose() # disconnect CSDL
    
app = FastAPI(title="Auth service APi", 
              description="API cho dịch vụ xác thực người dùng",
              version="0.1.0",
              lifespan=lifespan)

app.include_router(auth_router.router, prefix="/api/v1/auth", tags=["auth"])

@app.get("/")
async def root():
    return {"Message": "Welcome to auth service"}
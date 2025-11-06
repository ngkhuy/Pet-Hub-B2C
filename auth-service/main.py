from fastapi import FastAPI

from routers import auth as auth_router
    
app = FastAPI(title="Auth service API", 
              description="API cho dịch vụ xác thực người dùng",
              version="0.1.0")

app.include_router(auth_router.router, prefix="/api/auth", tags=["auth"])

@app.get("/")
async def root():
    return {"Message": "Welcome to auth service"}
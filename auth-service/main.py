from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth as auth_router, internal
    
app = FastAPI(title="Auth service API", 
              description="API cho dịch vụ xác thực người dùng",
              version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    
    allow_credentials=True, 
    
    allow_methods=["*"], 
    allow_headers=["*"],
)
# -----------------------------------

app.include_router(
    auth_router.router, 
    prefix="/api/auth",
    tags=["Auth endpoints"]
)

app.include_router(
    internal.router, 
    prefix="/api/internal", 
    tags=["Internal S2S"]
)

@app.get("/")
async def root():
    return {"Message": "Welcome to auth service"}
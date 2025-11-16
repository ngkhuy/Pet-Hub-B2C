from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import các router
from route import user
from core.config import settings


app = FastAPI(
    title="User Management Service (UMS)",
    description="API quản lý profile người dùng và thú cưng",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    
    allow_credentials=True, 
    
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GẮN CÁC ROUTER VỚI PREFIX ---

app.include_router(
    user.router,
    prefix="/api/ums/users",
    tags=["User Endpoints"] # Nhóm các API này lại
)

# 2. Router cho Admin (Tạm thời comment lại)
# app.include_router(
#     admin_router.router,
#     prefix="/api/ums/admin",
#     tags=["Admin Endpoints"]
# )

# 3. Router Nội bộ (Tạm thời comment lại)
# app.include_router(
#     internal_router.router,
#     prefix="/api/internal",
#     tags=["Internal S2S"]
# )


@app.get("/health", tags=["Health"])
async def health_check():
    """Kiểm tra xem service có đang chạy không"""
    return {"status": "ok", "service": "User Management Service"}
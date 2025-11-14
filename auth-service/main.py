from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # <-- 1. Import
from routers import auth as auth_router
    
app = FastAPI(title="Auth service API", 
              description="API cho dịch vụ xác thực người dùng",
              version="0.1.0")

# --- 2. THÊM CẤU HÌNH CORS (BẮT BUỘC) ---
app.add_middleware(
    CORSMiddleware,
    # Thay đổi "http://localhost:3000" bằng địa chỉ FE của bạn
    allow_origins=["http://localhost:3000"], 
    
    # BẮT BUỘC BẰNG TRUE ĐỂ CHO PHÉP GỬI COOKIE
    allow_credentials=True, 
    
    allow_methods=["*"], 
    allow_headers=["*"],
)
# -----------------------------------

app.include_router(
    auth_router.router, 
    prefix="/api/auth", # <-- Prefix này RẤT ĐÚNG
    tags=["Auth endpoints"]
)

@app.get("/")
async def root():
    return {"Message": "Welcome to auth service"}
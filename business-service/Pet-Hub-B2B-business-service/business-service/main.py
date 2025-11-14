# business-service/main.py
from fastapi import FastAPI
from routers import shop_router # Import router mới

app = FastAPI(title="Business Service API", 
              description="API cho quản lý Shop, Spa, Hotel thú cưng",
              version="0.1.0")

# Sửa prefix và tags
app.include_router(shop_router.router, prefix="/api/shops", tags=["Shops"])

@app.get("/")
async def root():
    return {"Message": "Welcome to Business (Shop) service"}
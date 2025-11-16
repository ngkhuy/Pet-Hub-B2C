from fastapi import FastAPI
from routers import vet_router

app = FastAPI(title="Booking Service API", 
              description="API cho đặt hẹn dịch vụ VET cho thú cưng",
              version="0.1.0")

app.include_router(vet_router.router, prefix="/api/vet", tags=["VET Booking"])

@app.get("/")
async def root():
    return {"Message": "Welcome to PetHub's VET appointment service"}
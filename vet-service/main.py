from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import vet_router

app = FastAPI(title="VET Booking Service API", 
              description="API cho đặt hẹn dịch vụ VET cho thú cưng",
              version="0.1.0")

app.include_router(vet_router.router, prefix="/api/vet", tags=["VET Booking"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000"], 
    
    allow_credentials=True, 
    
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"Message": "Welcome to PetHub's VET appointment service"}
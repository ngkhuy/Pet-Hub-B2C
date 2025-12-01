from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import common_router, care_router, hotel_router

app = FastAPI(title="Booking Service API", 
              description="API cho đặt lịch Spa, Hotel thú cưng",
              version="0.1.0")

app.include_router(common_router.router, prefix="/api/booking")
app.include_router(care_router.router, prefix="/api/booking")
app.include_router(hotel_router.router, prefix="/api/booking")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    
    allow_credentials=True, 
    
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"Message": "Welcome to PetHub Booking service"}
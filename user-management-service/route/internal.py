from fastapi import APIRouter, Depends
from typing import Annotated

router = APIRouter(prefix="/api/internal", tags=["internal"])

@router.post("/user-created")
async def internal_user_created(data: dict):
    """"""
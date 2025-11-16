import httpx
from datetime import timedelta
from core import security
from core.config import settings

async def notify_user_created(user_id: str, email: str):
    """Hàm tạo thông báo user đã được tạo"""
    token_payload = {
        "sub": user_id,
        "email": email,
        "scope": "user_created",
        "iss": "auth-service",
        "aud": "user-service"
    }
    
    internal_token = security.create_jwt_token(data=token_payload, expires_delta=timedelta(minutes=5))
    
    url = f"{settings.USER_SERVICE_INTERNAL_BASE_URL}/api/internal/user-created"
    
    async with httpx.AsyncClient(timeout=5) as client:
        response = await client.post(url, json={"user_id": user_id, "email": email}, headers={"Authorization": f"Bearer {internal_token}"})
        
        response.raise_for_status()
        
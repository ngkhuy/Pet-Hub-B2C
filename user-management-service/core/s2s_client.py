import httpx
from uuid import UUID
from datetime import timedelta

from . import security, config
from models import UserRole

s2s_client = httpx.AsyncClient(base_url=config.settings.AUTH_SERVICE_INTERNAL_BASE_URL, timeout=5.0)

def create_s2s_token(scope: str):
    """
    Tạo JWT nội bộ để UMS (chúng ta) xác thực với AS.
    """
    payload = {
        "scope": scope,
        "iss": "user-service",
        "aud": "auth-service"
    }
    return security.create_jwt_token(payload, expires_delta=timedelta(minutes=5))

async def notify_status_update(user_id: UUID, is_active: bool):
    """
    (UMS -> AS) Thông báo user đã bị ban/unban.
    """
    
    # 1. Tạo Token S2S với mục đích (scope) cụ thể
    token = create_s2s_token(scope="user_status_update")
    
    url = f"/api/internal/users/{user_id}/status" 
    
    try:
        response = await s2s_client.patch(
            url,
            json={"active_status": is_active}, 
            headers={"Authorization": f"Bearer {token}"}
        )
        response.raise_for_status()
        print(f"S2S: Đã thông báo (status update) cho AS thành công (User: {user_id})")
    
    except httpx.RequestError as e:
        print(f"S2S CRITICAL: Lỗi khi gọi AS (status update): {e}")

async def notify_role_update(user_id: UUID, role: UserRole):
    """
    (UMS -> AS) Thông báo user đã được đổi role.
    """
    
    token = create_s2s_token(scope="user_role_update")
    url = f"/api/internal/users/{user_id}/role" 
    
    try:
        response = await s2s_client.patch(
            url,
            json={"role": role.value},
            headers={"Authorization": f"Bearer {token}"}
        )
        response.raise_for_status()
        print(f"S2S: Đã thông báo (role update) cho AS thành công (User: {user_id})")
    except httpx.RequestError as e:
        print(f"S2S CRITICAL: Lỗi khi gọi AS (role update): {e}")

async def close_s2s_client():
    """Đóng client (dùng trong main.py lifespan)."""
    await s2s_client.aclose()

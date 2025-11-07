# business-service/routers/shop_router.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import Annotated, List
from uuid import UUID

from database import get_session
from models import ShopRead, ShopCreate, ShopUpdate # Import model mới
from crud import shop_crud            # Import crud mới
from dependency import dependency      # Import dependency mới

# Config
router = APIRouter()

# ======================================================
# === LUỒNG CUSTOMER (Public - Không cần đăng nhập) ===
# ======================================================

@router.get("/", response_model=List[ShopRead], tags=["Customer"])
async def get_all_shops_for_customer(
    db: Annotated[AsyncSession, Depends(get_session)]
):
    """
    (Customer) Lấy tất cả các shop ĐÃ ĐƯỢC DUYỆT.
    """
    return await shop_crud.get_all_approved_shops(db)

@router.get("/{shop_id}", response_model=ShopRead, tags=["Customer"])
async def get_shop_details_for_customer(
    shop_id: UUID, db: Annotated[AsyncSession, Depends(get_session)]
):
    """
    (Customer) Lấy chi tiết 1 shop (nếu đã được duyệt).
    """
    shop = await shop_crud.get_shop_by_id_for_customer(db, shop_id)
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found or not approved")
    return shop

# ======================================================
# === LUỒNG ADMIN (Yêu cầu quyền Admin) ===
# ======================================================

@router.post("/admin/create", response_model=ShopRead, tags=["Admin"])
async def create_shop(
    shop_data: ShopCreate,
    db: Annotated[AsyncSession, Depends(get_session)],
    admin_payload: Annotated[dict, Depends(dependency.get_current_admin_payload)]
):
    """
    (Admin) Tạo một shop mới (admin tạo thì duyệt luôn).
    """
    return await shop_crud.create_shop_by_admin(db, shop_data)

@router.get("/admin/all", response_model=List[ShopRead], tags=["Admin"])
async def get_all_shops_for_admin(
    db: Annotated[AsyncSession, Depends(get_session)],
    admin_payload: Annotated[dict, Depends(dependency.get_current_admin_payload)]
):
    """
    (Admin) Lấy TẤT CẢ shop (kể cả chưa duyệt).
    """
    return await shop_crud.get_all_shops_for_admin(db)

@router.get("/admin/{shop_id}", response_model=ShopRead, tags=["Admin"])
async def get_shop_details_for_admin(
    shop_id: UUID,
    db: Annotated[AsyncSession, Depends(get_session)],
    admin_payload: Annotated[dict, Depends(dependency.get_current_admin_payload)]
):
    """
    (Admin) Lấy chi tiết BẤT KỲ shop nào.
    """
    shop = await shop_crud.get_shop_by_id_for_admin(db, shop_id)
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    return shop

@router.put("/admin/{shop_id}", response_model=ShopRead, tags=["Admin"])
async def update_shop(
    shop_id: UUID,
    shop_data: ShopUpdate,
    db: Annotated[AsyncSession, Depends(get_session)],
    admin_payload: Annotated[dict, Depends(dependency.get_current_admin_payload)]
):
    """
    (Admin) Sửa thông tin bất kỳ shop nào.
    """
    shop = await shop_crud.admin_update_shop(db, shop_id, shop_data)
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    return shop

@router.delete("/admin/{shop_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Admin"])
async def delete_shop(
    shop_id: UUID,
    db: Annotated[AsyncSession, Depends(get_session)],
    admin_payload: Annotated[dict, Depends(dependency.get_current_admin_payload)]
):
    """
    (Admin) Xóa bất kỳ shop nào.
    """
    result = await shop_crud.delete_shop_by_admin(db, shop_id)
    if not result:
        raise HTTPException(status_code=404, detail="Shop not found")
    return
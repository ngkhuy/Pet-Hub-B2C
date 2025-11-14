# business-service/crud/shop_crud.py
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from uuid import UUID
from models import Shop, ShopCreate, ShopUpdate # Import model mới

# --- LUỒNG CUSTOMER (CHỈ ĐỌC) ---

async def get_shop_by_id_for_customer(db: AsyncSession, shop_id: UUID):
    """(Customer) Lấy 1 shop (PHẢI ĐƯỢC DUYỆT) theo ID"""
    statement = select(Shop).where(
        Shop.id == shop_id,
        Shop.is_approved == True # Chỉ trả về shop đã được duyệt
    )
    result = await db.exec(statement)
    return result.first()

async def get_all_approved_shops(db: AsyncSession, skip: int = 0, limit: int = 100):
    """(Customer) Lấy tất cả các shop (PHẢI ĐƯỢC DUYỆT)"""
    statement = (
        select(Shop)
        .where(Shop.is_approved == True) # Chỉ trả về shop đã được duyệt
        .offset(skip)
        .limit(limit)
    )
    result = await db.exec(statement)
    return result.all()

# --- LUỒNG ADMIN (TOÀN QUYỀN) ---

async def get_all_shops_for_admin(db: AsyncSession, skip: int = 0, limit: int = 100):
    """(Admin) Lấy TẤT CẢ shop, bao gồm shop CHƯA DUYỆT"""
    statement = select(Shop).offset(skip).limit(limit)
    result = await db.exec(statement)
    return result.all()

async def get_shop_by_id_for_admin(db: AsyncSession, shop_id: UUID):
    """(Admin) Lấy BẤT KỲ shop nào (kể cả chưa duyệt)"""
    # db.get là cách nhanh nhất để lấy bằng Primary Key
    db_shop = await db.get(Shop, shop_id)
    return db_shop

async def create_shop_by_admin(db: AsyncSession, shop_data: ShopCreate):
    """(Admin) Tạo shop mới, admin tạo thì duyệt luôn"""
    # Admin tạo shop thì 'is_approved' = True luôn
    new_shop = Shop(**shop_data.model_dump(), is_approved=True)
    db.add(new_shop)
    await db.commit()
    await db.refresh(new_shop)
    return new_shop

async def update_shop_by_admin(db: AsyncSession, shop_id: UUID, shop_update: ShopUpdate):
    """(Admin) Cập nhật BẤT KỲ shop nào"""
    db_shop = await db.get(Shop, shop_id)
    if not db_shop:
        return None
    
    # Lấy data từ Pydantic model, chỉ update các trường được gửi
    update_data = shop_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_shop, key, value)
        
    db.add(db_shop)
    await db.commit()
    await db.refresh(db_shop)
    return db_shop

async def delete_shop_by_admin(db: AsyncSession, shop_id: UUID):
    """(Admin) Xóa BẤT KỲ shop nào"""
    db_shop = await db.get(Shop, shop_id)
    if not db_shop:
        return None # Shop không tồn tại
    await db.delete(db_shop)
    await db.commit()
    return True # Xóa thành công
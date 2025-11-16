from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from uuid import UUID

from models import Pet, PetCreate, PetUpdate

async def create_pet(
    db: AsyncSession, pet_data: PetCreate, owner_id: UUID
):
    """Tạo thú cưng mới và gán chủ sở hữu."""
    
    pet = Pet.model_validate(pet_data)
    
    pet.owner_id = owner_id
    
    db.add(pet)
    await db.commit()
    await db.refresh(pet)
    return pet

async def get_pet_by_id(db: AsyncSession, pet_id: UUID):
    """Lấy thú cưng bằng ID."""
    pet = await db.get(Pet, pet_id)
    return pet

async def get_pets_by_owner_id(
    db: AsyncSession, owner_id: UUID, offset: int = 0, limit: int = 50
):
    """Lấy danh sách thú cưng của một chủ sở hữu."""
    statement = (
        select(Pet)
        .where(Pet.owner_id == owner_id)
        .offset(offset)
        .limit(limit)
    )
    result = await db.exec(statement)
    return result.all()

async def update_pet_profile(
    db: AsyncSession, db_pet: Pet, update_data: PetUpdate
):
    """Cập nhật thông tin của một thú cưng."""
    
    update_dict = update_data.model_dump(exclude_unset=True)
    
    for key, value in update_dict.items():
        setattr(db_pet, key, value)
        
    db.add(db_pet)
    await db.commit()
    await db.refresh(db_pet)
    return db_pet

async def delete_pet_by_id(db: AsyncSession, db_pet: Pet):
    """Xóa một thú cưng khỏi DB."""
    await db.delete(db_pet)
    await db.commit()
    return
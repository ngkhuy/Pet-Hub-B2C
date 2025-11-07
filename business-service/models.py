# business-service/models.py
from typing import Optional
from uuid import UUID
from sqlmodel import Field, SQLModel, Relationship, Column, VARCHAR
from datetime import datetime, timezone
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql.expression import text
from sqlalchemy import Boolean

# Dùng chung:
class ShopBase(SQLModel):
    name: str = Field(index=True)
    address: str
    logo_url: Optional[str] = None
    
# Model cho CSDL (Database)
class Shop(ShopBase, table=True):
    __tablename__ = "shop"
    
    id: Optional[UUID] = Field(
        default=None, primary_key=True, sa_column_kwargs=({"default": text("gen_random_uuid()")})
    )
    
    # Cột QUAN TRỌNG: Admin dùng để duyệt shop
    # Mặc định là False khi 'business' tự tạo
    is_approved: bool = Field(default=False, sa_column=Column(Boolean, default=False))
    
    # (Optional) Liên kết với chủ shop
    # owner_id: UUID = Field(foreign_key="user.id") # Tạm thời chưa cần cho admin/customer
    
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(TIMESTAMP(timezone=True), nullable=False)
    )

# --- Các model Pydantic cho Input/Output ---

# Model để trả về (output) cho client
class ShopRead(ShopBase):
    id: UUID
    is_approved: bool
    created_at: datetime

# Model để Admin tạo (input)
class ShopCreate(ShopBase):
    pass # Lấy y hệt từ ShopBase

# Model để Admin sửa (input)
class ShopUpdate(SQLModel):
    name: Optional[str] = None
    address: Optional[str] = None
    logo_url: Optional[str] = None
    is_approved: Optional[bool] = None # Admin có thể sửa cả trạng thái duyệt
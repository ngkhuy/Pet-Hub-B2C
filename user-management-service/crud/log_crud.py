from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from uuid import UUID
from typing import Optional

from models import AuditLog

async def create_audit_log(
    db: AsyncSession,
    actor_id: UUID,
    action: str,
    target_type: str,
    target_id: Optional[UUID] = None,
    details: Optional[dict] = None):
    """Ghi lại một hành động vào bảng AuditLog"""
    
    log_entry = AuditLog(
        actor_id=actor_id,
        action=action,
        target_type=target_type,
        target_id=target_id,
        detail=details
    )
    
    db.add(log_entry)
    await db.commit()
    return log_entry

async def get_audit_logs(
    db: AsyncSession, offset: int = 0, limit: int = 100
):
    """Lấy danh sách log (cho Admin)"""
    statement = (
        select(AuditLog)
        .order_by(AuditLog.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    result = await db.exec(statement)
    return result.all()
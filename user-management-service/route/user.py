from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import Annotated, List
from uuid import UUID

from database import get_session
from dependency import dependency
from models import (
    User, UserRead, UserUpdate, 
    Pet, PetRead, PetCreate, PetUpdate,
    OTPType, 
    S2SUserCreate,
    UserRole,
    OTP,
    AuditLog,
    PetType,
    # Thêm 2 schema cho OTP
    RequestOTP,
    VerifyOTP
)
# Import tất cả các file crud
from crud import user_crud, pet_crud, otp_crud, log_crud
from core import security 

# Khởi tạo router
router = APIRouter()

# =======================================================
# 1. API Profile (Bản thân User)
# =======================================================

@router.get("/me", response_model=UserRead)
async def read_me(
    current_user: Annotated[User, Depends(dependency.get_current_user)]
):
    """
    Lấy thông tin profile của user đang đăng nhập.
    """
    return current_user

@router.patch("/me", response_model=UserRead)
async def update_me(
    update_data: UserUpdate,
    current_user: Annotated[User, Depends(dependency.get_current_user)],
    db: Annotated[AsyncSession, Depends(get_session)]
):
    """
    User tự cập nhật thông tin profile của mình.
    """
    # (Tạm thời bỏ qua log)
    
    updated_user = await user_crud.update_user_profile(
        db=db, db_user=current_user, update_data=update_data
    )
    return updated_user

# =======================================================
# 2. API Quản lý Thú cưng (Pets)
# =======================================================

@router.post("/pets", response_model=PetRead, status_code=status.HTTP_201_CREATED)
async def create_new_pet(
    pet_data: PetCreate,
    current_user: Annotated[User, Depends(dependency.get_current_user)],
    db: Annotated[AsyncSession, Depends(get_session)]
):
    """
    User thêm một thú cưng mới cho chính mình.
    """
    pet = await pet_crud.create_pet(
        db=db, pet_data=pet_data, owner_id=current_user.id
    )
    
    # Ghi log
    await log_crud.create_audit_log(
        db=db,
        actor_id=current_user.id,
        action="USER_CREATE_PET",
        target_type="PET",
        target_id=pet.id
    )
    return pet

@router.get("/pets", response_model=List[PetRead])
async def get_my_pets(
    current_user: Annotated[User, Depends(dependency.get_current_user)],
    db: Annotated[AsyncSession, Depends(get_session)],
    skip: int = 0,
    limit: int = 50
):
    """
    Lấy danh sách thú cưng của user đang đăng nhập.
    """
    pets = await pet_crud.get_pets_by_owner_id(
        db=db, owner_id=current_user.id, skip=skip, limit=limit
    )
    return pets

@router.get("/pets/{pet_id}", response_model=PetRead)
async def get_pet_by_id(
    pet_id: UUID,
    current_user: Annotated[User, Depends(dependency.get_current_user)],
    db: Annotated[AsyncSession, Depends(get_session)]
):
    """
    Lấy thông tin 1 thú cưng cụ thể (phải là chủ).
    """
    pet = await pet_crud.get_pet_by_id(db, pet_id)
    
    # KIỂM TRA QUYỀN SỞ HỮU
    if pet is None or pet.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy thú cưng"
        )
    return pet

@router.patch("/pets/{pet_id}", response_model=PetRead)
async def update_pet(
    pet_id: UUID,
    update_data: PetUpdate,
    current_user: Annotated[User, Depends(dependency.get_current_user)],
    db: Annotated[AsyncSession, Depends(get_session)]
):
    """
    Cập nhật thông tin 1 thú cưng (phải là chủ).
    """
    db_pet = await pet_crud.get_pet_by_id(db, pet_id)
    
    # KIỂM TRA QUYỀN SỞ HỮU
    if db_pet is None or db_pet.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy thú cưng"
        )
        
    updated_pet = await pet_crud.update_pet_profile(
        db=db, db_pet=db_pet, update_data=update_data
    )
    return updated_pet

@router.delete("/pets/{pet_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pet(
    pet_id: UUID,
    current_user: Annotated[User, Depends(dependency.get_current_user)],
    db: Annotated[AsyncSession, Depends(get_session)]
):
    """
    Xóa 1 thú cưng (phải là chủ).
    """
    db_pet = await pet_crud.get_pet_by_id(db, pet_id)
    
    # KIỂM TRA QUYỀN SỞ HỮU
    if db_pet is None or db_pet.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy thú cưng"
        )
        
    await pet_crud.delete_pet_by_id(db, db_pet=db_pet)
    
    # Ghi log
    await log_crud.create_audit_log(
        db=db,
        actor_id=current_user.id,
        action="USER_DELETE_PET",
        target_type="PET",
        target_id=db_pet.id
    )
    return


# =======================================================
# 3. API Xác minh (OTP)
# (Thêm BackgroundTasks để gửi mail/sms)
# =======================================================
@router.post("/send-otp")
async def send_verification_otp(
    # --- ĐÂY LÀ CHỖ SỬA LỖI ---
    # Đã di chuyển background_tasks (non-default) lên TRƯỚC
    # các tham số Depends (default)
    otp_request: RequestOTP, 
    background_tasks: BackgroundTasks, 
    current_user: Annotated[User, Depends(dependency.get_current_user)],
    db: Annotated[AsyncSession, Depends(get_session)]
):
    """
    User yêu cầu gửi OTP (Email hoặc SĐT).
    """
    if otp_request.purpose == OTPType.EMAIL_VERIFICATION:
        if current_user.is_email_verified:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Email đã được xác minh")
        # Logic gửi mail
        otp_code = security.generate_otp()
        otp_hash = security.get_password_hash(otp_code)
        await otp_crud.create_otp(db, user_id=current_user.id, purpose=otp_request.purpose, otp_hash=otp_hash)
        # background_tasks.add_task(send_email_func, current_user.email, otp_code)
        print(f"Gửi OTP Email: {otp_code} tới {current_user.email}") # Giả lập
        
    elif otp_request.purpose == OTPType.PHONE_VERIFICATION:
        if current_user.is_phone_verified:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "SĐT đã được xác minh")
        if not current_user.phone_number:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "User chưa cập nhật SĐT")
        # Logic gửi SMS
        otp_code = security.generate_otp()
        otp_hash = security.get_password_hash(otp_code)
        await otp_crud.create_otp(db, user_id=current_user.id, purpose=otp_request.purpose, otp_hash=otp_hash)
        # background_tasks.add_task(send_sms_func, current_user.phone_number, otp_code)
        print(f"Gửi OTP SMS: {otp_code} tới {current_user.phone_number}") # Giả lập
    
    else:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Mục đích không hợp lệ")

    return {"message": f"Đã gửi OTP {otp_request.purpose.value}"}


@router.post("/verify-otp", response_model=UserRead)
async def verify_otp(
    otp_data: VerifyOTP,
    current_user: Annotated[User, Depends(dependency.get_current_user)],
    db: Annotated[AsyncSession, Depends(get_session)]
):
    """
    User gửi OTP lên để xác minh.
    """
    db_otp = await otp_crud.get_active_otp(
        db, user_id=current_user.id, purpose=otp_data.purpose
    )
    
    if not db_otp:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "OTP không hợp lệ hoặc hết hạn")
        
    is_valid = security.verify_password(otp_data.otp, db_otp.hashed_otp)
    
    if not is_valid:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "OTP không đúng")

    # Nếu đúng -> Cập nhật trạng thái User
    if otp_data.purpose == OTPType.EMAIL_VERIFICATION:
        current_user.is_email_verified = True
    elif otp_data.purpose == OTPType.PHONE_VERIFICATION:
        current_user.is_phone_verified = True
    
    db.add(current_user)
    await otp_crud.deactivate_otp(db, db_otp=db_otp) # Xóa OTP đã dùng
    await db.commit()
    await db.refresh(current_user)
    
    return current_user
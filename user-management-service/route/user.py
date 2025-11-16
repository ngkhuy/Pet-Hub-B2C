from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
import httpx
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import Annotated, List, Optional
from uuid import UUID

from database import get_session
from dependency import dependency
from crud import user_crud, pet_crud, log_crud, otp_crud
from core import security
from models import OTPType, PetUpdate, RequestOTP, RequestPasswordOTP, ResetPassword, UserRead, User, UserUpdate, PetRead, PetCreate, VerifyOTP
from core.email_service import send_email_func
from core.config import settings

router = APIRouter(prefix="/user")

@router.get("/me", response_model=UserRead)
async def get_user_info(current_user: Annotated[User, Depends(dependency.get_current_user)]):
    """API lấy thông tin user hiện tại"""
    return current_user

@router.patch("/me", response_model=UserRead)
async def update_user_info(update_data: UserUpdate,
                           current_user: Annotated[User, Depends(dependency.get_current_user)],
                           db: Annotated[AsyncSession, Depends(get_session)]):
    """API cập nhật thông tin user đang đăng nhập"""
    updated_user = await user_crud.update_user_profile(db, current_user, update_data=update_data)
    
    return updated_user

# API cho user thêm pet vào profile
@router.post("/add-pets", response_model=PetRead, status_code=status.HTTP_201_CREATED)
async def create_new_pet(pet_data: PetCreate,
                         current_user: Annotated[User, Depends(dependency=dependency.get_current_user)],
                         db: Annotated[AsyncSession, Depends(get_session)]):
    """API cho user thêm pet vào profile"""
    pet = await pet_crud.create_pet(db, pet_data=pet_data, owner_id=current_user.id)
    
    # ghi log
    await log_crud.create_audit_log(
        db=db,
        actor_id=current_user.id,
        action="USER_CREATE_PET",
        target_type="PET",
        target_id=pet.id
    )
    
    return pet

# API lấy danh sách pet của user
@router.get("/pets", response_model=List[PetRead])
async def get_my_pets(current_user: Annotated[User, Depends(dependency=dependency.get_current_user)],
                      db: Annotated[AsyncSession, Depends(get_session)],
                      skip: int = 0,
                      limit: int = 50,
                      name: Optional[str] = None):
    """API lấy danh sách pet của user, có thể tìm theo tên"""
    pets = await pet_crud.get_pets_by_owner_id(db, owner_id=current_user.id, skip=skip, limit=limit, name=name)
    return pets

# API lấy thông tin của thú cưng cụ thể
@router.get("/pets/{pet_id}", response_model=PetRead)
async def get_pet_by_id(pet_id: UUID, 
                        current_user: Annotated[User, Depends(dependency=dependency.get_current_user)],
                        db: Annotated[AsyncSession, Depends(get_session)]):
    """API lấy thông tin thú cưng theo ID"""
    pet = await pet_crud.get_pet_by_id(db, pet_id=pet_id)
    if pet is None or pet.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy thú cưng")
    
    return pet

# API update thông tin cho pet
@router.patch("/pets/{pet_id}", response_model=PetRead)
async def update_pet(pet_id: UUID, update_date: PetUpdate,
                     current_user: Annotated[User, Depends(dependency.get_current_user)],
                     db: Annotated[AsyncSession, Depends(get_session)]):
    """API update thông tin cho pet"""
    db_pet = await pet_crud.get_pet_by_id(db, pet_id)
    if db_pet is None or db_pet.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy thú cưng")
    
    updated_pet = await pet_crud.update_pet_profile(db, db_pet, update_data=update_date)
    
    # ghi log
    await log_crud.create_audit_log(
        db=db,
        actor_id=current_user.id,
        action="USER_UPDATE_PET",
        target_type="PET",
        target_id=db_pet.id,
        details=update_date.model_dump(exclude_unset=True)
    )
    
    return updated_pet

# API delete pet
@router.delete("/pets/{pet_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pet(pet_id: UUID,
                     current_user: Annotated[User, Depends(dependency.get_current_user)],
                     db: Annotated[AsyncSession, Depends(get_session)]):
    """API xoá pet"""
    db_pet = await pet_crud.get_pet_by_id(db, pet_id)
    
    if db_pet is None or db_pet.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy thú cưng")
    
    await pet_crud.delete_pet_by_id(db, db_pet)
    
    # ghi log
    await log_crud.create_audit_log(
        db=db,
        actor_id=current_user.id,
        action="USER_DELETE_PET",
        target_type="PET",
        target_id=db_pet.id,
        details={"pet_name": db_pet.name}
    )
    return


# API dành cho OTP
@router.post("/verification/send-otp")
async def send_verification_otp(otp_request: RequestOTP, 
                                current_user: Annotated[User, Depends(dependency.get_current_user)],
                                db: Annotated[AsyncSession, Depends(get_session)],
                                background_tasks: BackgroundTasks):
    """API gửi OTP kèm mục đích của OTP"""
    if otp_request.purpose == OTPType.EMAIL_VERIFICATION:
        if current_user.is_email_verified:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email đã được xác thực thành công")
        
        otp_code = security.generate_otp()
        otp_hash = security.get_password_hash(otp_code)
        await otp_crud.create_otp(db, current_user.id, OTPType.EMAIL_VERIFICATION, otp_hash)
        
        background_tasks.add_task(
            send_email_func,
            to_email=current_user.email,
            subject="Xác minh tài khoản",
            message=f"Mã xác minh của bạn là: {otp_code}"
        )
        
    elif otp_request.purpose == OTPType.PHONE_VERIFICATION:
        if current_user.is_phone_verified:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Số diên thoại này đã xác minh")
        
        otp_code = security.generate_otp()
        otp_hash = security.get_password_hash(otp_code)
        await otp_crud.create_otp(db, current_user.id, OTPType.PHONE_VERIFICATION, otp_hash)
        
        background_tasks.add_task(
            send_email_func,
            to_email=current_user.email,
            subject="Xác minh tài khoản",
            message=f"Mã xác minh của bạn là: {otp_code}"
        )
    return {"message": f"OTP đã gửi thành công {otp_request.purpose}"}
    
    
# API xác minh OTP 
@router.post("/verification/verify-otp", response_model=UserRead)
async def verify_otp(otp_data: VerifyOTP, current_user: Annotated[User, Depends(dependency.get_current_user)],
                     db: Annotated[AsyncSession, Depends(get_session)]):
    """API xác minh OTP cho sđt và email"""
    db_otp = await otp_crud.get_active_otp(db, current_user.id, otp_data.purpose)
    
    if not db_otp:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP không hợp lệ hoặc hết hạn")
    
    is_valid = security.verify_password(otp_data.otp, db_otp.hashed_otp)
    
    if not is_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP sai")
    
    if otp_data.purpose == OTPType.EMAIL_VERIFICATION:
        current_user.is_email_verified = True
    elif otp_data.purpose == OTPType.PHONE_VERIFICATION:
        current_user.is_phone_verified = True
    
    db.add(current_user)
    await otp_crud.delete_otp(db, db_otp)
    await db.commit()
    await db.refresh(current_user)
    
    return current_user

# API tạo OTP khi quên mk
@router.post("/password/request-otp", status_code=status.HTTP_200_OK)
async def request_password_reset(request_data: RequestPasswordOTP,
                                 background_tasks: BackgroundTasks,
                                 db: Annotated[AsyncSession, Depends(get_session)]):
    """API tạo OTP cho user khi quên mk"""
    user = await user_crud.get_user_by_email(db, request_data.email)
    if not user:
        raise HTTPException(status_code=404, detail="Người dùng không tồn tại")
    
    otp_code = security.generate_otp()
    otp_hash = security.get_password_hash(otp_code)
    
    await otp_crud.create_otp(db, user.id, OTPType.RESET_PASSWORD, otp_hash)
    
    background_tasks.add_task(
        send_email_func,
        to_email=user.email,
        subject="Yêu cầu đặt lại mật khẩu",
        message=f"Mã xác minh của bạn là: {otp_code}"
    )
    
    return {"message": "OTP đã gửi thành công"}

# API xác minh OTP và đổi mk cho user
@router.post("/password/verify-otp", status_code=status.HTTP_200_OK)
async def reset_password(reset_data: ResetPassword,
                         db: Annotated[AsyncSession, Depends(get_session)]):
    """API xác minh OTP và đổi mk"""
    user = await user_crud.get_user_by_email(db, reset_data.email)
    if not user:
        raise HTTPException(status_code=400, detail="Email hoặc OTP không hợp lệ")
    
    db_otp = await otp_crud.get_active_otp(db, user.id, OTPType.RESET_PASSWORD)
    if not db_otp:
        raise HTTPException(status_code=400, detail="OTP không hợp lệ hoặc hết hạn")
    
    is_valid = security.verify_password(reset_data.otp, db_otp.hashed_otp)
    if not is_valid:
        raise HTTPException(status_code=400, detail="OTP không đúng")
    
    new_hashed_password = security.get_password_hash(reset_data.new_password)
    
    # tạo jwt internal gọi cho AS
    internal_token = security.create_jwt_token(
        data={
            "sub": str(user.id),
            "scope": "reset_password",
            "iss": "user-service",
            "aud": "auth-service"
        }
    )
    
    url = f"{settings.AUTH_SERVICE_INTERNAL_BASE_URL}/api/internal/reset-password"
    
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.patch(
                url,
                json={
                    "user_id": str(user.id), 
                    "hashed_password": new_hashed_password
                },
                headers={"Authorization": f"Bearer {internal_token}"}
            )
            response.raise_for_status()

    except httpx.RequestError as e:
        print(f"CRITICAL (S2S): Không gọi được Auth Service để reset password. Lỗi: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Dịch vụ tạm thời gián đoạn, vui lòng thử lại sau."
        )
        
    # 4. Nếu S2S thành công, xóa OTP
    await otp_crud.deactivate_otp(db, db_otp=db_otp)
    
    return {"message": "Đổi mật khẩu thành công."}
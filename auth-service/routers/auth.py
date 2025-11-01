from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.concurrency import run_in_threadpool
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from datetime import timedelta, datetime, timezone

from database import get_session
from models import UserCreate, UserRead, Token, UserRole, User, Role, TokenRefresh
from crud import user_crud
from core import security
from core.config import settings

router = APIRouter()

# register endpoint
@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register_new_user(user_create: UserCreate, db: AsyncSession = Depends(get_session)):
    """Register a new user"""
    # check email
    existing_user = await user_crud.get_user_by_email(db, user_create.email)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email đã được đăng ký")
    
    # create new user
    hashed_password = security.get_password_hash(user_create.password)
    user_data = user_create.model_dump(exclude={"password"})
    db_user = User(**user_data, hashed_password=hashed_password)
    
    user_role = await user_crud.get_role_by_name(db, "user")
    if not user_role:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Lỗi hệ thống, không tìm thấy role user")
    
    db.add(db_user)
    await db.flush()
    await db.refresh(db_user)
    
    # create link between UserRole
    if db_user.id:
        link = UserRole(user_id=db_user.id, role_id=user_role.id)
        db.add(link)
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Không thể tạo ID người dùng")
    
    await db.commit()
    await db.refresh(db_user)
    
    return db_user

# register for business role
@router.post("/register-business", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register_new_business(user_create: UserCreate, db: AsyncSession = Depends(get_session)):
    """Register a new business user"""
    
    # check existing user role 'business'
    existing_user = await user_crud.get_user_by_email(db, user_create.email)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Email đã được sử dụng")
    hashed_password = security.get_password_hash(user_create.password)
    user_data = user_create.model_dump(exclude={"password"})
    db_user = User(**user_data, hashed_password=hashed_password)
    
    business_role = await user_crud.get_role_by_name(db, "business")
    if not business_role:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Lỗi hệ thống, không tìm thấy role 'business'")
    
    db.add(db_user)
    await db.flush()
    await db.refresh(db_user)
    
    if db_user.id:
        link = UserRole(user_id=db_user.id, role_id=business_role.id)
        db.add(link)
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Không thể tạo ID người dùng")
        
    await db.commit()
    await db.refresh(db_user)
    
    return db_user

# login endpoint
@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_session)):
    """Login for access token"""
    user = await user_crud.get_user_by_email(db, form_data.username)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email hoặc mật khẩu không đúng", headers={"WWW-Authenitcate": "Bearer"})
    
    # Confirm password
    is_password_valid = await run_in_threadpool(security.verify_password, form_data.password, user.hashed_password)
    if not is_password_valid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sai mật khẩu", headers={"WWW-Authenticate":
            "Bearer"})
        
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tài khoản chưa kích hoạt")
    
    roles_statement = select(Role.name).join(UserRole).where(UserRole.user_id == user.id)
    roles_result = await db.exec(roles_statement)
    roles = roles_result.first()
    
    # Create access token
    token_data = {"sub": user.email,
                  "role": roles}
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(data=token_data, expires_delta=access_token_expires)
    
    # create refresh token
    refresh_token = security.create_refresh_token(data=token_data)
    
    # store refresh token
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    if user.id is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    await user_crud.create_refresh_token(db, user.id, refresh_token, expires_at)
    
    return Token(access_token=access_token, refresh_token=refresh_token, token_type="bearer")


# Dependency to get current user    
async def get_current_user(token: str = Depends(security.oauth2_scheme), db: AsyncSession = Depends(get_session)):
    """
    Get current user
    Decode token, get email, excute query to get user from database
    -> this is protected dependency
    """
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Không thể xác thực thông tin", headers={"WWW-Authenticate": "Bearer"})
    
    # decode token
    token_data = security.decode_token(token)
    if token_data is None:
        raise credentials_exception
    
    # get user from db
    user = await user_crud.get_user_by_email(db, token_data.email)
    if user is None:
        raise credentials_exception
    
    return user

# endpoint me
@router.get("/me", response_model=UserRead)
async def read_user_me(current_user: User = Depends(get_current_user)):
    return current_user

# Dependency for logout endpoint
async def get_current_user_payload(token: str = Depends(security.oauth2_scheme)):
    """Decode token without query db
    Protect logout endpoint
    """
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                          detail="Không thể xác thực thông tin",
                                          headers={"WWW-Authenticate": "Bearer"})
    
    token_data = security.decode_token(token)
    if token_data is None or token_data.email is None:
        raise credentials_exception
    return token_data

# /logout endpoint
@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(token_data: TokenRefresh, current_user: security.TokenData = Depends(get_current_user_payload),
                 db: AsyncSession = Depends(get_session)):
    """Logout, remove refresh token from DB"""
    await user_crud.revoke_refresh_token(db, token=token_data.refresh_token)
    
    return
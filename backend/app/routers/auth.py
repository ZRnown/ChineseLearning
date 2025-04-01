from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from ..dependencies import (
    get_current_user,
    get_current_user_optional,
    verify_password,
    create_access_token,
    get_password_hash,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        logger.info(f"开始注册用户: {user.username}")
        
        # 检查用户名是否已存在
        db_user = (
            db.query(models.User).filter(models.User.username == user.username).first()
        )
        if db_user:
            logger.warning(f"用户名已存在: {user.username}")
            raise HTTPException(status_code=400, detail="Username already registered")

        # 检查邮箱是否已存在
        db_email = db.query(models.User).filter(models.User.email == user.email).first()
        if db_email:
            logger.warning(f"邮箱已存在: {user.email}")
            raise HTTPException(status_code=400, detail="Email already registered")

        # 验证密码强度
        if len(user.password) < 6:
            logger.warning(f"密码长度不足: {user.username}")
            raise HTTPException(
                status_code=400, detail="Password must be at least 6 characters long"
            )

        # 验证邮箱格式
        if "@" not in user.email:
            logger.warning(f"邮箱格式无效: {user.email}")
            raise HTTPException(status_code=400, detail="Invalid email format")

        # 创建新用户
        hashed_password = get_password_hash(user.password)
        db_user = models.User(
            username=user.username, email=user.email, hashed_password=hashed_password
        )

        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        logger.info(f"用户注册成功: {user.username}")
        return db_user

    except HTTPException as he:
        # 重新抛出 HTTP 异常
        logger.error(f"用户注册失败 {user.username}: {he.detail}")
        raise he
    except Exception as e:
        # 处理其他异常
        error_msg = f"注册失败: {str(e)}"
        logger.error(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)


@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    try:
        # 打印登录尝试信息
        print(f"Login attempt for username: {form_data.username}")

        user = (
            db.query(models.User)
            .filter(models.User.username == form_data.username)
            .first()
        )

        if not user:
            print(f"User not found: {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or incorrect username",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # 打印密码验证信息
        is_valid = verify_password(form_data.password, user.hashed_password)
        print(f"Password verification result: {is_valid}")
        print(f"Provided password: {form_data.password}")
        print(f"Stored hashed password: {user.hashed_password}")

        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # 创建访问令牌
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )

        print(f"Login successful for user: {user.username}")
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "created_at": user.created_at,
            },
        }

    except HTTPException as he:
        # 重新抛出 HTTP 异常
        print(f"Login failed for {form_data.username}: {he.detail}")
        raise he
    except Exception as e:
        # 处理其他异常
        error_msg = f"Login failed: {str(e)}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)


@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    return await login_for_access_token(form_data, db)


@router.get("/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user


__all__ = [
    "get_current_user",
    "get_current_user_optional",
    "verify_password",
    "get_password_hash",
    "create_access_token",
]

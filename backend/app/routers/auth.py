from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from .. import models, schemas
from ..database import get_db
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ..auth import create_access_token, get_password_hash, verify_password
from sqlalchemy import Column, Integer, String, DateTime, func

router = APIRouter()

# 密码加密
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# JWT配置
SECRET_KEY = "your-secret-key"  # 在生产环境中应该使用环境变量
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


class UserCreate(BaseModel):
    username: str
    password: str
    email: str


class User(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: schemas.User


def verify_password(plain_password, hashed_password):
    try:
        result = pwd_context.verify(plain_password, hashed_password)
        print(f"Password verification details:")
        print(f"Plain password: {plain_password}")
        print(f"Hashed password: {hashed_password}")
        print(f"Verification result: {result}")
        return result
    except Exception as e:
        print(f"Error during password verification: {str(e)}")
        return False


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user


async def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    # 如果没有提供 token，返回 None
    if not token:
        return None

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
    except JWTError:
        return None

    user = db.query(models.User).filter(models.User.username == username).first()
    return user


@router.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        # 检查用户名是否已存在
        db_user = (
            db.query(models.User).filter(models.User.username == user.username).first()
        )
        if db_user:
            raise HTTPException(status_code=400, detail="Username already registered")

        # 检查邮箱是否已存在
        db_email = db.query(models.User).filter(models.User.email == user.email).first()
        if db_email:
            raise HTTPException(status_code=400, detail="Email already registered")

        # 验证密码强度
        if len(user.password) < 6:
            raise HTTPException(
                status_code=400, detail="Password must be at least 6 characters long"
            )

        # 验证邮箱格式
        if "@" not in user.email:
            raise HTTPException(status_code=400, detail="Invalid email format")

        # 创建新用户
        hashed_password = get_password_hash(user.password)
        db_user = models.User(
            username=user.username, email=user.email, hashed_password=hashed_password
        )

        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        print(f"User registered successfully: {user.username}")
        return db_user

    except HTTPException as he:
        # 重新抛出 HTTP 异常
        print(f"Registration failed for {user.username}: {he.detail}")
        raise he
    except Exception as e:
        # 处理其他异常
        error_msg = f"Registration failed: {str(e)}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)


@router.post("/token", response_model=Token)
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

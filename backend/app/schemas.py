from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class UserBase(BaseModel):
    username: str
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ClassicBase(BaseModel):
    title: str
    content: str
    dynasty: Optional[str] = None
    author: Optional[str] = None
    explanation: Optional[str] = None


class ClassicCreate(ClassicBase):
    pass


class ClassicUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    dynasty: Optional[str] = None
    author: Optional[str] = None
    explanation: Optional[str] = None


class Classic(ClassicBase):
    id: int

    class Config:
        from_attributes = True


# 添加 Note 相关模型
class NoteBase(BaseModel):
    content: str
    classic_id: int


class NoteCreate(NoteBase):
    pass


class Note(BaseModel):
    id: int
    content: str
    classic_id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Translation(BaseModel):
    id: int
    content: str
    language: str
    classic_id: int
    created_at: datetime

    class Config:
        from_attributes = True

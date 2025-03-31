from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class TagBase(BaseModel):
    name: str


class TagCreate(TagBase):
    pass


class Tag(TagBase):
    id: int

    class Config:
        from_attributes = True


class TranslationBase(BaseModel):
    content: str
    translator: Optional[str] = None
    language: str


class TranslationCreate(TranslationBase):
    pass


class Translation(TranslationBase):
    id: int
    classic_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ClassicBase(BaseModel):
    title: str
    content: str
    author: Optional[str] = None
    dynasty: Optional[str] = None
    category: Optional[str] = None
    source: Optional[str] = None
    tags: Optional[List[str]] = []


class ClassicCreate(ClassicBase):
    pass


class ClassicUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    dynasty: Optional[str] = None
    category: Optional[str] = None
    source: Optional[str] = None
    tags: Optional[List[str]] = None


class ClassicResponse(ClassicBase):
    id: int
    created_at: datetime
    updated_at: datetime
    translations: List[Translation] = []
    tags: List[Tag] = []

    class Config:
        from_attributes = True

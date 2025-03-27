from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from .. import models, schemas
from ..routers.auth import get_current_user, get_current_user_optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()


class ClassicBase(BaseModel):
    title: str
    author: str
    dynasty: str
    content: str
    translation: Optional[str] = None


class ClassicCreate(ClassicBase):
    pass


class Classic(ClassicBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_favorite: bool = False
    is_liked: bool = False

    class Config:
        from_attributes = True


class TranslationBase(BaseModel):
    content: str
    language: str


class TranslationCreate(TranslationBase):
    classic_id: int


class Translation(TranslationBase):
    id: int
    classic_id: int
    created_at: str

    class Config:
        from_attributes = True


@router.get("/", response_model=List[schemas.Classic])
async def get_classics(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_optional),
):
    classics = db.query(models.Classic).offset(skip).limit(limit).all()
    return classics


@router.get("/{classic_id}", response_model=schemas.Classic)
@router.get("/{classic_id}/", response_model=schemas.Classic)
def get_classic(
    classic_id: int, 
    db: Session = Depends(get_db)
):
    """获取单个古籍详情，无需登录"""
    classic = db.query(models.Classic).filter(models.Classic.id == classic_id).first()
    if classic is None:
        raise HTTPException(status_code=404, detail="Classic not found")
    return classic


@router.post("/", response_model=schemas.Classic)
async def create_classic(
    classic: schemas.ClassicCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_optional),
):
    db_classic = models.Classic(**classic.dict())
    db.add(db_classic)
    db.commit()
    db.refresh(db_classic)
    return db_classic


@router.put("/{classic_id}", response_model=schemas.Classic)
async def update_classic(
    classic_id: int,
    classic: schemas.ClassicUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_optional),
):
    db_classic = (
        db.query(models.Classic).filter(models.Classic.id == classic_id).first()
    )
    if not db_classic:
        raise HTTPException(status_code=404, detail="Classic not found")

    for key, value in classic.dict(exclude_unset=True).items():
        setattr(db_classic, key, value)

    db.commit()
    db.refresh(db_classic)
    return db_classic


@router.delete("/{classic_id}")
async def delete_classic(
    classic_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_optional),
):
    db_classic = (
        db.query(models.Classic).filter(models.Classic.id == classic_id).first()
    )
    if not db_classic:
        raise HTTPException(status_code=404, detail="Classic not found")

    db.delete(db_classic)
    db.commit()
    return {"message": "Classic deleted successfully"}


@router.post("/{classic_id}/translations", response_model=Translation)
def create_translation(
    classic_id: int,
    translation: TranslationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_optional),
):
    db_classic = (
        db.query(models.Classic).filter(models.Classic.id == classic_id).first()
    )
    if db_classic is None:
        raise HTTPException(status_code=404, detail="Classic not found")

    db_translation = models.Translation(**translation.dict())
    db.add(db_translation)
    db.commit()
    db.refresh(db_translation)
    return db_translation


@router.get("/{classic_id}/translations", response_model=List[Translation])
def read_translations(
    classic_id: int, language: Optional[str] = None, db: Session = Depends(get_db)
):
    query = db.query(models.Translation).filter(
        models.Translation.classic_id == classic_id
    )
    if language:
        query = query.filter(models.Translation.language == language)
    return query.all()


@router.get("/{classic_id}/comments", response_model=List[schemas.Note])
@router.get("/{classic_id}/comments/", response_model=List[schemas.Note])
def get_classic_comments(
    classic_id: int,
    page: int = 1,
    db: Session = Depends(get_db)
):
    """获取古籍的所有评论，无需登录"""
    print(f"Fetching comments for classic {classic_id}, page {page}")
    
    # 计算分页
    limit = 10
    skip = (page - 1) * limit
    
    notes = db.query(models.Note).filter(
        models.Note.classic_id == classic_id
    ).offset(skip).limit(limit).all()
    
    print(f"Found {len(notes)} comments")
    return notes

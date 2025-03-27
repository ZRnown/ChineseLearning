from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from .. import models
from .auth import get_current_user_optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()


class TranslationBase(BaseModel):
    content: str
    classic_id: int


class TranslationCreate(TranslationBase):
    pass


class Translation(TranslationBase):
    id: int
    created_at: datetime
    updated_at: datetime
    user_id: int

    class Config:
        from_attributes = True


@router.get("/", response_model=List[Translation])
def get_translations_by_classic(
    classic_id: Optional[int] = None,
    language: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """获取指定古籍的所有译文"""
    query = db.query(models.Translation)
    
    if classic_id:
        query = query.filter(models.Translation.classic_id == classic_id)
        
    if language:
        query = query.filter(models.Translation.language == language)
        
    translations = query.all()
    return translations


@router.get("/{translation_id}", response_model=Translation)
async def get_translation(
    translation_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional),
):
    translation = (
        db.query(models.Translation)
        .filter(models.Translation.id == translation_id)
        .first()
    )
    if not translation:
        raise HTTPException(status_code=404, detail="Translation not found")
    return translation


@router.post("/", response_model=Translation)
async def create_translation(
    translation: TranslationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_optional),
):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    # 检查古籍是否存在
    classic = (
        db.query(models.Classic)
        .filter(models.Classic.id == translation.classic_id)
        .first()
    )
    if not classic:
        raise HTTPException(status_code=404, detail="Classic not found")

    db_translation = models.Translation(
        **translation.dict(),
        user_id=current_user.id,
    )
    db.add(db_translation)
    db.commit()
    db.refresh(db_translation)
    return db_translation


@router.put("/{translation_id}", response_model=Translation)
async def update_translation(
    translation_id: int,
    translation: TranslationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_optional),
):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    db_translation = (
        db.query(models.Translation)
        .filter(models.Translation.id == translation_id)
        .first()
    )
    if not db_translation:
        raise HTTPException(status_code=404, detail="Translation not found")

    if db_translation.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )

    for key, value in translation.dict().items():
        setattr(db_translation, key, value)

    db.commit()
    db.refresh(db_translation)
    return db_translation


@router.delete("/{translation_id}")
async def delete_translation(
    translation_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_optional),
):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    db_translation = (
        db.query(models.Translation)
        .filter(models.Translation.id == translation_id)
        .first()
    )
    if not db_translation:
        raise HTTPException(status_code=404, detail="Translation not found")

    if db_translation.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )

    db.delete(db_translation)
    db.commit()
    return {"message": "Translation deleted successfully"}

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models.classic import Classic, Tag, Translation
from schemas.classic import (
    ClassicCreate,
    ClassicUpdate,
    ClassicResponse,
    TagCreate,
    TranslationCreate,
)
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()


class PaginatedResponse(BaseModel):
    items: List[ClassicResponse]
    total: int
    skip: int
    limit: int


@router.get("/classics", response_model=PaginatedResponse)
def get_classics(
    skip: int = 0,
    limit: int = 9,
    category: Optional[str] = None,
    dynasty: Optional[str] = None,
    tag: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """获取古籍列表，支持分页和筛选"""
    # 构建查询条件
    query = db.query(Classic)

    # 应用筛选条件
    if category:
        query = query.filter(Classic.category == category)
    if dynasty:
        query = query.filter(Classic.dynasty == dynasty)
    if tag:
        query = query.join(Classic.tags).filter(Tag.name == tag)

    # 获取总数
    total = query.count()

    # 应用分页
    classics = query.offset(skip).limit(limit).all()

    # 返回分页响应
    return {"items": classics, "total": total, "skip": skip, "limit": limit}


@router.post("/classics", response_model=ClassicResponse)
def create_classic(classic: ClassicCreate, db: Session = Depends(get_db)):
    db_classic = Classic(
        title=classic.title,
        content=classic.content,
        author=classic.author,
        dynasty=classic.dynasty,
        category=classic.category,
        source=classic.source,
    )

    # 处理标签
    if classic.tags:
        for tag_name in classic.tags:
            tag = db.query(Tag).filter(Tag.name == tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.add(tag)
            db_classic.tags.append(tag)

    db.add(db_classic)
    db.commit()
    db.refresh(db_classic)
    return db_classic


@router.get("/classics/{classic_id}", response_model=ClassicResponse)
def get_classic(classic_id: int, db: Session = Depends(get_db)):
    classic = db.query(Classic).filter(Classic.id == classic_id).first()
    if not classic:
        raise HTTPException(status_code=404, detail="Classic not found")
    return classic


@router.put("/classics/{classic_id}", response_model=ClassicResponse)
def update_classic(
    classic_id: int, classic: ClassicUpdate, db: Session = Depends(get_db)
):
    db_classic = db.query(Classic).filter(Classic.id == classic_id).first()
    if not db_classic:
        raise HTTPException(status_code=404, detail="Classic not found")

    for field, value in classic.dict(exclude_unset=True).items():
        if field == "tags":
            # 更新标签
            db_classic.tags = []
            for tag_name in value:
                tag = db.query(Tag).filter(Tag.name == tag_name).first()
                if not tag:
                    tag = Tag(name=tag_name)
                    db.add(tag)
                db_classic.tags.append(tag)
        else:
            setattr(db_classic, field, value)

    db.commit()
    db.refresh(db_classic)
    return db_classic


@router.delete("/classics/{classic_id}")
def delete_classic(classic_id: int, db: Session = Depends(get_db)):
    classic = db.query(Classic).filter(Classic.id == classic_id).first()
    if not classic:
        raise HTTPException(status_code=404, detail="Classic not found")

    db.delete(classic)
    db.commit()
    return {"message": "Classic deleted successfully"}


@router.post("/classics/{classic_id}/translations", response_model=Translation)
def add_translation(
    classic_id: int, translation: TranslationCreate, db: Session = Depends(get_db)
):
    classic = db.query(Classic).filter(Classic.id == classic_id).first()
    if not classic:
        raise HTTPException(status_code=404, detail="Classic not found")

    db_translation = Translation(
        classic_id=classic_id,
        content=translation.content,
        translator=translation.translator,
        language=translation.language,
    )

    db.add(db_translation)
    db.commit()
    db.refresh(db_translation)
    return db_translation

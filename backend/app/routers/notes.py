from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from .. import models
from .auth import get_current_user_optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()


class NoteBase(BaseModel):
    content: str
    classic_id: int


class NoteCreate(NoteBase):
    pass


class Note(NoteBase):
    id: int
    created_at: datetime
    updated_at: datetime
    user_id: int

    class Config:
        from_attributes = True


@router.get("/", response_model=List[Note])
async def get_notes(
    skip: int = 0,
    limit: int = 10,
    classic_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional),
):
    query = db.query(models.Note)

    if classic_id:
        query = query.filter(models.Note.classic_id == classic_id)

    notes = query.offset(skip).limit(limit).all()
    return notes


@router.get("/{note_id}", response_model=Note)
async def get_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional),
):
    note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@router.post("/", response_model=Note)
async def create_note(
    note: NoteCreate,
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
        db.query(models.Classic).filter(models.Classic.id == note.classic_id).first()
    )
    if not classic:
        raise HTTPException(status_code=404, detail="Classic not found")

    db_note = models.Note(
        **note.dict(),
        user_id=current_user.id,
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


@router.put("/{note_id}", response_model=Note)
async def update_note(
    note_id: int,
    note: NoteCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_optional),
):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")

    if db_note.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )

    for key, value in note.dict().items():
        setattr(db_note, key, value)

    db.commit()
    db.refresh(db_note)
    return db_note


@router.delete("/{note_id}")
async def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_optional),
):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")

    if db_note.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )

    db.delete(db_note)
    db.commit()
    return {"message": "Note deleted successfully"}

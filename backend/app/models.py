from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    favorites = relationship("Favorite", back_populates="user")
    likes = relationship("Like", back_populates="user")
    notes = relationship("Note", back_populates="user")


class Classic(Base):
    __tablename__ = "classics"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    author = Column(String)
    dynasty = Column(String)
    content = Column(Text)
    translation = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    favorites = relationship("Favorite", back_populates="classic")
    likes = relationship("Like", back_populates="classic")
    notes = relationship("Note", back_populates="classic")
    translations = relationship("Translation", back_populates="classic")


class Translation(Base):
    __tablename__ = "translations"

    id = Column(Integer, primary_key=True, index=True)
    classic_id = Column(Integer, ForeignKey("classics.id"))
    content = Column(Text)
    language = Column(String)  # e.g., "en", "ja", "ko"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    classic = relationship("Classic", back_populates="translations")


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    classic_id = Column(Integer, ForeignKey("classics.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="favorites")
    classic = relationship("Classic", back_populates="favorites")


class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    classic_id = Column(Integer, ForeignKey("classics.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="likes")
    classic = relationship("Classic", back_populates="likes")


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    classic_id = Column(Integer, ForeignKey("classics.id"))
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="notes")
    classic = relationship("Classic", back_populates="notes")

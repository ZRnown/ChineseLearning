from sqlalchemy import Boolean, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    translations = relationship("Translation", back_populates="user")
    comments = relationship("Comment", back_populates="user")
    favorites = relationship("Favorite", back_populates="user")
    likes = relationship("Like", back_populates="user")
    notes = relationship("Note", back_populates="user")


class Classic(Base):
    __tablename__ = "classics"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String)
    dynasty = Column(String, nullable=True)
    author = Column(String, nullable=True)
    explanation = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    notes = relationship("Note", back_populates="classic")
    translations = relationship("Translation", back_populates="classic")
    favorites = relationship("Favorite", back_populates="classic")
    likes = relationship("Like", back_populates="classic")
    comments = relationship("Comment", back_populates="classic")


class Translation(Base):
    __tablename__ = "translations"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
    language = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    classic_id = Column(Integer, ForeignKey("classics.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    classic = relationship("Classic", back_populates="translations")
    user = relationship("User", back_populates="translations")


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
    content = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    user_id = Column(Integer, ForeignKey("users.id"))
    classic_id = Column(Integer, ForeignKey("classics.id"))

    user = relationship("User", back_populates="notes")
    classic = relationship("Classic", back_populates="notes")


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    classic_id = Column(Integer, ForeignKey("classics.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    classic = relationship("Classic", back_populates="comments")
    user = relationship("User", back_populates="comments")

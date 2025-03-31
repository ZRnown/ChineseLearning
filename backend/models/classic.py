from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

# 古籍-标签关联表
classic_tags = Table(
    "classic_tags",
    Base.metadata,
    Column("classic_id", Integer, ForeignKey("classics.id")),
    Column("tag_id", Integer, ForeignKey("tags.id")),
)


class Classic(Base):
    __tablename__ = "classics"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    author = Column(String(100))
    dynasty = Column(String(50))
    category = Column(String(50))  # 新增：分类（如：诗、词、文等）
    source = Column(String(255))  # 新增：出处
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 关联
    translations = relationship("Translation", back_populates="classic")
    tags = relationship("Tag", secondary=classic_tags, back_populates="classics")


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    classics = relationship("Classic", secondary=classic_tags, back_populates="tags")


class Translation(Base):
    __tablename__ = "translations"

    id = Column(Integer, primary_key=True, index=True)
    classic_id = Column(Integer, ForeignKey("classics.id"))
    content = Column(Text, nullable=False)
    translator = Column(String(100))
    language = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

    classic = relationship("Classic", back_populates="translations")

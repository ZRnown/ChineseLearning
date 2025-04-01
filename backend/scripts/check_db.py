import os
import sys

# 添加backend目录到Python路径
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BACKEND_DIR)

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.classic import Classic, Tag

# 数据库连接
SQLALCHEMY_DATABASE_URL = f"sqlite:///{os.path.join(BACKEND_DIR, 'app.db')}"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建会话
db = SessionLocal()

# 检查标签
print("\n=== 标签 ===")
tags = db.query(Tag).all()
for tag in tags:
    print(f"标签: {tag.name}")

# 检查古籍
print("\n=== 古籍 ===")
classics = db.query(Classic).all()
for classic in classics:
    print(f"\n标题: {classic.title}")
    print(f"作者: {classic.author}")
    print(f"朝代: {classic.dynasty}")
    print(f"分类: {classic.category}")
    print("标签:", ", ".join([tag.name for tag in classic.tags]))

# 关闭会话
db.close()

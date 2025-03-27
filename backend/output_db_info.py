from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from app.database import DATABASE_URL
from app.models import User

def output_db_info():
    # 创建数据库引擎
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    # 使用 SQLAlchemy 的 inspect 获取数据库信息
    inspector = inspect(engine)
    
    # 获取所有表名
    tables = inspector.get_table_names()
    print("数据库中的表:")
    for table in tables:
        print(f"- {table}")
        
        # 获取每个表的列信息
        columns = inspector.get_columns(table)
        for column in columns:
            print(f"  - {column['name']} ({column['type']})")
    
    # 查询用户表中的数据
    print("\n注册用户信息:")
    users = session.query(User).all()
    for user in users:
        print(f"ID: {user.id}, 用户名: {user.username}, 密码哈希: {user.hashed_password}, 邮箱: {user.email}")

    session.close()

if __name__ == "__main__":
    output_db_info() 
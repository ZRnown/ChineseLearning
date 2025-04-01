from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Classic
from app.database import DATABASE_URL

def update_classics_categories():
    # 创建数据库引擎
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # 获取所有古籍
        classics = session.query(Classic).all()
        
        # 根据标题和内容判断分类
        for classic in classics:
            # 诗歌类
            if any(keyword in classic.title for keyword in ["诗", "静夜思", "登鹳雀楼", "春晓", "望庐山瀑布", "相思", "送杜少府", "登高", "望岳", "送友人", "鹿柴"]):
                classic.category = "诗"
            # 词类
            elif "词" in classic.title:
                classic.category = "词"
            # 经部类
            elif any(keyword in classic.title for keyword in ["论语", "孟子", "大学", "中庸", "易经"]):
                classic.category = "经"
            # 史部类
            elif any(keyword in classic.title for keyword in ["史记", "汉书", "后汉书", "三国志"]):
                classic.category = "史"
            # 道家类
            elif "道德经" in classic.title:
                classic.category = "道"
            # 默认为文类
            else:
                classic.category = "文"

        # 提交更改
        session.commit()
        print("成功更新古籍分类")

    except Exception as e:
        print(f"更新失败: {str(e)}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    update_classics_categories() 
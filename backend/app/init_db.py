from sqlalchemy.orm import Session
from . import models
from .database import SessionLocal, engine

# 创建所有表
models.Base.metadata.create_all(bind=engine)


def init_db():
    db = SessionLocal()
    try:
        # 检查是否已有数据
        if db.query(models.Classic).count() > 0:
            return

        # 添加示例古籍
        classics = [
            {
                "title": "论语",
                "author": "孔子及其弟子",
                "dynasty": "春秋",
                "content": '子曰："学而时习之，不亦说乎？有朋自远方来，不亦乐乎？人不知而不愠，不亦君子乎？"',
                "explanation": "孔子说：'学习并且经常温习，不也很愉快吗？有朋友从远方来，不也很快乐吗？别人不了解我，我也不恼怒，不也是君子的品格吗？'",
            },
            {
                "title": "道德经",
                "author": "老子",
                "dynasty": "春秋",
                "content": "道可道，非常道。名可名，非常名。无名天地之始，有名万物之母。",
                "explanation": "可以说出的道，就不是永恒的道。可以叫出的名，就不是永恒的名。没有名的时候，是天地的开始；有了名之后，是万物的母亲。",
            },
            {
                "title": "孟子",
                "author": "孟子",
                "dynasty": "战国",
                "content": "人皆有不忍人之心。先王有不忍人之心，斯有不忍人之政矣。以不忍人之心，行不忍人之政，治天下可运之掌上。",
                "explanation": "人人都有恻隐之心。先王有恻隐之心，就能实行仁政。用恻隐之心，推行仁政，治理天下就像把东西放在手掌上那样容易。",
            },
        ]

        for classic_data in classics:
            classic = models.Classic(**classic_data)
            db.add(classic)

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    init_db()

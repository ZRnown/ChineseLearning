import os
import sys
from datetime import datetime

# 添加backend目录到Python路径
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BACKEND_DIR)

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.classic import Base, Classic, Tag

# 数据库连接
SQLALCHEMY_DATABASE_URL = f"sqlite:///{os.path.join(BACKEND_DIR, 'app.db')}"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建数据库表
Base.metadata.create_all(bind=engine)

# 创建会话
db = SessionLocal()

# 预定义标签
tags = {
    "山水": "描写自然山水景色",
    "抒情": "表达个人情感",
    "咏物": "描写物品",
    "咏史": "描写历史事件",
    "边塞": "描写边塞生活",
    "田园": "描写田园生活",
    "送别": "送别诗",
    "思乡": "思念家乡",
    "爱情": "描写爱情",
    "哲理": "包含哲理思考",
}

# 创建标签
for tag_name, description in tags.items():
    tag = db.query(Tag).filter(Tag.name == tag_name).first()
    if not tag:
        tag = Tag(name=tag_name)
        db.add(tag)

# 提交标签更改
db.commit()

# 更多古籍数据
more_classics = [
    {
        "title": "望庐山瀑布",
        "content": "日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。",
        "author": "李白",
        "dynasty": "唐",
        "category": "诗",
        "tags": ["山水", "抒情"],
    },
    {
        "title": "静夜思",
        "content": "床前明月光，疑是地上霜。举头望明月，低头思故乡。",
        "author": "李白",
        "dynasty": "唐",
        "category": "诗",
        "tags": ["思乡", "抒情"],
    },
    {
        "title": "登鹳雀楼",
        "content": "白日依山尽，黄河入海流。欲穷千里目，更上一层楼。",
        "author": "王之涣",
        "dynasty": "唐",
        "category": "诗",
        "tags": ["山水", "哲理"],
    },
    {
        "title": "春晓",
        "content": "春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。",
        "author": "孟浩然",
        "dynasty": "唐",
        "category": "诗",
        "tags": ["田园", "抒情"],
    },
    {
        "title": "送杜少府之任蜀州",
        "content": "城阙辅三秦，风烟望五津。与君离别意，同是宦游人。海内存知己，天涯若比邻。无为在歧路，儿女共沾巾。",
        "author": "王勃",
        "dynasty": "唐",
        "category": "诗",
        "tags": ["送别", "抒情"],
    },
    {
        "title": "水调歌头·明月几时有",
        "content": "明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。",
        "author": "苏轼",
        "dynasty": "宋",
        "category": "词",
        "tags": ["抒情", "哲理"],
    },
    {
        "title": "念奴娇·赤壁怀古",
        "content": "大江东去，浪淘尽，千古风流人物。故垒西边，人道是，三国周郎赤壁。乱石穿空，惊涛拍岸，卷起千堆雪。江山如画，一时多少豪杰。",
        "author": "苏轼",
        "dynasty": "宋",
        "category": "词",
        "tags": ["咏史", "抒情"],
    },
    {
        "title": "醉花阴·薄雾浓云愁永昼",
        "content": "薄雾浓云愁永昼，瑞脑销金兽。佳节又重阳，玉枕纱厨，半夜凉初透。东篱把酒黄昏后，有暗香盈袖。莫道不销魂，帘卷西风，人比黄花瘦。",
        "author": "李清照",
        "dynasty": "宋",
        "category": "词",
        "tags": ["抒情", "爱情"],
    },
    {
        "title": "论语·学而",
        "content": "子曰：学而时习之，不亦说乎？有朋自远方来，不亦乐乎？人不知而不愠，不亦君子乎？",
        "author": "孔子",
        "dynasty": "春秋",
        "category": "经",
        "tags": ["哲理"],
    },
    {
        "title": "道德经·第一章",
        "content": "道可道，非常道。名可名，非常名。无名天地之始，有名万物之母。故常无欲，以观其妙；常有欲，以观其徼。此两者同出而异名，同谓之玄。玄之又玄，众妙之门。",
        "author": "老子",
        "dynasty": "春秋",
        "category": "道",
        "tags": ["哲理"],
    },
    {
        "title": "史记·项羽本纪",
        "content": "项籍者，下相人也，字羽。初起时，年二十四。其季父项梁，梁父即楚将项燕，为秦将王翦所戮者也。项氏世世为楚将，封于项，故姓项氏。",
        "author": "司马迁",
        "dynasty": "汉",
        "category": "史",
        "tags": ["咏史"],
    },
    {
        "title": "兰亭集序",
        "content": "永和九年，岁在癸丑，暮春之初，会于会稽山阴之兰亭，修禊事也。群贤毕至，少长咸集。此地有崇山峻岭，茂林修竹，又有清流激湍，映带左右。",
        "author": "王羲之",
        "dynasty": "晋",
        "category": "文",
        "tags": ["山水", "抒情"],
    },
]

# 添加古籍
for classic_data in more_classics:
    # 检查是否已存在
    existing = db.query(Classic).filter(Classic.title == classic_data["title"]).first()
    if not existing:
        classic = Classic(
            title=classic_data["title"],
            content=classic_data["content"],
            author=classic_data["author"],
            dynasty=classic_data["dynasty"],
            category=classic_data["category"],
        )

        # 添加标签
        for tag_name in classic_data["tags"]:
            tag = db.query(Tag).filter(Tag.name == tag_name).first()
            if tag:
                classic.tags.append(tag)

        db.add(classic)

# 提交更改
db.commit()
print("Successfully added more classics!")

# 关闭会话
db.close()

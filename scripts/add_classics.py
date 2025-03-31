import requests
import json
import time

# API endpoint
BASE_URL = "http://localhost:8000/api"

# 古籍数据
classics_data = [
    {
        "title": "静夜思",
        "content": "床前明月光，疑是地上霜。举头望明月，低头思故乡。",
        "author": "李白",
        "dynasty": "唐",
        "category": "诗",
        "source": "全唐诗",
        "tags": ["思乡", "月亮"],
    },
    {
        "title": "登鹳雀楼",
        "content": "白日依山尽，黄河入海流。欲穷千里目，更上一层楼。",
        "author": "王之涣",
        "dynasty": "唐",
        "category": "诗",
        "source": "全唐诗",
        "tags": ["登高", "山水"],
    },
    {
        "title": "春晓",
        "content": "春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。",
        "author": "孟浩然",
        "dynasty": "唐",
        "category": "诗",
        "source": "全唐诗",
        "tags": ["春天", "自然"],
    },
    {
        "title": "望庐山瀑布",
        "content": "日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。",
        "author": "李白",
        "dynasty": "唐",
        "category": "诗",
        "source": "全唐诗",
        "tags": ["山水", "自然"],
    },
    {
        "title": "相思",
        "content": "红豆生南国，春来发几枝。愿君多采撷，此物最相思。",
        "author": "王维",
        "dynasty": "唐",
        "category": "诗",
        "source": "全唐诗",
        "tags": ["爱情", "思念"],
    },
    {
        "title": "送杜少府之任蜀州",
        "content": "城阙辅三秦，风烟望五津。与君离别意，同是宦游人。海内存知己，天涯若比邻。无为在歧路，儿女共沾巾。",
        "author": "王勃",
        "dynasty": "唐",
        "category": "诗",
        "source": "全唐诗",
        "tags": ["送别", "友情"],
    },
    {
        "title": "登高",
        "content": "风急天高猿啸哀，渚清沙白鸟飞回。无边落木萧萧下，不尽长江滚滚来。万里悲秋常作客，百年多病独登台。艰难苦恨繁霜鬓，潦倒新停浊酒杯。",
        "author": "杜甫",
        "dynasty": "唐",
        "category": "诗",
        "source": "全唐诗",
        "tags": ["登高", "秋天"],
    },
    {
        "title": "望岳",
        "content": "岱宗夫如何？齐鲁青未了。造化钟神秀，阴阳割昏晓。荡胸生曾云，决眦入归鸟。会当凌绝顶，一览众山小。",
        "author": "杜甫",
        "dynasty": "唐",
        "category": "诗",
        "source": "全唐诗",
        "tags": ["山水", "登高"],
    },
    {
        "title": "送友人",
        "content": "青山横北郭，白水绕东城。此地一为别，孤蓬万里征。浮云游子意，落日故人情。挥手自兹去，萧萧班马鸣。",
        "author": "李白",
        "dynasty": "唐",
        "category": "诗",
        "source": "全唐诗",
        "tags": ["送别", "友情"],
    },
    {
        "title": "鹿柴",
        "content": "空山不见人，但闻人语响。返景入深林，复照青苔上。",
        "author": "王维",
        "dynasty": "唐",
        "category": "诗",
        "source": "全唐诗",
        "tags": ["山水", "自然"],
    },
]


def add_classic(classic_data):
    """添加一首古诗"""
    try:
        response = requests.post(
            f"{BASE_URL}/classics",
            json=classic_data,
            headers={"Content-Type": "application/json"},
        )
        response.raise_for_status()
        print(f"成功添加: {classic_data['title']}")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"添加失败 {classic_data['title']}: {str(e)}")
        return None


def main():
    print("开始添加古籍...")
    success_count = 0
    fail_count = 0

    for classic in classics_data:
        result = add_classic(classic)
        if result:
            success_count += 1
        else:
            fail_count += 1
        time.sleep(1)  # 添加延迟，避免请求过快

    print(f"\n添加完成:")
    print(f"成功: {success_count}")
    print(f"失败: {fail_count}")


if __name__ == "__main__":
    main()

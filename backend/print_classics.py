from app.database import SessionLocal
from app.models import Classic

def print_all_classics():
    db = SessionLocal()
    try:
        classics = db.query(Classic).all()
        print("\n=== 古籍数据库内容 ===")
        print(f"总共有 {len(classics)} 条记录\n")
        
        for i, classic in enumerate(classics, 1):
            print(f"=== 第 {i} 条记录 ===")
            print(f"ID: {classic.id}")
            print(f"标题: {classic.title or '无'}")
            print(f"朝代: {classic.dynasty or '无'}")
            print(f"作者: {classic.author or '无'}")
            print(f"分类: {classic.category or '无'}")
            
            content = classic.content or '无内容'
            if len(content) > 100:
                content = content[:100] + "..."
            print(f"内容: {content}")
            
            explanation = classic.explanation or '无解释'
            if len(explanation) > 100:
                explanation = explanation[:100] + "..."
            print(f"解释: {explanation}")
            
            print(f"创建时间: {classic.created_at}")
            print(f"更新时间: {classic.updated_at}")
            print("-" * 50)
            
    finally:
        db.close()

if __name__ == "__main__":
    print_all_classics() 
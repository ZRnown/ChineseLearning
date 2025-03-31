from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app import models
from app.services import ai_service

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    classic_id: int
    classic_title: str

@router.post("/chat")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """AI聊天接口，返回对用户问题的回答"""
    try:
        # 获取古籍信息
        classic = db.query(models.Classic).filter(models.Classic.id == request.classic_id).first()
        if not classic:
            raise HTTPException(status_code=404, detail="Classic not found")

        # 构建系统提示词
        system_prompt = f"""你是一个专业的中国古典文学导读助手。现在正在解读《{request.classic_title}》。
        请基于以下信息回答用户的问题：
        原文：{classic.content}
        译文：{classic.translation}
        赏析：{classic.explanation}
        
        请用通俗易懂的语言回答，并保持专业性和准确性。"""

        # 调用AI服务获取回复
        response = ai_service.get_chat_response(
            message=request.message,
            system_prompt=system_prompt
        )

        return {"response": response}

    except Exception as e:
        print(f"处理聊天请求时出错: {str(e)}")
        return {"response": f"处理请求时发生错误: {str(e)}"}
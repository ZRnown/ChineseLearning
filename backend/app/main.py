from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, classics, translations, notes, chat
from .database import engine
from . import models
from .init_db import init_db
from pydantic import BaseModel

# Create database tables
models.Base.metadata.create_all(bind=engine)


# Initialize example data
init_db()

app = FastAPI(
    title="中国古典文学导读系统",
    # 恢复默认的重定向行为
    # redirect_slashes=False
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(classics.router, prefix="/api/classics", tags=["classics"])
app.include_router(translations.router, prefix="/api/translations", tags=["translations"])
app.include_router(notes.router, prefix="/api/notes", tags=["notes"])
app.include_router(chat.router, prefix="/api", tags=["chat"])

# 添加翻译路由
from .routers.translations import translate_text
app.post("/api/translate")(translate_text)

# 添加测试路由
class TestChatRequest(BaseModel):
    message: str
    classic_id: int
    classic_title: str

@app.post("/api/chat_test")
async def chat_test(request: TestChatRequest):
    """测试聊天API是否可访问"""
    return {"response": f"收到消息：{request.message}，古籍ID：{request.classic_id}，标题：{request.classic_title}"}

@app.get("/")
async def root():
    return {"message": "欢迎使用中国古典文学导读系统"}

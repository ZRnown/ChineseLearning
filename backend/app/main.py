from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, classics, translations, notes
from .database import engine
from . import models
from .init_db import init_db

# Create database tables
models.Base.metadata.create_all(bind=engine)


# Initialize example data
init_db()

app = FastAPI(
    title="中国古典文学 API",
    # 恢复默认的重定向行为
    # redirect_slashes=False
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# 注册路由
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(classics.router, prefix="/api/classics", tags=["classics"])
app.include_router(translations.router, prefix="/api/translations", tags=["translations"])
app.include_router(notes.router, prefix="/api/notes", tags=["notes"])

# 添加翻译路由
from .routers.translations import translate_text
app.post("/api/translate")(translate_text)

@app.get("/")
async def root():
    return {"message": "欢迎使用中国古典文学 API"}

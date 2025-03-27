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
    allow_origins=["*"],  # 在生产环境中应该限制为特定域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origin_regex=".*",  # 允许所有来源
)

# 注册路由
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(classics.router, prefix="/api/classics", tags=["classics"])
app.include_router(
    translations.router, prefix="/api/translations", tags=["translations"]
)
app.include_router(notes.router, prefix="/api/notes", tags=["notes"])


@app.get("/")
async def root():
    return {"message": "欢迎使用中国古典文学 API"}

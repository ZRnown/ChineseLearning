from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # 数据库配置
    DATABASE_URL: str = "sqlite:///./app.db"
    
    # OpenAI API配置
    OPENAI_API_KEY: str = ""
    
    # JWT配置
    SECRET_KEY: str = "your-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"

settings = Settings()

BAIDU_TRANSLATE_APP_ID = '20250325002314854'  # 替换成你的 appid
BAIDU_TRANSLATE_APP_KEY = 'ygHAm4i4hU4WRPXHnx5e'  # 替换成你的密钥

# 腾讯云配置（如果需要）
TENCENT_SECRET_ID = "your-secret-id"
TENCENT_SECRET_KEY = "your-secret-key"

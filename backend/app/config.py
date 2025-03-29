BAIDU_TRANSLATE_APP_ID = '20250325002314854'  # 替换成你的 appid
BAIDU_TRANSLATE_APP_KEY = 'ygHAm4i4hU4WRPXHnx5e'  # 替换成你的密钥

# 数据库配置
DATABASE_URL = "sqlite:///./app.db"

# JWT 配置
SECRET_KEY = "your-secret-key"  # 用于生成 JWT token 的密钥
ALGORITHM = "HS256"  # JWT 加密算法
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # token 过期时间（分钟）

# 腾讯云配置（如果需要）
TENCENT_SECRET_ID = "your-secret-id"
TENCENT_SECRET_KEY = "your-secret-key"

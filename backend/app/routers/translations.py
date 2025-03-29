from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from .. import models
from .auth import get_current_user_optional
from pydantic import BaseModel
from datetime import datetime
import requests
import hashlib
import random
import json
import urllib.parse
from ..config import BAIDU_TRANSLATE_APP_ID, BAIDU_TRANSLATE_APP_KEY
import httpx
import time

router = APIRouter()

# 百度翻译API支持的语言列表
SUPPORTED_LANGUAGES = {
    'zh': '中文',
    'en': '英语',
    'jp': '日语',
    'kor': '韩语',
    'fra': '法语',
    'spa': '西班牙语',
    'th': '泰语',
    'ara': '阿拉伯语',
    'ru': '俄语',
    'pt': '葡萄牙语',
    'de': '德语',
    'it': '意大利语',
    'el': '希腊语',
    'nl': '荷兰语',
    'pl': '波兰语',
    'bul': '保加利亚语',
    'est': '爱沙尼亚语',
    'dan': '丹麦语',
    'fin': '芬兰语',
    'cs': '捷克语',
    'rom': '罗马尼亚语',
    'slo': '斯洛文尼亚语',
    'swe': '瑞典语',
    'hu': '匈牙利语',
    'vie': '越南语',
    'yue': '粤语',
    'wyw': '文言文',
    'cht': '繁体中文',
    'sr': '塞尔维亚语',
    'uk': '乌克兰语',
    'hi': '印地语',
    'id': '印尼语',
    'ms': '马来语',
    'tr': '土耳其语',
    'no': '挪威语',
    'he': '希伯来语',
    'fa': '波斯语',
    'tl': '菲律宾语',
    'bn': '孟加拉语'
}

# 添加前端到百度 API 的语言代码映射
LANGUAGE_CODE_MAP = {
    'zh': 'zh',
    'en': 'en',
    'ja': 'jp',
    'ko': 'kor', 
    'fr': 'fra',
    'es': 'spa',
    'th': 'th',
    'ar': 'ara',
    'ru': 'ru',
    'de': 'de',
    'it': 'it',
    'pl': 'pl'
}

class TranslationBase(BaseModel):
    content: str
    classic_id: int
    language: str


class TranslationCreate(TranslationBase):
    pass


class Translation(TranslationBase):
    id: int
    created_at: datetime
    updated_at: datetime
    user_id: int

    class Config:
        from_attributes = True


@router.get("/", response_model=List[Translation])
def get_translations_by_classic(
    classic_id: Optional[int] = None,
    language: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """获取指定古籍的所有译文"""
    query = db.query(models.Translation)
    
    if classic_id:
        query = query.filter(models.Translation.classic_id == classic_id)
        
    if language:
        query = query.filter(models.Translation.language == language)
        
    translations = query.all()
    return translations


@router.get("/{translation_id}", response_model=Translation)
async def get_translation(
    translation_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional),
):
    translation = (
        db.query(models.Translation)
        .filter(models.Translation.id == translation_id)
        .first()
    )
    if not translation:
        raise HTTPException(status_code=404, detail="Translation not found")
    return translation


@router.post("/", response_model=Translation)
async def create_translation(
    translation: TranslationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_optional),
):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    # 检查古籍是否存在
    classic = (
        db.query(models.Classic)
        .filter(models.Classic.id == translation.classic_id)
        .first()
    )
    if not classic:
        raise HTTPException(status_code=404, detail="Classic not found")

    db_translation = models.Translation(
        **translation.dict(),
        user_id=current_user.id,
    )
    db.add(db_translation)
    db.commit()
    db.refresh(db_translation)
    return db_translation


@router.put("/{translation_id}", response_model=Translation)
async def update_translation(
    translation_id: int,
    translation: TranslationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_optional),
):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    db_translation = (
        db.query(models.Translation)
        .filter(models.Translation.id == translation_id)
        .first()
    )
    if not db_translation:
        raise HTTPException(status_code=404, detail="Translation not found")

    if db_translation.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )

    for key, value in translation.dict().items():
        setattr(db_translation, key, value)

    db.commit()
    db.refresh(db_translation)
    return db_translation


@router.delete("/{translation_id}")
async def delete_translation(
    translation_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_optional),
):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    db_translation = (
        db.query(models.Translation)
        .filter(models.Translation.id == translation_id)
        .first()
    )
    if not db_translation:
        raise HTTPException(status_code=404, detail="Translation not found")

    if db_translation.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )

    db.delete(db_translation)
    db.commit()
    return {"message": "Translation deleted successfully"}


@router.get("/languages")
def get_supported_languages():
    """获取所有支持的语言列表"""
    return SUPPORTED_LANGUAGES


class TranslationRequest(BaseModel):
    text: str
    sourceLang: str = "zh"
    targetLang: str = "en"


@router.post("/translate")
async def translate_text(request: TranslationRequest):
    try:
        print(f"翻译请求: text={request.text}, sourceLang={request.sourceLang}, targetLang={request.targetLang}")
        
        # 将前端语言代码映射到百度 API 语言代码
        source_lang = LANGUAGE_CODE_MAP.get(request.sourceLang)
        target_lang = LANGUAGE_CODE_MAP.get(request.targetLang)
        
        # 检查语言代码是否支持
        if not source_lang:
            raise HTTPException(status_code=400, detail=f"源语言 {request.sourceLang} 不支持")
        if not target_lang:
            raise HTTPException(status_code=400, detail=f"目标语言 {request.targetLang} 不支持")
            
        # 检查文本是否为空
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="翻译文本不能为空")
            
        # 准备请求参数
        salt = str(random.randint(32768, 65536))
        sign_str = BAIDU_TRANSLATE_APP_ID + request.text + salt + BAIDU_TRANSLATE_APP_KEY
        sign = hashlib.md5(sign_str.encode('utf-8')).hexdigest().lower()
        
        data = {
            'q': request.text,
            'from': source_lang,
            'to': target_lang,
            'appid': BAIDU_TRANSLATE_APP_ID,
            'salt': salt,
            'sign': sign
        }
        
        # 发送请求
        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        
        # 使用 httpx.Client 发送请求
        with httpx.Client() as client:
            response = client.post(
                'https://fanyi-api.baidu.com/api/trans/vip/translate',
                data=data,
                headers=headers,
                timeout=10.0  # 添加超时设置
            )
            
            # 检查响应
            if response.status_code != 200:
                print(f"HTTP请求失败: {response.status_code}")
                print(f"响应内容: {response.text}")
                raise HTTPException(status_code=500, detail=f"翻译服务请求失败: HTTP {response.status_code}")
                
            try:
                result = response.json()
            except json.JSONDecodeError as e:
                print(f"JSON解析失败: {str(e)}")
                print(f"响应内容: {response.text}")
                raise HTTPException(status_code=500, detail="翻译服务返回的数据格式错误")
            
            # 检查错误码
            if 'error_code' in result:
                error_code = result['error_code']
                error_msg = result.get('error_msg', '未知错误')
                print(f"翻译服务错误: {error_code} - {error_msg}")
                raise HTTPException(status_code=500, detail=f"翻译服务错误: {error_code} - {error_msg}")
                
            # 返回翻译结果
            if 'trans_result' in result and len(result['trans_result']) > 0:
                translated_text = result['trans_result'][0]['dst']
                return {"translatedText": translated_text}
            else:
                print(f"翻译结果为空: {result}")
                raise HTTPException(status_code=500, detail="翻译结果为空")
                
    except httpx.TimeoutException:
        print("请求超时")
        raise HTTPException(status_code=500, detail="翻译服务请求超时")
    except httpx.RequestError as e:
        print(f"请求错误: {str(e)}")
        raise HTTPException(status_code=500, detail=f"翻译服务请求错误: {str(e)}")
    except Exception as e:
        print(f"发生未知错误: {str(e)}")
        print(f"错误类型: {type(e)}")
        print(f"错误详情: {e.__dict__}")
        raise HTTPException(status_code=500, detail=f"翻译服务发生错误: {str(e)}")

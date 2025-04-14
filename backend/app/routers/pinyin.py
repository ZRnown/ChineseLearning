from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pypinyin import pinyin, Style

router = APIRouter()

class PinyinRequest(BaseModel):
    text: str
    style: str = "tone"  # 默认带声调

class PinyinResponse(BaseModel):
    pinyin: list
    original: str

@router.post("/convert", response_model=PinyinResponse)
async def convert_to_pinyin(request: PinyinRequest):
    """将中文文本转换为拼音"""
    try:
        style_map = {
            "tone": Style.TONE,  # 带声调
            "normal": Style.NORMAL,  # 不带声调
            "first_letter": Style.FIRST_LETTER,  # 首字母
            "initials": Style.INITIALS,  # 声母
            "finals": Style.FINALS,  # 韵母
            "finals_tone": Style.FINALS_TONE,  # 带声调的韵母
            "heteronym": Style.HETERONYM,  # 异读音
        }
        
        style_value = style_map.get(request.style, Style.TONE)
        result = pinyin(request.text, style=style_value)
        
        return {
            "pinyin": result,
            "original": request.text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"转换拼音时出错: {str(e)}")
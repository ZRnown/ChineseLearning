from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_  # 添加这一行
from typing import List, Optional
from ..database import get_db
from .. import models, schemas
from ..auth import get_current_user_optional, get_current_user
from pydantic import BaseModel
from datetime import datetime
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


class ClassicBase(BaseModel):
    title: str
    author: str
    dynasty: str
    content: str
    translation: Optional[str] = None


class ClassicCreate(ClassicBase):
    pass


class Classic(ClassicBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_favorite: bool = False
    is_liked: bool = False

    class Config:
        from_attributes = True


class TranslationBase(BaseModel):
    content: str
    language: str


class TranslationCreate(TranslationBase):
    classic_id: int


class Translation(TranslationBase):
    id: int
    classic_id: int
    created_at: str

    class Config:
        from_attributes = True


class PaginatedResponse(BaseModel):
    items: List[Classic]
    total: int
    skip: int
    limit: int


@router.get("/", response_model=PaginatedResponse)
def get_classics(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    category: Optional[str] = None,
    dynasty: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional),
):
    """获取古籍列表，支持分页和筛选"""
    try:
        logger.info(f"Fetching classics with params: skip={skip}, limit={limit}, category={category}, dynasty={dynasty}")
        
        # 构建查询
        query = db.query(models.Classic)
        
        # 应用筛选条件
        if category:
            query = query.filter(models.Classic.category == category)
        if dynasty:
            query = query.filter(models.Classic.dynasty == dynasty)
            
        # 获取总数
        total = query.count()
        
        # 应用分页
        classics = query.offset(skip).limit(limit).all()
        logger.info(f"Found {len(classics)} classics")
        
        # 返回分页响应
        return {
            "items": classics,
            "total": total,
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        logger.error(f"Error fetching classics: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/{classic_id}", response_model=schemas.Classic)
def get_classic(
    classic_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional),
):
    """获取单个古籍详情"""
    try:
        logger.info(f"Fetching classic with id={classic_id}")
        classic = (
            db.query(models.Classic).filter(models.Classic.id == classic_id).first()
        )
        if not classic:
            logger.warning(f"Classic not found with id={classic_id}")
            raise HTTPException(status_code=404, detail="Classic not found")
        return classic
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching classic: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/", response_model=schemas.Classic)
async def create_classic(
    classic: schemas.ClassicCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_optional),
):
    db_classic = models.Classic(**classic.dict())
    db.add(db_classic)
    db.commit()
    db.refresh(db_classic)
    return db_classic


@router.put("/{classic_id}", response_model=schemas.Classic)
async def update_classic(
    classic_id: int,
    classic: schemas.ClassicUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_optional),
):
    db_classic = (
        db.query(models.Classic).filter(models.Classic.id == classic_id).first()
    )
    if not db_classic:
        raise HTTPException(status_code=404, detail="Classic not found")

    for key, value in classic.dict(exclude_unset=True).items():
        setattr(db_classic, key, value)

    db.commit()
    db.refresh(db_classic)
    return db_classic


@router.delete("/{classic_id}")
async def delete_classic(
    classic_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_optional),
):
    db_classic = (
        db.query(models.Classic).filter(models.Classic.id == classic_id).first()
    )
    if not db_classic:
        raise HTTPException(status_code=404, detail="Classic not found")

    db.delete(db_classic)
    db.commit()
    return {"message": "Classic deleted successfully"}


@router.post("/{classic_id}/translations", response_model=schemas.Translation)
def create_translation(
    classic_id: int,
    translation: schemas.TranslationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """创建古籍翻译"""
    try:
        logger.info(f"Creating translation for classic_id={classic_id}")
        db_classic = (
            db.query(models.Classic).filter(models.Classic.id == classic_id).first()
        )
        if not db_classic:
            raise HTTPException(status_code=404, detail="Classic not found")

        db_translation = models.Translation(
            **translation.dict(), classic_id=classic_id, user_id=current_user.id
        )
        db.add(db_translation)
        db.commit()
        db.refresh(db_translation)
        return db_translation
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating translation: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/{classic_id}/translations", response_model=List[schemas.Translation])
def get_classic_translations(
    classic_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional),
):
    """获取古籍的翻译列表"""
    try:
        logger.info(f"Fetching translations for classic_id={classic_id}")
        translations = (
            db.query(models.Translation)
            .filter(models.Translation.classic_id == classic_id)
            .all()
        )
        logger.info(f"Found {len(translations)} translations")
        return translations
    except Exception as e:
        logger.error(f"Error fetching translations: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get(
    "/{classic_id}/translations/{translation_id}", response_model=schemas.Translation
)
def get_translation(
    classic_id: int,
    translation_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional),
):
    """获取单个翻译详情"""
    try:
        logger.info(
            f"Fetching translation with id={translation_id} for classic_id={classic_id}"
        )
        translation = (
            db.query(models.Translation)
            .filter(
                models.Translation.id == translation_id,
                models.Translation.classic_id == classic_id,
            )
            .first()
        )
        if not translation:
            logger.warning(f"Translation not found with id={translation_id}")
            raise HTTPException(status_code=404, detail="Translation not found")
        return translation
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching translation: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/{classic_id}/comments", response_model=List[schemas.Note])
@router.get("/{classic_id}/comments/", response_model=List[schemas.Note])
def get_classic_comments(classic_id: int, page: int = 1, db: Session = Depends(get_db)):
    """获取古籍的所有评论，无需登录"""
    print(f"Fetching comments for classic {classic_id}, page {page}")

    # 计算分页
    limit = 10
    skip = (page - 1) * limit

    notes = (
        db.query(models.Note)
        .filter(models.Note.classic_id == classic_id)
        .offset(skip)
        .limit(limit)
        .all()
    )

    print(f"Found {len(notes)} comments")
    return notes


# 将搜索路由移到其他路由之前，避免路径冲突
@router.get("/search")
async def search_classics(
    query: str,  # 移除Query验证器，简化参数定义
    search_type: str = "all",
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional),
):
    """搜索古籍，支持按标题、内容、作者或全部字段搜索"""
    try:
        # 记录请求参数，帮助调试
        logger.info(f"搜索请求参数: query={query}, search_type={search_type}, skip={skip}, limit={limit}")
        
        # 参数验证
        if not query:
            raise HTTPException(status_code=400, detail="搜索关键词不能为空")
        
        if isinstance(limit, str):
            try:
                limit = int(limit)
            except ValueError:
                limit = 10
                
        if isinstance(skip, str):
            try:
                skip = int(skip)
            except ValueError:
                skip = 0
        
        if limit < 1 or limit > 100:
            limit = 10
            
        if skip < 0:
            skip = 0
            
        # 构建查询
        base_query = db.query(models.Classic)
        
        # 根据搜索类型应用不同的过滤条件
        if search_type == "title":
            filter_condition = models.Classic.title.contains(query)
        elif search_type == "content":
            filter_condition = models.Classic.content.contains(query)
        elif search_type == "author":
            filter_condition = models.Classic.author.contains(query)
        else:  # "all" 或其他情况
            filter_condition = or_(
                models.Classic.title.contains(query),
                models.Classic.content.contains(query),
                models.Classic.author.contains(query)
            )
        
        search_query = base_query.filter(filter_condition)
        
        # 获取总数
        total = search_query.count()
        
        # 应用分页
        classics = search_query.offset(skip).limit(limit).all()
        logger.info(f"找到 {len(classics)} 条匹配的古籍")
        
        # 返回分页响应
        return {
            "items": classics,
            "total": total,
            "skip": skip,
            "limit": limit
        }
    except HTTPException as he:
        logger.error(f"搜索古籍HTTP异常: {str(he)}")
        raise
    except Exception as e:
        logger.error(f"搜索古籍时出错: {str(e)}")
        # 返回更详细的错误信息
        raise HTTPException(status_code=500, detail=f"搜索古籍时出错: {str(e)}")


from pydantic import BaseModel

# 添加搜索请求模型
class SearchRequest(BaseModel):
    query: str
    search_type: str = "all"

@router.post("/search", response_model=PaginatedResponse)
async def search_classics_post(
    search_req: SearchRequest,
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional),
):
    """搜索古籍，支持按标题、内容、作者或全部字段搜索（POST方法）"""
    try:
        query = search_req.query
        search_type = search_req.search_type
        
        logger.info(f"POST搜索古籍: query={query}, type={search_type}, skip={skip}, limit={limit}")
        
        # 参数验证
        if not query:
            raise HTTPException(status_code=400, detail="搜索关键词不能为空")
        
        if limit < 1 or limit > 100:
            limit = 10
            
        if skip < 0:
            skip = 0
            
        # 构建查询
        base_query = db.query(models.Classic)
        
        # 根据搜索类型应用不同的过滤条件
        if search_type == "title":
            filter_condition = models.Classic.title.contains(query)
        elif search_type == "content":
            filter_condition = models.Classic.content.contains(query)
        elif search_type == "author":
            filter_condition = models.Classic.author.contains(query)
        else:  # "all" 或其他情况
            filter_condition = or_(
                models.Classic.title.contains(query),
                models.Classic.content.contains(query),
                models.Classic.author.contains(query)
            )
        
        search_query = base_query.filter(filter_condition)
        
        # 获取总数
        total = search_query.count()
        
        # 应用分页
        classics = search_query.offset(skip).limit(limit).all()
        logger.info(f"找到 {len(classics)} 条匹配的古籍")
        
        # 返回分页响应
        return {
            "items": classics,
            "total": total,
            "skip": skip,
            "limit": limit
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"搜索古籍时出错: {str(e)}")
        raise HTTPException(status_code=500, detail=f"搜索古籍时出错: {str(e)}")

import React, { useState, useEffect } from 'react';
import { getClassics } from '../services/classics';
import { Classic } from '../types/classic';
import ClassicCard from '../components/ClassicCard';
import ClassicSearch from '../components/ClassicSearch';

const ClassicsList: React.FC = () => {
  const [classics, setClassics] = useState<Classic[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dynasty, setDynasty] = useState<string>('全部');
  const [category, setCategory] = useState<string>('全部');
  
  useEffect(() => {
    if (!isSearchMode) {
      loadClassics();
    }
  }, [dynasty, category, isSearchMode]);
  
  const handleSearchResults = (results: Classic[]) => {
    setClassics(results);
    setIsSearchMode(true);
  };
  
  const handleSearchStart = () => {
    setIsLoading(true);
  };
  
  const handleSearchEnd = () => {
    setIsLoading(false);
  };
  
  const resetSearch = () => {
    setIsSearchMode(false);
  };
  
  const loadClassics = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      
      if (dynasty !== '全部') {
        params.dynasty = dynasty;
      }
      
      if (category !== '全部') {
        params.category = category;
      }
      
      const response = await getClassics(params);
      setClassics(response.items);
    } catch (error) {
      console.error('加载古籍列表失败:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 font-serif text-[#8b4513] text-center">古籍列表</h1>
      
      <div className="mb-8">
        <ClassicSearch 
          onSearchResults={handleSearchResults} 
          onSearchStart={handleSearchStart}
          onSearchEnd={handleSearchEnd}
        />
      </div>
      
      {isSearchMode && (
        <div className="mb-4 flex justify-between items-center">
          <button 
            onClick={resetSearch}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            返回全部古籍
          </button>
        </div>
      )}
      <div className="mb-6">
        {/* 筛选器 */}
        <div className="flex flex-wrap gap-4 mb-4 justify-center">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">朝代：</span>
            <select 
              value={dynasty} 
              onChange={(e) => setDynasty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="全部">全部</option>
              <option value="唐">唐朝</option>
              <option value="宋">宋朝</option>
              <option value="元">元朝</option>
              <option value="明">明朝</option>
              <option value="清">清朝</option>
              <option value="春秋">春秋</option>
              <option value="战国">战国</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-600">分类：</span>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="全部">全部</option>
              <option value="诗">诗</option>
              <option value="词">词</option>
              <option value="文">文</option>
              <option value="经">经</option>
              <option value="史">史</option>
              <option value="道">道</option>
            </select>
          </div>
        </div>

        {/* 搜索组件 */}
        <ClassicSearch 
          onSearchResults={handleSearchResults} 
          onSearchStart={handleSearchStart}
          onSearchEnd={handleSearchEnd}
        />

        {/* 重置搜索按钮 */}
        {isSearchMode && (
          <div className="text-center">
            <button 
              onClick={resetSearch}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              返回全部古籍
            </button>
          </div>
        )}
      </div>
      
      {/* 加载状态 */}
      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-500">加载中...</p>
        </div>
      )}
      
      {/* 古籍列表 */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classics.length > 0 ? (
            classics.map((classic) => (
              <ClassicCard key={classic.id} classic={classic} />
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-500">
                {isSearchMode ? '没有找到匹配的古籍' : '暂无古籍数据'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassicsList;
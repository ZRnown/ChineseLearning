import React, { useState } from 'react';
import { searchClassics } from '../services/classics';
import { Classic } from '../types/classic';

interface ClassicSearchProps {
  onSearchResults: (results: Classic[]) => void;
  onSearchStart: () => void;
  onSearchEnd: () => void;
}

const ClassicSearch: React.FC<ClassicSearchProps> = ({ 
  onSearchResults, 
  onSearchStart, 
  onSearchEnd 
}) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'title' | 'content' | 'author' | 'all'>('all');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    try {
      setIsSearching(true);
      onSearchStart();
      
      const params = {
        query: query.trim(),
        searchType
      };
      
      const results = await searchClassics(params);
      onSearchResults(results.items || []);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setIsSearching(false);
      onSearchEnd();
    }
  };

  return (
    <form onSubmit={handleSearch} className="mb-6">
      <div className="flex items-center justify-center space-x-4 mb-4">
        <div className="relative flex-1 max-w-2xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="请输入搜索关键词..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513] bg-white"
          />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-[#8B4513] text-white rounded-md hover:bg-[#6B3410] transition-colors disabled:opacity-50"
          >
            {isSearching ? '搜索中...' : '搜索'}
          </button>
        </div>
        <div className="flex items-center">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513] bg-white"
          >
            <option value="all">全部</option>
            <option value="title">标题</option>
            <option value="content">全文</option>
            <option value="author">作者</option>
          </select>
        </div>
      </div>
    </form>
  );
};

export default ClassicSearch;
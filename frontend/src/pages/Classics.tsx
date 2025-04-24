import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getClassics, searchClassics } from '../services/classics';
import { Classic } from '../types/classic';
import Pagination from '../components/Pagination';

const Classics: React.FC = () => {
    const [classics, setClassics] = useState<Classic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedDynasty, setSelectedDynasty] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState<'title' | 'content' | 'author' | 'all'>('all');
    const [isSearchMode, setIsSearchMode] = useState(false);
    const itemsPerPage = 9;

    // 朝代选项
    const dynastyOptions = ['唐', '宋', '元', '明', '清', '春秋', '战国', '汉', '魏晋', '南北朝', '隋'];
    // 分类选项
    const categoryOptions = ['诗', '词', '文', '经', '史', '道'];

    const fetchClassics = useCallback(async (page: number) => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                skip: (page - 1) * itemsPerPage,
                limit: itemsPerPage,
                dynasty: selectedDynasty || undefined,
                category: selectedCategory || undefined
            };

            console.log('Fetching with params:', params);
            const response = await getClassics(params);
            console.log('Received response:', response);

            if (response.items) {
                setClassics(response.items);
                setTotalItems(response.total);
                setTotalPages(Math.ceil(response.total / itemsPerPage));
            } else {
                setClassics([]);
                setTotalItems(0);
                setTotalPages(1);
            }
        } catch (err) {
            console.error('Error in fetchClassics:', err);
            setError('获取古籍列表失败，请稍后重试');
            setClassics([]);
            setTotalItems(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [selectedDynasty, selectedCategory, itemsPerPage]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            setLoading(true);
            setError(null);
            setIsSearchMode(true);

            const response = await searchClassics({
                query: searchQuery.trim(),
                searchType
            });

            if (response.items) {
                setClassics(response.items);
                setTotalItems(response.items.length);
                setTotalPages(1);
                setCurrentPage(1);
            } else {
                setClassics([]);
                setTotalItems(0);
                setTotalPages(1);
            }
        } catch (err) {
            console.error('搜索失败:', err);
            setError('搜索失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    const resetSearch = () => {
        setSearchQuery('');
        setIsSearchMode(false);
        setCurrentPage(1);
    };

    // 处理筛选条件变化
    const handleDynastyChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        console.log('Dynasty changed to:', value);
        setSelectedDynasty(value);
        setCurrentPage(1);
    }, []);

    const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        console.log('Category changed to:', value);
        setSelectedCategory(value);
        setCurrentPage(1);
    }, []);

    // 初始加载和筛选条件变化时获取数据
    useEffect(() => {
        if (!isSearchMode) {
            fetchClassics(currentPage);
        }
    }, [currentPage, selectedDynasty, selectedCategory, fetchClassics, isSearchMode]);

    const handlePageChange = (page: number) => {
        console.log('Page changing to:', page);
        setCurrentPage(page);
    };

    const handleRetry = () => {
        setError(null);
        if (isSearchMode) {
            handleSearch(new Event('submit') as any);
        } else {
            fetchClassics(currentPage);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f8f5f0] dark:bg-gray-900 transition-colors duration-200">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b4513] dark:border-[#d9c9a3]"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-[#2c3e50] dark:text-gray-100 transition-colors duration-200">古籍列表</h1>

            {/* 搜索区域 */}
            <div className="mb-6">
                <form onSubmit={handleSearch} className="flex items-center justify-center space-x-4 mb-4">
                    <div className="relative flex-1 max-w-2xl">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="请输入搜索关键词..."
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513] dark:focus:ring-[#d9c9a3] bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-200"
                        />
                        <button
                            type="submit"
                            disabled={loading || !searchQuery.trim()}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-[#8B4513] dark:bg-[#d9c9a3]/80 text-white dark:text-gray-900 rounded-md hover:bg-[#6B3410] dark:hover:bg-[#d9c9a3] transition-colors duration-200 disabled:opacity-50"
                        >
                            {loading ? '搜索中...' : '搜索'}
                        </button>
                    </div>
                    <div className="flex items-center">
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value as any)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513] dark:focus:ring-[#d9c9a3] bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-200"
                        >
                            <option value="all">全部</option>
                            <option value="title">标题</option>
                            <option value="content">全文</option>
                            <option value="author">作者</option>
                        </select>
                    </div>
                </form>

                {isSearchMode && (
                    <div className="text-center">
                        <button
                            onClick={resetSearch}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                        >
                            返回全部古籍
                        </button>
                    </div>
                )}
            </div>

            {/* 筛选区域 */}
            {!isSearchMode && (
                <div className="mb-6 flex flex-wrap gap-4 justify-center">
                    <div className="flex items-center">
                        <label className="mr-2 text-gray-700 dark:text-gray-300 transition-colors duration-200">朝代：</label>
                        <select
                            value={selectedDynasty}
                            onChange={handleDynastyChange}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513] dark:focus:ring-[#d9c9a3] bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-200"
                        >
                            <option value="">全部</option>
                            {dynastyOptions.map((dynasty) => (
                                <option key={dynasty} value={dynasty}>
                                    {dynasty}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center">
                        <label className="mr-2 text-gray-700 dark:text-gray-300 transition-colors duration-200">分类：</label>
                        <select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513] dark:focus:ring-[#d9c9a3] bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-200"
                        >
                            <option value="">全部</option>
                            {categoryOptions.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {error ? (
                <div className="text-center py-4">
                    <p className="text-red-500 dark:text-red-400 mb-2 transition-colors duration-200">{error}</p>
                    <button
                        onClick={handleRetry}
                        className="px-4 py-2 bg-[#8B4513] dark:bg-[#d9c9a3]/80 text-white dark:text-gray-900 rounded-lg hover:bg-[#6B3410] dark:hover:bg-[#d9c9a3] transition-colors duration-200"
                    >
                        重试
                    </button>
                </div>
            ) : (
                <>
                    <div className="mb-4 text-right text-gray-600 dark:text-gray-400 transition-colors duration-200">
                        共 {totalItems} 条记录，当前显示第 {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} 条
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classics && classics.length > 0 ? (
                            classics.map((classic) => (
                                <Link
                                    key={classic.id}
                                    to={`/classics/${classic.id}`}
                                    className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <h2 className="text-2xl font-serif font-bold mb-2 text-black dark:text-gray-100 tracking-wide transition-colors duration-200">{classic.title}</h2>
                                    <p className="text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-200">{classic.author} · {classic.dynasty}</p>
                                    <p className="text-gray-700 dark:text-gray-300 line-clamp-3 transition-colors duration-200">{classic.content}</p>
                                    {classic.tags && classic.tags.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {classic.tags.map((tag) => (
                                                <span
                                                    key={tag.id}
                                                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                                                >
                                                    {tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-8">
                                <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">
                                    {isSearchMode ? '没有找到匹配的结果' : '暂无数据'}
                                </p>
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && !isSearchMode && (
                        <div className="mt-8">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Classics;
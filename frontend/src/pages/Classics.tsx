import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getClassics } from '../services/classics';
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

    // 处理筛选条件变化
    const handleDynastyChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        console.log('Dynasty changed to:', value);
        setSelectedDynasty(value);
        setCurrentPage(1);
        fetchClassics(1);
    }, [fetchClassics]);

    const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        console.log('Category changed to:', value);
        setSelectedCategory(value);
        setCurrentPage(1);
        fetchClassics(1);
    }, [fetchClassics]);

    // 初始加载和页码变化时获取数据
    useEffect(() => {
        fetchClassics(currentPage);
    }, [currentPage, fetchClassics]);

    const handlePageChange = (page: number) => {
        console.log('Page changing to:', page);
        setCurrentPage(page);
    };

    const handleRetry = () => {
        setError(null);
        fetchClassics(currentPage);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">古籍列表</h1>

            {/* 筛选区域 */}
            <div className="mb-6 flex flex-wrap gap-4">
                <div className="flex items-center">
                    <label className="mr-2 text-gray-700">朝代：</label>
                    <select
                        value={selectedDynasty}
                        onChange={handleDynastyChange}
                        className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    <label className="mr-2 text-gray-700">分类：</label>
                    <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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

            {error ? (
                <div className="text-center py-4">
                    <p className="text-red-500 mb-2">{error}</p>
                    <button
                        onClick={handleRetry}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        重试
                    </button>
                </div>
            ) : (
                <>
                    <div className="mb-4 text-right text-gray-600">
                        共 {totalItems} 条记录，当前显示第 {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} 条
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classics && classics.length > 0 ? (
                            classics.map((classic) => (
                                <Link
                                    key={classic.id}
                                    to={`/classics/${classic.id}`}
                                    className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <h2 className="text-xl font-semibold mb-2">{classic.title}</h2>
                                    <p className="text-gray-600 mb-2">
                                        {classic.author} · {classic.dynasty}
                                    </p>
                                    <p className="text-gray-700 line-clamp-3">{classic.content}</p>
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
                            <div className="col-span-full text-center text-gray-500 py-8">
                                暂无古籍数据
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
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
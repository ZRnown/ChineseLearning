import React, { useState, useEffect } from 'react';
import { getClassics } from '../services/classics';
import { Classic } from '../types/classic';
import LoadingSpinner from './LoadingSpinner';
import Pagination from './Pagination';

const Classics: React.FC = () => {
    const [classics, setClassics] = useState<Classic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    const fetchClassics = async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching classics...');
            const skip = (page - 1) * itemsPerPage;
            const response = await getClassics(skip, itemsPerPage);
            setClassics(response.items);
            setTotalItems(response.total);
            setTotalPages(Math.ceil(response.total / itemsPerPage));
        } catch (err) {
            console.error('Error in Classics component:', err);
            setError(err instanceof Error ? err.message : '获取古籍列表失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClassics(currentPage);
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (error) {
        return (
            <div className="text-red-500 text-center py-4">
                {error}
            </div>
        );
    }

    return (
        <div className="w-[95%] max-w-[1280px] mx-auto py-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">古籍库</h1>
            
            {/* 搜索栏 */}
            <div className="mb-6">
                {/* ... 搜索栏内容保持不变 ... */}
            </div>
            
            {/* 古籍列表 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* ... 古籍列表内容保持不变 ... */}
            </div>
            
            {/* 分页 */}
            <div className="mt-8">
                {/* ... 分页内容保持不变 ... */}
            </div>
        </div>
    );
};

export default Classics;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';

interface Classic {
    id: number;
    title: string;
    author: string;
    dynasty: string;
    content: string;
    category: string;
    created_at: string;
    is_favorite?: boolean;
    is_liked?: boolean;
    user_note?: string;
    like_count?: number;
}

const Classics: React.FC = () => {
    const [classics, setClassics] = useState<Classic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    useEffect(() => {
        fetchClassics();
    }, []);

    const fetchClassics = async (pageNum: number = 1) => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const response = await axios.get(`http://localhost:8000/api/classics/?skip=${(pageNum - 1) * 10}&limit=10`, {
                headers
            });

            const data = response.data;
            setClassics(prev => pageNum === 1 ? data : [...prev, ...data]);
            setHasMore(data.length === 10);
            setPage(pageNum);
            setLoading(false);
        } catch (err) {
            setError('获取古籍列表失败');
            setLoading(false);
            setToast({ message: '获取古籍列表失败', type: 'error' });
        }
    };

    const handleLoadMore = () => {
        if (!isLoadingMore && hasMore) {
            setIsLoadingMore(true);
            fetchClassics(page + 1);
        }
    };

    if (loading && page === 1) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={() => fetchClassics(1)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    重试
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">古籍列表</h1>
                <div className="flex space-x-4">
                    <input
                        type="text"
                        placeholder="搜索古籍..."
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classics.map((classic) => (
                    <Link
                        key={classic.id}
                        to={`/classics/${classic.id}`}
                        className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                    >
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">{classic.title}</h2>
                            <p className="text-gray-600 mb-2">
                                {classic.dynasty} · {classic.author}
                            </p>
                            <p className="text-gray-500 text-sm line-clamp-3">{classic.content}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                    {classic.like_count || 0} 赞
                                </span>
                                <span className="text-sm text-gray-500">
                                    {classic.category}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {hasMore && (
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isLoadingMore ? '加载中...' : '加载更多'}
                    </button>
                </div>
            )}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default Classics; 
import React, { useState, useEffect } from 'react';
import { getClassics } from '../services/classics';
import { Classic } from '../types/classic';
import LoadingSpinner from './LoadingSpinner';

const Classics: React.FC = () => {
    const [classics, setClassics] = useState<Classic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchClassics = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching classics...');
            const skip = (page - 1) * 10;
            const data = await getClassics(skip, 10);
            if (data.length < 10) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
            if (page === 1) {
                setClassics(data);
            } else {
                setClassics(prev => [...prev, ...data]);
            }
        } catch (err) {
            console.error('Error in Classics component:', err);
            setError(err instanceof Error ? err.message : '获取古籍列表失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClassics();
    }, [page]);

    const loadMore = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    if (error) {
        return (
            <div className="text-red-500 text-center py-4">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {classics.map((classic) => (
                <div key={classic.id} className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold">{classic.title}</h2>
                    <p className="text-gray-600">{classic.author}</p>
                    <p className="text-gray-500">{classic.dynasty}</p>
                    <p className="mt-2 text-gray-700">{classic.content}</p>
                </div>
            ))}
            {loading && (
                <div className="flex justify-center py-4">
                    <LoadingSpinner />
                </div>
            )}
            {!loading && hasMore && (
                <button
                    onClick={loadMore}
                    className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    加载更多
                </button>
            )}
        </div>
    );
};

export default Classics; 
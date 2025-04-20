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
            const response = await getClassics({ skip, limit: itemsPerPage });
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
        <div className="space-y-4">
            <div className="mb-4 text-right text-gray-600">
                共 {totalItems} 条记录，当前显示第 {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} 条
            </div>

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

            {totalPages > 1 && (
                <div className="mt-8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default Classics;
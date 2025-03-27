import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getClassic } from '../services/classics';
import { Classic } from '../types/classic';
import CommentSection from '../components/CommentSection';
import Translations from '../components/Translations';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';

const ClassicDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [classic, setClassic] = useState<Classic | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    useEffect(() => {
        const fetchClassic = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);
                console.log('Fetching classic with id:', id);
                const data = await getClassic(parseInt(id));
                console.log('Fetched classic:', data);
                setClassic(data);
            } catch (err) {
                console.error('Error fetching classic:', err);
                setError('获取古籍详情失败，请稍后重试');
            } finally {
                setLoading(false);
            }
        };

        fetchClassic();
    }, [id]);

    if (loading) {
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
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    重试
                </button>
            </div>
        );
    }

    if (!classic) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">未找到古籍</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold mb-4">{classic.title}</h1>
                <div className="text-gray-600 mb-4">
                    <span className="mr-4">{classic.dynasty}</span>
                    <span>{classic.author}</span>
                </div>
                <div className="prose max-w-none mb-8">
                    <p className="text-gray-700 whitespace-pre-wrap">{classic.content}</p>
                </div>

                <div className="border-t pt-8">
                    <h2 className="text-2xl font-semibold mb-4">翻译</h2>
                    <Translations classicId={classic.id} />
                </div>

                <div className="border-t pt-8 mt-8">
                    <h2 className="text-2xl font-semibold mb-4">评论</h2>
                    <CommentSection classicId={classic.id} />
                </div>
            </div>

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

export default ClassicDetail; 
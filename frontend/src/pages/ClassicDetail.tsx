import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import CommentSection from '../components/CommentSection';

interface Classic {
    id: number;
    title: string;
    author: string;
    dynasty: string;
    content: string;
    translation: string;
    notes: string;
    created_at: string;
    updated_at: string;
}

const ClassicDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [classic, setClassic] = useState<Classic | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [activeTab, setActiveTab] = useState<'content' | 'translation' | 'notes'>('content');

    useEffect(() => {
        fetchClassicDetail();
    }, [id]);

    const fetchClassicDetail = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/classics/${id}/`);
            setClassic(response.data);
            setLoading(false);
        } catch (err) {
            setError('获取古籍详情失败');
            setLoading(false);
            setToast({ message: '获取古籍详情失败', type: 'error' });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    if (error || !classic) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-600 mb-4">{error || '古籍不存在'}</p>
                <button
                    onClick={fetchClassicDetail}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    重试
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900">{classic.title}</h1>
                    <p className="mt-2 text-gray-600">
                        {classic.dynasty} · {classic.author}
                    </p>
                </div>

                <div className="px-6 py-4">
                    <div className="flex space-x-4 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('content')}
                            className={`px-4 py-2 text-sm font-medium ${activeTab === 'content'
                                    ? 'text-green-600 border-b-2 border-green-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            原文
                        </button>
                        <button
                            onClick={() => setActiveTab('translation')}
                            className={`px-4 py-2 text-sm font-medium ${activeTab === 'translation'
                                    ? 'text-green-600 border-b-2 border-green-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            译文
                        </button>
                        <button
                            onClick={() => setActiveTab('notes')}
                            className={`px-4 py-2 text-sm font-medium ${activeTab === 'notes'
                                    ? 'text-green-600 border-b-2 border-green-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            注释
                        </button>
                    </div>

                    <div className="mt-6">
                        {activeTab === 'content' && (
                            <div className="prose max-w-none">
                                <p className="whitespace-pre-wrap">{classic.content}</p>
                            </div>
                        )}
                        {activeTab === 'translation' && (
                            <div className="prose max-w-none">
                                <p className="whitespace-pre-wrap">{classic.translation}</p>
                            </div>
                        )}
                        {activeTab === 'notes' && (
                            <div className="prose max-w-none">
                                <p className="whitespace-pre-wrap">{classic.notes}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">评论区</h2>
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
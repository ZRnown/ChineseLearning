import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/axios';
import { Comment } from '../types/comment';
import LoadingSpinner from './LoadingSpinner';
import Toast from './Toast';

interface CommentSectionProps {
    classicId: string;
}

interface CommentResponse {
    comments: Comment[];
    totalPages: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ classicId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const fetchComments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get<CommentResponse>(`/classics/${classicId}/comments`, {
                params: { page }
            });
            setComments(prev => page === 1 ? response.data.comments : [...prev, ...response.data.comments]);
            setHasMore(page < response.data.totalPages);
        } catch (error) {
            console.error('Error fetching comments:', error);
            setError('评论加载失败，请稍后重试');
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [classicId, page]);

    const handleLoadMore = () => {
        if (!isLoadingMore && hasMore) {
            setIsLoadingMore(true);
            setPage(prev => prev + 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        try {
            const response = await api.post<Comment>(`/classics/${classicId}/comments`, {
                content: newComment
            });
            setComments(prev => [response.data, ...prev]);
            setNewComment('');
            showToast('评论发表成功', 'success');
        } catch (error) {
            console.error('Error creating comment:', error);
            setError('发表评论失败');
            showToast('评论发表失败', 'error');
        }
    };

    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type });
    };

    if (loading) {
        return <div className="text-center py-4"><LoadingSpinner size="medium" /> 加载评论中...</div>;
    }

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">评论</h3>

            {error && (
                <div className="text-red-500 mb-4">{error}</div>
            )}

            {user ? (
                <form onSubmit={handleSubmit} className="mb-6">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="写下你的评论..."
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows={3}
                    />
                    <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                    >
                        发表评论
                    </button>
                </form>
            ) : (
                <p className="text-gray-500 mb-4">请登录后发表评论</p>
            )}

            <div className="space-y-4">
                {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="bg-white p-4 rounded-lg shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-medium">{comment.user_name}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(comment.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <p className="mt-2 text-gray-700">{comment.content}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">暂无评论</p>
                )}
            </div>

            {hasMore && (
                <div className="mt-4 text-center">
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="px-4 py-2 text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                    >
                        {isLoadingMore ? <LoadingSpinner size="small" /> : '加载更多'}
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

export default CommentSection;
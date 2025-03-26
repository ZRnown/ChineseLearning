import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import InfiniteScroll from './InfiniteScroll';
import LoadingSpinner from './LoadingSpinner';
import Toast from './Toast';
import { validateForm } from '../utils/validation';

interface Comment {
    id: number;
    user: {
        id: number;
        username: string;
    };
    content: string;
    created_at: string;
    updated_at: string;
}

interface CommentSectionProps {
    classicId: number;
}

const COMMENT_RULES = {
    content: {
        required: true,
        minLength: 1,
        maxLength: 1000,
        message: '评论内容不能为空',
    },
};

export default function CommentSection({ classicId }: CommentSectionProps) {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string | null }>({});

    useEffect(() => {
        fetchComments();
    }, [classicId]);

    const fetchComments = async (pageNum: number = 1) => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/classics/${classicId}/comments/?page=${pageNum}`,
                {
                    credentials: 'include',
                }
            );
            if (!response.ok) {
                throw new Error('获取评论失败');
            }
            const data = await response.json();
            const { results, next } = data;
            setComments(prev => pageNum === 1 ? results : [...prev, ...results]);
            setHasMore(!!next);
            setPage(pageNum);
        } catch (err) {
            setError(err instanceof Error ? err.message : '获取评论失败');
            showToast('获取评论失败', 'error');
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        if (!isLoadingMore && hasMore) {
            setIsLoadingMore(true);
            fetchComments(page + 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors = validateForm({ content: newComment }, COMMENT_RULES);
        setFormErrors(errors);

        if (Object.values(errors).some(error => error !== null)) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/api/classics/${classicId}/comments/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ content: newComment }),
                    credentials: 'include',
                }
            );
            if (!response.ok) {
                throw new Error('发表评论失败');
            }
            const data = await response.json();
            setComments([data, ...comments]);
            setNewComment('');
            showToast('评论发表成功', 'success');
        } catch (err) {
            showToast('评论发表失败', 'error');
        }
    };

    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type });
    };

    if (loading && page === 1) {
        return (
            <div className="flex justify-center py-4">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-600 text-center py-4">
                <p>{error}</p>
                <button
                    onClick={() => fetchComments()}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    重试
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
                评论 ({comments.length})
            </h3>
            {user && (
                <form onSubmit={handleSubmit} className="space-y-2">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="写下你的评论..."
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${formErrors.content ? 'border-red-500' : 'border-gray-300'
                            }`}
                        rows={3}
                    />
                    {formErrors.content && (
                        <p className="text-sm text-red-500">{formErrors.content}</p>
                    )}
                    <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                        发表评论
                    </button>
                </form>
            )}
            <InfiniteScroll
                items={comments}
                hasMore={hasMore}
                isLoading={isLoadingMore}
                onLoadMore={handleLoadMore}
                renderItem={(comment: Comment) => (
                    <div
                        key={comment.id}
                        className="bg-white rounded-lg shadow-sm p-4 mb-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">
                                {comment.user.username}
                            </span>
                            <span className="text-sm text-gray-500">
                                {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                    </div>
                )}
            />
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
} 
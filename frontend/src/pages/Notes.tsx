import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { useAuth } from '../contexts/AuthContext';

interface Note {
    id: number;
    title: string;
    content: string;
    classic_id: number;
    classic_title: string;
    created_at: string;
    updated_at: string;
}

const Notes: React.FC = () => {
    const { user } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newNote, setNewNote] = useState({
        title: '',
        content: '',
        classic_id: '',
    });

    useEffect(() => {
        if (user) {
            fetchNotes();
        }
    }, [user]);

    const fetchNotes = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/notes/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setNotes(response.data);
            setLoading(false);
        } catch (err) {
            setError('获取笔记列表失败');
            setLoading(false);
            setToast({ message: '获取笔记列表失败', type: 'error' });
        }
    };

    const handleCreateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.title.trim() || !newNote.content.trim() || !newNote.classic_id) {
            setToast({ message: '请填写完整信息', type: 'error' });
            return;
        }

        try {
            await axios.post(
                'http://localhost:8000/api/notes/',
                {
                    title: newNote.title,
                    content: newNote.content,
                    classic_id: parseInt(newNote.classic_id),
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setToast({ message: '创建笔记成功', type: 'success' });
            setShowCreateForm(false);
            setNewNote({ title: '', content: '', classic_id: '' });
            fetchNotes();
        } catch (err) {
            setToast({ message: '创建笔记失败', type: 'error' });
        }
    };

    const handleDeleteNote = async (noteId: number) => {
        if (!window.confirm('确定要删除这条笔记吗？')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:8000/api/notes/${noteId}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setToast({ message: '删除笔记成功', type: 'success' });
            fetchNotes();
        } catch (err) {
            setToast({ message: '删除笔记失败', type: 'error' });
        }
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-gray-600 mb-4">请先登录后再查看笔记</p>
                <a
                    href="/login"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    去登录
                </a>
            </div>
        );
    }

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
                    onClick={fetchNotes}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    重试
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">我的笔记</h1>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    新建笔记
                </button>
            </div>

            {showCreateForm && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">新建笔记</h2>
                    <form onSubmit={handleCreateNote}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                标题
                            </label>
                            <input
                                type="text"
                                value={newNote.title}
                                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="请输入笔记标题"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                关联古籍
                            </label>
                            <select
                                value={newNote.classic_id}
                                onChange={(e) => setNewNote({ ...newNote, classic_id: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">请选择关联的古籍</option>
                                {notes.map((note) => (
                                    <option key={note.classic_id} value={note.classic_id}>
                                        {note.classic_title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                内容
                            </label>
                            <textarea
                                value={newNote.content}
                                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                placeholder="请输入笔记内容"
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                            >
                                取消
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                            >
                                保存
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-6">
                {notes.map((note) => (
                    <div key={note.id} className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    {note.title}
                                </h2>
                                <p className="text-sm text-gray-600 mb-4">
                                    关联古籍：{note.classic_title}
                                </p>
                                <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                            </div>
                            <button
                                onClick={() => handleDeleteNote(note.id)}
                                className="text-red-600 hover:text-red-800"
                            >
                                删除
                            </button>
                        </div>
                    </div>
                ))}
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

export default Notes; 
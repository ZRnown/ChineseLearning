import React, { useState } from 'react';

interface NoteEditorProps {
    initialContent?: string;
    onSave: (content: string) => Promise<void>;
    onCancel: () => void;
}

export default function NoteEditor({
    initialContent = '',
    onSave,
    onCancel,
}: NoteEditorProps) {
    const [content, setContent] = useState(initialContent);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await onSave(content);
        } catch (err) {
            setError(err instanceof Error ? err.message : '保存笔记失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="rounded-md bg-red-50 p-3">
                    <div className="text-sm text-red-700">{error}</div>
                </div>
            )}
            <div>
                <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700"
                >
                    笔记内容
                </label>
                <textarea
                    id="content"
                    name="content"
                    rows={6}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="写下你的笔记..."
                />
            </div>
            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    取消
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                        '保存'
                    )}
                </button>
            </div>
        </form>
    );
} 
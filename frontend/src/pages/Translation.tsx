import React, { useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { translateText } from '../api/translate';

const Translation: React.FC = () => {
    const [sourceText, setSourceText] = useState('');
    const [targetText, setTargetText] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [sourceLang, setSourceLang] = useState('zh');
    const [targetLang, setTargetLang] = useState('en');

    const handleTranslate = async () => {
        if (!sourceText.trim()) {
            setToast({ message: '请输入要翻译的文本', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            const translatedText = await translateText(sourceText, targetLang);
            setTargetText(translatedText);
            setToast({ message: '翻译成功', type: 'success' });
        } catch (err) {
            setToast({ message: '翻译失败，请稍后重试', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setSourceText('');
        setTargetText('');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900">文本翻译</h1>
                    <p className="mt-2 text-gray-600">
                        支持中文与英文之间的互译
                    </p>
                </div>

                <div className="px-6 py-4">
                    <div className="flex space-x-4 mb-4">
                        <select
                            value={sourceLang}
                            onChange={(e) => setSourceLang(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="zh">中文</option>
                            <option value="en">英文</option>
                        </select>
                        <button
                            onClick={() => {
                                const temp = sourceLang;
                                setSourceLang(targetLang);
                                setTargetLang(temp);
                                setSourceText(targetText);
                                setTargetText(sourceText);
                            }}
                            className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-500"
                        >
                            交换语言
                        </button>
                        <select
                            value={targetLang}
                            onChange={(e) => setTargetLang(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="en">英文</option>
                            <option value="zh">中文</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <textarea
                                value={sourceText}
                                onChange={(e) => setSourceText(e.target.value)}
                                placeholder="请输入要翻译的文本..."
                                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                            />
                        </div>
                        <div>
                            <textarea
                                value={targetText}
                                readOnly
                                placeholder="翻译结果..."
                                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 resize-none"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end space-x-4">
                        <button
                            onClick={handleClear}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                            清空
                        </button>
                        <button
                            onClick={handleTranslate}
                            disabled={loading || !sourceText.trim()}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <LoadingSpinner size="small" />
                                    <span className="ml-2">翻译中...</span>
                                </div>
                            ) : (
                                '翻译'
                            )}
                        </button>
                    </div>
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

export default Translation; 
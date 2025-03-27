import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTranslations, createTranslation } from '../services/translations';
import LoadingSpinner from './LoadingSpinner';
import { Translation } from '../types/translation';

interface TranslationsProps {
  classicId: number;
  originalContent: string;
}

const Translations: React.FC<TranslationsProps> = ({ classicId, originalContent }) => {
  const { user } = useAuth();
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTranslation, setNewTranslation] = useState({
    content: '',
    language: 'en'
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      if (!classicId) {
        setError('无效的古籍ID');
        setLoading(false);
        return;
      }

      try {
        const data = await getTranslations(classicId);
        setTranslations(data);
      } catch (err) {
        console.error('获取翻译失败:', err);
        setError('获取翻译失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchTranslations();
  }, [classicId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('请先登录');
      return;
    }

    if (!newTranslation.content.trim()) {
      setError('请输入翻译内容');
      return;
    }

    try {
      const createdTranslation = await createTranslation(
        classicId,
        newTranslation.content,
        newTranslation.language
      );
      setTranslations([...translations, createdTranslation]);
      setNewTranslation({ content: '', language: 'en' });
      setError(null);
    } catch (err) {
      console.error('创建翻译失败:', err);
      setError('创建翻译失败，请稍后重试');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* 原文内容 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">原文</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{originalContent}</p>
      </div>

      {/* 翻译表单 */}
      {user && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">添加翻译</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                目标语言
              </label>
              <select
                value={newTranslation.language}
                onChange={(e) => setNewTranslation({ ...newTranslation, language: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="en">英语</option>
                <option value="ja">日语</option>
                <option value="ko">韩语</option>
                <option value="fr">法语</option>
                <option value="de">德语</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                翻译内容
              </label>
              <textarea
                value={newTranslation.content}
                onChange={(e) => setNewTranslation({ ...newTranslation, content: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={6}
                placeholder="请输入翻译内容..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              提交翻译
            </button>
          </form>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* 翻译列表 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">已有翻译</h3>
        {translations.length === 0 ? (
          <p className="text-gray-500">暂无翻译</p>
        ) : (
          <div className="space-y-4">
            {translations.map((translation) => (
              <div key={translation.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mb-2">
                      {translation.language === 'en' ? '英语' :
                        translation.language === 'ja' ? '日语' :
                          translation.language === 'ko' ? '韩语' :
                            translation.language === 'fr' ? '法语' :
                              translation.language === 'de' ? '德语' : translation.language}
                    </span>
                    <p className="text-gray-700 whitespace-pre-wrap">{translation.content}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(translation.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Translations; 
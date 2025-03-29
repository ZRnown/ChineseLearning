import React, { useState } from 'react';
import api from '../utils/axios';
import LoadingSpinner from './LoadingSpinner';
import { languages } from '../config/languages';

interface TranslationsProps {
  classicId: number;
  originalContent: string;
  onLanguageChange?: (language: string) => void;
  selectedLanguage?: string; // 新增属性，用于接收选定的语言
}

const Translations: React.FC<TranslationsProps> = ({ classicId, originalContent, onLanguageChange, selectedLanguage }) => {
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Sending translation request:', {
        text: originalContent,
        sourceLang: 'zh',
        targetLang: targetLanguage
      });
      const response = await api.post<{ translatedText: string }>('/translate', {
        text: originalContent,
        sourceLang: 'zh',
        targetLang: targetLanguage
      });
      console.log('Translation response:', response.data);
      if (response.data && response.data.translatedText) {
        setTranslatedText(response.data.translatedText);
      } else {
        setError('翻译结果为空');
      }
    } catch (err) {
      console.error('Translation error:', err);
      setError(err instanceof Error ? err.message : '翻译失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setTargetLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="mb-4">
        <label htmlFor="target-language" className="block text-sm font-medium text-gray-700">
          选择目标语言
        </label>
        <select
          id="target-language"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={targetLanguage}
          onChange={handleLanguageChange}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleTranslate}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? <LoadingSpinner size="small" color="white" /> : '翻译'}
      </button>

      {error && (
        <div className="mt-4 text-red-600">
          {error}
        </div>
      )}

      {translatedText && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900">翻译结果</h3>
          <div className="mt-2 p-4 bg-gray-50 rounded-md">
            {translatedText}
          </div>
        </div>
      )}
    </div>
  );
};

export default Translations;
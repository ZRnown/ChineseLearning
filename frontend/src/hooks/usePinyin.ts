import { useState } from 'react';
import axios from 'axios';

interface PinyinResult {
  pinyin: string[][];
  original: string;
}

export const usePinyin = () => {
  const [pinyinResult, setPinyinResult] = useState<PinyinResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const convertToPinyin = async (text: string, style: string = 'tone') => {
    if (!text.trim()) {
      setError('文本不能为空');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/pinyin/convert`;
      const response = await axios.post(apiUrl, {
        text,
        style
      });

      setPinyinResult(response.data);
    } catch (err) {
      console.error('获取拼音失败:', err);
      setError(err instanceof Error ? err.message : '获取拼音失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return { pinyinResult, loading, error, convertToPinyin };
};
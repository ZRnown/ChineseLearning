import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Translations = () => {
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/translations');
        setTranslations(response.data);
        setLoading(false);
      } catch (err) {
        setError('获取翻译数据失败');
        setLoading(false);
        console.error('获取翻译数据出错:', err);
      }
    };

    fetchTranslations();
  }, []);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div className="translations-container">
      <h1>翻译列表</h1>
      {translations.length === 0 ? (
        <p>没有可用的翻译</p>
      ) : (
        <ul className="translations-list">
          {translations.map((translation, index) => (
            <li key={index} className="translation-item">
              {/* 根据您的数据结构调整以下内容 */}
              <h3>{translation.title || '无标题'}</h3>
              <p>{translation.content || '无内容'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Translations; 
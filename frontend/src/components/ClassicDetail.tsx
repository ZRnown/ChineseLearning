import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/axios';
import '../styles/ClassicDetail.css';
import Translations from './Translations';

interface Classic {
  id: number;
  title: string;
  author: string;
  dynasty: string;
  content: string;
  translation?: string;
}

interface Comment {
  id: number;
  content: string;
  user_id: number;
  classic_id: number;
  created_at: string;
}

interface Translation {
  id: number;
  content: string;
  language: string;
  classic_id: number;
  created_at: string;
}

const ClassicDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [classic, setClassic] = useState<Classic | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [activeTab, setActiveTab] = useState<'original' | 'translation' | 'notes'>('original');
  const [selectedTranslation, setSelectedTranslation] = useState<Translation | null>(null);

  const fetchClassicDetail = async (classicId: string) => {
    try {
      const response = await api.get(`/classics/${classicId}`);
      setClassic(response.data);
    } catch (error) {
      console.error('Error fetching classic:', error);
      setError('Failed to load classic details');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (classicId: string) => {
    try {
      const response = await fetch(`/api/notes?classic_id=${classicId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments');
    }
  };

  const fetchTranslations = async (classicId: string) => {
    try {
      const response = await api.get(`/translations?classic_id=${classicId}`);
      setTranslations(response.data);
      if (response.data.length > 0) {
        setSelectedTranslation(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching translations:', error);
      setError('Failed to load translations');
    }
  };

  useEffect(() => {
    if (id) {
      fetchClassicDetail(id);
      fetchComments(id);
      fetchTranslations(id);
    }
  }, [id]);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!classic) {
    return <div>未找到古籍</div>;
  }

  return (
    <div className="classic-detail">
      <h1>{classic.title}</h1>
      <div className="classic-info">
        <p>作者: {classic.author}</p>
        <p>朝代: {classic.dynasty}</p>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'original' ? 'active' : ''}`}
          onClick={() => setActiveTab('original')}
        >
          原文
        </button>
        <button
          className={`tab ${activeTab === 'translation' ? 'active' : ''}`}
          onClick={() => setActiveTab('translation')}
        >
          译文
        </button>
        <button
          className={`tab ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          注释
        </button>
      </div>

      {activeTab === 'original' && (
        <div className="classic-content">
          <div className="content-text">{classic.content}</div>
        </div>
      )}

      {activeTab === 'translation' && (
        <div className="classic-translation">
          {translations.length > 0 ? (
            <>
              <div className="translation-selector">
                <select
                  value={selectedTranslation?.id || ''}
                  onChange={(e) => {
                    const selected = translations.find(t => t.id === parseInt(e.target.value));
                    if (selected) setSelectedTranslation(selected);
                  }}
                >
                  {translations.map(translation => (
                    <option key={translation.id} value={translation.id}>
                      {translation.language === 'zh' ? '中文' :
                        translation.language === 'en' ? '英文' :
                          translation.language === 'ja' ? '日文' :
                            translation.language === 'ko' ? '韩文' :
                              translation.language}
                    </option>
                  ))}
                </select>
              </div>
              <div className="translation-text">
                {selectedTranslation?.content || ''}
              </div>
            </>
          ) : classic.translation ? (
            <div className="translation-text">{classic.translation}</div>
          ) : (
            <p>暂无译文</p>
          )}
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="comments-section">
          {comments.length > 0 ? (
            <ul className="comments-list">
              {comments.map(comment => (
                <li key={comment.id} className="comment-item">
                  <div className="comment-content">{comment.content}</div>
                  <div className="comment-meta">
                    <span>用户ID: {comment.user_id}</span>
                    <span>发布时间: {new Date(comment.created_at).toLocaleString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>暂无注释</p>
          )}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">翻译</h2>
        <Translations classicId={classic.id} originalContent={classic.content} />
      </div>
    </div>
  );
};

export default ClassicDetail;
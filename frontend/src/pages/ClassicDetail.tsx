import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/axios';
import '../styles/ClassicDetail.css';
import Translations from '../components/Translations';
import AIDuide from '../components/AIDuide'; // 导入 AIDuide 组件
import LoadingSpinner from '../components/LoadingSpinner'; // 确保路径正确
import CommentSection from '../components/CommentSection'; // 确保路径正确

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
  const [selectedLanguage, setSelectedLanguage] = useState<string>('zh'); // 添加语言选择状态

  const fetchClassicDetail = async (classicId: string) => {
    try {
      const response = await api.get(`/classics/${classicId}`);
      setClassic(response.data as Classic);
    } catch (error) {
      console.error('Error fetching classic:', error);
      setError('Failed to load classic details');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (classicId: string) => {
    try {
      const response = await api.get(`/classics/${classicId}/comments`);
      setComments(response.data as Comment[]);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments');
    }
  };

  const fetchTranslations = async (classicId: string) => {
    try {
      const response = await api.get(`/translations?classic_id=${classicId}`);
      const translationsData = response.data as Translation[];
      setTranslations(translationsData);
      if (translationsData.length > 0) {
        setSelectedTranslation(translationsData[0]);
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
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          重试
        </button>
      </div>
    );
  }

  if (!classic) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">未找到古籍</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{classic.title}</h1>
        <div className="text-gray-600 mb-4">
          <span className="mr-4">{classic.dynasty}</span>
          <span>{classic.author}</span>
        </div>
        <div className="prose max-w-none mb-8">
          <p className="text-gray-700 whitespace-pre-wrap">{classic.content}</p>
        </div>

        <div className="border-t pt-8">
          <h2 className="text-2xl font-semibold mb-4">翻译</h2>
          <Translations 
            classicId={classic.id} 
            originalContent={classic.content}
            onLanguageChange={(lang) => setSelectedLanguage(lang)} // 添加语言变化回调
          />
        </div>

        <div className="border-t pt-8 mt-8">
          <h2 className="text-2xl font-semibold mb-4">AI 导读</h2>
          <AIDuide text={classic.content} language={selectedLanguage} />
        </div>

        <div className="border-t pt-8 mt-8">
          <h2 className="text-2xl font-semibold mb-4">评论</h2>
          <CommentSection classicId={classic.id} />
        </div>
      </div>
    </div>
  );
};

export default ClassicDetail;
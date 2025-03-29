import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getClassicById } from '../services/classics';
import { Classic } from '../types/classic';
import LoadingSpinner from '../components/LoadingSpinner';
import { BiTime, BiBook, BiHeart, BiGlobe, BiChat } from 'react-icons/bi';
import '../styles/ClassicDetail.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Comment {
  id: string;
  username: string;
  content: string;
  createdAt: string;
}

// 使用更全面的语言列表，按重要性和使用频率排序
const languages = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ru', name: 'Русский' },
  { code: 'ar', name: 'العربية' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'pt', name: 'Português' },
  { code: 'it', name: 'Italiano' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'pl', name: 'Polski' },
  { code: 'sv', name: 'Svenska' },
  { code: 'da', name: 'Dansk' },
  { code: 'fi', name: 'Suomi' },
  { code: 'no', name: 'Norsk' },
  { code: 'el', name: 'Ελληνικά' },
  { code: 'cs', name: 'Čeština' },
  { code: 'ro', name: 'Română' },
  { code: 'hu', name: 'Magyar' },
  { code: 'th', name: 'ไทย' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'uk', name: 'Українська' },
  { code: 'sr', name: 'Српски' },
  { code: 'bg', name: 'Български' },
  { code: 'sk', name: 'Slovenčina' },
  { code: 'hr', name: 'Hrvatski' },
  { code: 'sl', name: 'Slovenščina' },
  { code: 'et', name: 'Eesti' },
  { code: 'lv', name: 'Latviešu' },
  { code: 'lt', name: 'Lietuvių' },
  { code: 'iw', name: 'עברית' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'sw', name: 'Kiswahili' }
];

const ClassicDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [classic, setClassic] = useState<Classic | null>(null);
  const [translatedText, setTranslatedText] = useState('');
  const [aiGuide, setAiGuide] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('zh');
  const [showTranslation, setShowTranslation] = useState(false);
  const [showAiGuide, setShowAiGuide] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isGeneratingGuide, setIsGeneratingGuide] = useState(false);

  useEffect(() => {
    const fetchClassic = async () => {
      try {
        setLoading(true);
        const data = await getClassicById(id!);
        setClassic(data);
      } catch (err) {
        console.error('Error fetching classic:', err);
        setError('获取古籍详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClassic();
    }
  }, [id]);

  const handleTranslate = async () => {
    try {
      setIsTranslating(true);
      setTranslatedText('');
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDkCLl2WmZZtWKumwMOSq_79XK42qOiCUM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `请将以下古文翻译成${languages.find(lang => lang.code === selectedLanguage)?.name}，保持原文的文学性和意境：

${classic?.content}

要求：
1. 翻译要准确传达原文的意思
2. 保持原文的文学性和意境
3. 使用目标语言的自然表达方式
4. 不要添加任何解释或注释`
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        setTranslatedText(data.candidates[0].content.parts[0].text);
        setShowTranslation(true);
      } else {
        throw new Error('API响应格式不正确');
      }
    } catch (err) {
      console.error('Translation error:', err);
      setError('翻译失败，请稍后重试');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleGenerateAiGuide = async () => {
    try {
      setIsGeneratingGuide(true);
      setAiGuide('');
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDkCLl2WmZZtWKumwMOSq_79XK42qOiCUM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `请为以下古文生成导读，使用${languages.find(lang => lang.code === selectedLanguage)?.name}：

${classic?.content}

要求：
1. 分析文章的主要内容和思想
2. 解释重要的字词和典故
3. 探讨文章的历史背景和现实意义
4. 使用目标语言的自然表达方式
5. 保持专业性和学术性`
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        setAiGuide(data.candidates[0].content.parts[0].text);
        setShowAiGuide(true);
      } else {
        throw new Error('API响应格式不正确');
      }
    } catch (err) {
      console.error('AI Guide generation error:', err);
      setError('AI导读生成失败，请稍后重试');
    } finally {
      setIsGeneratingGuide(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      username: '当前用户',
      content: newComment,
      createdAt: new Date().toISOString()
    };
    setComments([...comments, comment]);
    setNewComment('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !classic) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 mb-4">{error || '古籍不存在'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 古籍基本信息 */}
      <div className="bg-white rounded-lg shadow-lg p-8 border border-[#e8e4e0]">
        <h1 className="text-3xl font-bold text-[#2c3e50] font-serif mb-4">{classic.title}</h1>
        <div className="text-[#666] mb-6">
          <span className="mr-4">作者：{classic.author}</span>
          <span className="mr-4">朝代：{classic.dynasty}</span>
          <span>分类：{classic.category}</span>
        </div>
        <div className="prose max-w-none dark:prose-invert prose-headings:font-serif prose-headings:text-[#2c3e50] prose-p:text-[#444]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{classic.content}</ReactMarkdown>
        </div>
      </div>

      {/* 语言选择和功能按钮 */}
      <div className="bg-white rounded-lg shadow-lg p-8 border border-[#e8e4e0]">
        <div className="mb-6">
          <label className="block text-[#2c3e50] font-medium mb-2">选择翻译语言</label>
          <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`p-2 rounded-lg text-center transition-all duration-300 text-sm ${selectedLanguage === lang.code
                  ? 'bg-[#8b4513] text-white shadow-md'
                  : 'bg-[#f8f5f0] text-[#2c3e50] hover:bg-[#e8e4e0] border border-[#e8e4e0]'
                  }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleTranslate}
            disabled={isTranslating}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${isTranslating
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-[#8b4513] hover:bg-[#6b3410] text-white'
              }`}
          >
            <BiGlobe className="mr-2" />
            {isTranslating ? '翻译中...' : '翻译'}
          </button>
          <button
            onClick={handleGenerateAiGuide}
            disabled={isGeneratingGuide}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${isGeneratingGuide
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-[#8b4513] hover:bg-[#6b3410] text-white'
              }`}
          >
            <BiBook className="mr-2" />
            {isGeneratingGuide ? '生成中...' : 'AI导读'}
          </button>
        </div>
      </div>

      {/* 翻译结果 */}
      <div className="bg-white rounded-lg shadow-lg p-8 border border-[#e8e4e0]">
        <h2 className="text-2xl font-bold text-[#2c3e50] font-serif mb-6">翻译结果</h2>
        <div className="prose max-w-none dark:prose-invert prose-headings:font-serif prose-headings:text-[#2c3e50] prose-p:text-[#444]">
          {isTranslating ? (
            <div className="text-center py-12">
              <div className="text-[#666] text-lg mb-2">正在翻译中...</div>
              <div className="text-[#999] text-sm">静候佳音，让文字跨越语言的界限</div>
            </div>
          ) : !translatedText ? (
            <div className="text-center py-12">
              <div className="text-[#666] text-lg mb-2">选择语言并点击翻译按钮</div>
              <div className="text-[#999] text-sm">让文字跨越语言的界限</div>
            </div>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{translatedText}</ReactMarkdown>
          )}
        </div>
      </div>

      {/* AI导读 */}
      <div className="bg-white rounded-lg shadow-lg p-8 border border-[#e8e4e0]">
        <h2 className="text-2xl font-bold text-[#2c3e50] font-serif mb-6">AI导读</h2>
        <div className="prose max-w-none dark:prose-invert prose-headings:font-serif prose-headings:text-[#2c3e50] prose-p:text-[#444]">
          {isGeneratingGuide ? (
            <div className="text-center py-12">
              <div className="text-[#666] text-lg mb-2">正在生成AI导读...</div>
              <div className="text-[#999] text-sm">静候佳音，让AI为你解读文字背后的深意</div>
            </div>
          ) : !aiGuide ? (
            <div className="text-center py-12">
              <div className="text-[#666] text-lg mb-2">点击AI导读按钮开始分析</div>
              <div className="text-[#999] text-sm">让AI为你解读文字背后的深意</div>
            </div>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiGuide}</ReactMarkdown>
          )}
        </div>
      </div>

      {/* 评论区 */}
      <div className="bg-white rounded-lg shadow-lg p-8 border border-[#e8e4e0]">
        <h2 className="text-2xl font-bold text-[#2c3e50] font-serif mb-6">评论区</h2>
        <form onSubmit={handleAddComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="写下你的评论..."
            className="w-full h-32 p-4 text-lg border border-[#e8e4e0] rounded-lg bg-[#f8f5f0] focus:outline-none focus:ring-2 focus:ring-[#8b4513] focus:border-transparent resize-none font-serif"
          />
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-[#8b4513] text-white rounded-lg hover:bg-[#6b3410] transition-colors"
          >
            发表评论
          </button>
        </form>

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-[#e8e4e0] pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-[#2c3e50]">{comment.username}</span>
                <span className="text-sm text-[#666]">{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-[#444]">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassicDetail;
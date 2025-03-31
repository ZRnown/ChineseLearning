import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getClassicById } from '../services/classics';
import { Classic } from '../types/classic';
import LoadingSpinner from '../components/LoadingSpinner';
import { BiTime, BiHeart, BiChat } from 'react-icons/bi';
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
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'assistant', content: string, timestamp: Date}[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    const fetchClassic = async () => {
      try {
        setLoading(true);
        const data = await getClassicById(parseInt(id!));
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

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSendingMessage || !classic) return;

    const userMessage = {
      role: 'user' as 'user' | 'assistant',
      content: inputMessage,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsSendingMessage(true);

    try {
      // 使用API聊天接口
      const message = inputMessage; // 保存当前消息，因为inputMessage会被清空
      
      // 首先尝试使用GeminiAPI直接获取回复
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDkCLl2WmZZtWKumwMOSq_79XK42qOiCUM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `你是一个专业的中国古典文学导读助手。现在正在解读《${classic.title}》。
              请基于以下信息回答用户的问题：
              原文：${classic.content}
              
              用户问题: ${message}
              
              请用通俗易懂的语言回答，并保持专业性和准确性。
              
              要求：
              1. 使用Markdown格式进行回复
              2. 可以使用标题(#)、子标题(##)、列表、引用(>)等Markdown语法
              3. 重要内容或术语可以用**加粗**或*斜体*标注
              4. 如果需要引用原文，请使用>引用格式
              5. 适当使用分段和列表，使内容易于阅读`
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2048,
          }
        })
      });

      console.log('API响应状态:', response.status);
      
      let responseText = '';
      
      if (response.ok) {
        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          responseText = data.candidates[0].content.parts[0].text;
        } else {
          responseText = '服务器返回了空响应';
        }
      } else {
        responseText = `无法获取回答 (${response.status}: ${response.statusText})`;
      }
      
      console.log('AI回复:', responseText);

      const assistantMessage = {
        role: 'assistant' as 'user' | 'assistant',
        content: responseText,
        timestamp: new Date(),
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('发送消息失败:', error);
      const errorMessage = {
        role: 'assistant' as 'user' | 'assistant',
        content: '抱歉，发送消息失败，请稍后重试。',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
            <span className="mr-2">🌐</span>
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
            <span className="mr-2">📚</span>
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
            <>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiGuide}</ReactMarkdown>
              
              <div className="mt-8 border-t pt-6 border-[#e8e4e0]">
                <h3 className="text-xl font-bold text-[#2c3e50] mb-4">继续对话</h3>
                
                {chatMessages.length > 0 && (
                  <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto p-4 border border-[#e8e4e0] rounded-lg">
                    {chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === 'user'
                              ? 'bg-[#8b4513] text-white'
                              : 'bg-[#f8f5f0] text-[#444]'
                          }`}
                        >
                          {message.role === 'assistant' ? (
                            <div className="prose prose-sm dark:prose-invert prose-headings:font-serif prose-headings:text-inherit prose-p:text-inherit prose-a:text-inherit max-w-none">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          )}
                          <span className="text-xs opacity-70 mt-1 block">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="输入您的问题..."
                    className="flex-1 p-3 border border-[#e8e4e0] rounded-lg bg-[#f8f5f0] focus:outline-none focus:ring-2 focus:ring-[#8b4513] resize-none"
                    rows={2}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isSendingMessage || !inputMessage.trim()}
                    className="px-4 py-2 bg-[#8b4513] text-white rounded-lg hover:bg-[#6b3410] disabled:opacity-50 disabled:cursor-not-allowed self-end h-12 flex items-center justify-center"
                  >
                    {isSendingMessage ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <span>发送</span>
                    )}
                  </button>
                </div>
              </div>
            </>
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
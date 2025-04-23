import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClassicById } from '../services/classics';
import { Classic } from '../types/classic';
import LoadingSpinner from '../components/LoadingSpinner';
import { BiVolumeFull, BiVolumeMute, BiPause, BiPlay } from 'react-icons/bi';
import '../styles/ClassicDetail.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { addPinyinAnnotation } from '../utils/pinyin';
import CharacterExplanation from '../components/CharacterExplanation';
import FavoriteButton from '../components/FavoriteButton';
import { useAuth } from '../contexts/AuthContext';
import { useHistory } from '../contexts/HistoryContext';

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
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isGeneratingGuide, setIsGeneratingGuide] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', content: string, timestamp: Date }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const { user, toggleFavorite, checkIsFavorite } = useAuth();
  const { addToHistory } = useHistory();
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  // 添加朗读功能相关状态
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  // 设置默认语音为XiaoXiao
  const [selectedVoice, setSelectedVoice] = useState<string>('Microsoft Xiaoxiao Online (Natural) - Chinese (Mainland) (zh-CN)');
  // 设置默认语速为0.8（适中，更自然）
  const [speechRate, setSpeechRate] = useState<number>(0.8);
  // 设置默认音调为1.0（标准音调）
  const [speechPitch, setSpeechPitch] = useState<number>(1.0);
  // 添加朗读设置面板显示状态，默认为隐藏
  const [showSpeechSettings, setShowSpeechSettings] = useState(false);
  // 添加当前朗读句子索引
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(-1);
  // 存储分割后的句子数组
  const [sentences, setSentences] = useState<string[]>([]);

  // 添加拼音标注相关状态
  const [showPinyin, setShowPinyin] = useState(false);
  const [pinyinStyle] = useState<'above' | 'below' | 'inline'>('above');

  // 添加选中字的功能和释义显示
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // 添加朗读和释义模式的状态
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [isExplanationMode, setIsExplanationMode] = useState(false);

  useEffect(() => {
    const fetchClassic = async () => {
      try {
        setLoading(true);
        const data = await getClassicById(parseInt(id!));
        console.log('获取到的古籍数据：', data);
        setClassic(data);
        
        // 获取数据后添加到历史记录
        if (data) {
          // 强制类型转换来解决类型问题
          addToHistory(data as any);
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // 使用eslint注释忽略addToHistory依赖

  // 检查收藏状态
  useEffect(() => {
    if (classic && user) {
      setIsFavorite(checkIsFavorite(classic.id));
    } else {
      setIsFavorite(false);
    }
  }, [classic, user, checkIsFavorite]);

  // 添加调试信息
  useEffect(() => {
    console.log('ClassicDetail组件加载，ID:', id);
    console.log('Classic数据:', classic);
    console.log('Loading状态:', loading);
    console.log('Error状态:', error);
  }, [id, classic, loading, error]);

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

  // 在classic数据加载后分割句子
  useEffect(() => {
    if (classic?.content) {
      const sentenceArray = classic.content
        .split(/([。！？；：\.!?;:])/g)
        .reduce((acc: string[], current, index, array) => {
          if (index % 2 === 0 && index < array.length - 1) {
            acc.push(current + array[index + 1]);
          } else if (index % 2 !== 0 && index === array.length - 1) {
            acc.push(current);
          }
          return acc;
        }, [])
        .filter(sentence => sentence.trim() !== '');

      setSentences(sentenceArray);
      console.log('文本已分割成句子:', sentenceArray);
    }
  }, [classic]);

  // 朗读原文
  const handleSpeak = () => {
    if (!classic?.content || !speechSynthesisRef.current) return;

    // 如果正在朗读，则停止
    if (isSpeaking) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSentenceIndex(-1); // 重置当前句子索引
      return;
    }

    // 如果已暂停，则继续
    if (isPaused) {
      speechSynthesisRef.current.resume();
      setIsPaused(false);
      return;
    }

    // 确保文本已被分割成句子
    let sentencesToUse = sentences;
    if (sentences.length === 0 && classic.content) {
      const sentenceArray = classic.content
        .split(/([。！？；：\.!?;:])/g)
        .reduce((acc: string[], current, index, array) => {
          if (index % 2 === 0 && index < array.length - 1) {
            acc.push(current + array[index + 1]);
          } else if (index % 2 !== 0 && index === array.length - 1) {
            acc.push(current);
          }
          return acc;
        }, [])
        .filter(sentence => sentence.trim() !== '');

      setSentences(sentenceArray);
      sentencesToUse = sentenceArray;
      console.log('朗读前分割句子:', sentenceArray);
    }

    // 创建新的语音实例
    const utterance = new SpeechSynthesisUtterance(classic.content);

    // 设置语音参数
    utterance.lang = 'zh-CN'; // 设置语言为中文
    utterance.rate = speechRate; // 设置语速
    utterance.pitch = speechPitch; // 设置音调

    // 设置选定的语音
    if (selectedVoice) {
      const voice = availableVoices.find(v => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
        console.log('使用语音:', voice.name);
      } else {
        console.log('未找到选定的语音，使用默认语音');
      }
    }

    // 设置事件监听
    utterance.onend = () => {
      console.log('朗读结束');
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSentenceIndex(-1); // 重置当前句子索引
    };

    utterance.onerror = (event) => {
      console.error('语音合成错误:', event);
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSentenceIndex(-1); // 重置当前句子索引
    };

    // 改进句子边界事件监听，修复高亮卡在第一句的问题
    utterance.onboundary = (event) => {
      if (event.name === 'sentence' || event.name === 'word') {
        console.log('边界事件:', event.name, event.charIndex, event.charLength);

        // 确保有句子可以高亮
        if (sentencesToUse.length === 0) return;

        // 修改计算逻辑，更准确地确定当前句子
        const charIndex = event.charIndex;
        let accumulatedLength = 0;
        let foundIndex = -1;

        // 遍历句子数组，找到当前朗读位置对应的句子
        for (let i = 0; i < sentencesToUse.length; i++) {
          const sentenceLength = sentencesToUse[i].length;
          // 如果当前字符索引在这个句子的范围内
          if (charIndex >= accumulatedLength && charIndex < accumulatedLength + sentenceLength) {
            foundIndex = i;
            break;
          }
          accumulatedLength += sentenceLength;
        }

        // 如果找到了对应的句子索引，则更新高亮
        if (foundIndex !== -1) {
          // 强制更新当前句子索引，即使与之前相同
          setCurrentSentenceIndex(prevIndex => {
            if (prevIndex !== foundIndex) {
              console.log('当前朗读句子索引:', foundIndex, '句子内容:', sentencesToUse[foundIndex]);
              return foundIndex;
            }
            return prevIndex;
          });
        }
      }
    };

    // 保存引用以便后续控制
    utteranceRef.current = utterance;

    // 开始朗读
    speechSynthesisRef.current.speak(utterance);
    setIsSpeaking(true);
    setCurrentSentenceIndex(0); // 从第一句开始
    console.log('开始朗读，语速:', speechRate, '音调:', speechPitch);
  };

  // 暂停/继续朗读
  const handlePauseResume = () => {
    if (!speechSynthesisRef.current || !isSpeaking) return;

    if (isPaused) {
      speechSynthesisRef.current.resume();
      setIsPaused(false);
    } else {
      speechSynthesisRef.current.pause();
      setIsPaused(true);
    }
  };

  // 处理字符点击
  const handleCharacterClick = (char: string) => {
    setSelectedCharacter(char);
    setShowExplanation(true);
  };

  // 渲染带有可点击字符的文本
  const renderClickableText = (text: string) => {
    if (showPinyin) {
      const annotatedText = addPinyinAnnotation(text, { style: pinyinStyle });
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = annotatedText;

      const processNode = (node: Node): React.ReactNode => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent || '';
          if (!text.trim()) return null; // 忽略纯空白文本节点
          return text;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          if (element.classList.contains('pinyin-annotation')) {
            const pinyin = element.querySelector('.pinyin')?.textContent || '';
            const hanzi = element.querySelector('.hanzi')?.textContent || '';
            return (
              <ruby
                className={`pinyin-ruby ${isExplanationMode ? 'clickable-character' : ''}`}
                onClick={() => {
                  if (isExplanationMode && hanzi) {
                    handleCharacterClick(hanzi);
                  }
                }}
                title={isExplanationMode ? "点击查看释义" : ""}
              >
                {hanzi}
                <rt>{pinyin}</rt>
              </ruby>
            );
          }
          const children = Array.from(element.childNodes)
            .map(child => processNode(child))
            .filter(Boolean); // 过滤掉null值
          if (children.length === 0) return null;
          return <span key={Math.random()}>{children}</span>;
        }
        return null;
      };

      return processNode(tempDiv);
    } else {
      return text.split('').map((char, index) => (
        <span
          key={index}
          className={isExplanationMode ? 'clickable-character' : ''}
          onClick={() => {
            if (isExplanationMode) {
              handleCharacterClick(char);
            }
          }}
          title={isExplanationMode ? "点击查看释义" : ""}
        >
          {char}
        </span>
      ));
    }
  };

  // 修改句子点击处理函数
  const handleSentenceClick = (index: number) => {
    if (!isReadingMode) return; // 只有在朗读模式下才能点击朗读

    // 如果正在朗读，先停止
    if (isSpeaking && speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();

      // 短暂延迟后再开始新的朗读，确保之前的朗读已完全停止
      setTimeout(() => {
        startReadingFromSentence(index);
      }, 100);
    } else {
      // 如果没有正在朗读，直接开始
      startReadingFromSentence(index);
    }
  };

  // 抽取出从指定句子开始朗读的逻辑到单独的函数
  const startReadingFromSentence = (index: number) => {
    // 确保有句子数组
    if (sentences.length === 0 || !classic?.content || !speechSynthesisRef.current) return;

    // 获取从点击句子到结尾的所有内容
    const startIndex = sentences.slice(0, index).join('').length;
    const textToRead = classic.content.substring(startIndex);

    // 创建新的语音实例
    const utterance = new SpeechSynthesisUtterance(textToRead);

    // 设置语音参数
    utterance.lang = 'zh-CN';
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;

    // 设置选定的语音
    if (selectedVoice) {
      const voice = availableVoices.find(v => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
        console.log('使用语音:', voice.name);
      }
    }

    // 设置事件监听
    utterance.onend = () => {
      console.log('朗读结束');
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSentenceIndex(-1);
    };

    utterance.onerror = (event) => {
      console.error('语音合成错误:', event);
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSentenceIndex(-1);
    };

    // 改进句子边界事件监听，修复高亮问题
    utterance.onboundary = (event) => {
      if (event.name === 'sentence' || event.name === 'word') {
        console.log('边界事件:', event.name, event.charIndex, event.charLength);

        // 修改计算逻辑，更准确地确定当前句子
        const charIndex = event.charIndex;

        // 创建一个映射表，记录每个句子的起始位置
        const sentenceStartPositions: number[] = [];
        let position = 0;

        // 计算每个句子的起始位置（相对于从index开始的文本）
        for (let i = index; i < sentences.length; i++) {
          sentenceStartPositions.push(position);
          position += sentences[i].length;
        }

        // 找到当前朗读位置对应的句子
        let foundIndex = index; // 默认为起始句子
        for (let i = 0; i < sentenceStartPositions.length - 1; i++) {
          if (charIndex >= sentenceStartPositions[i] && charIndex < sentenceStartPositions[i + 1]) {
            foundIndex = index + i;
            break;
          }
        }

        // 如果位置超过了最后一个记录的起始位置，则可能是最后一个句子
        if (charIndex >= sentenceStartPositions[sentenceStartPositions.length - 1]) {
          foundIndex = index + sentenceStartPositions.length - 1;
        }

        // 使用函数式更新确保状态变化
        setCurrentSentenceIndex(prevIndex => {
          if (prevIndex !== foundIndex) {
            console.log('当前朗读句子索引:', foundIndex, '句子内容:', sentences[foundIndex]);
            return foundIndex;
          }
          return prevIndex;
        });
      }
    };

    // 保存引用以便后续控制
    utteranceRef.current = utterance;

    // 开始朗读前先设置当前句子索引
    setCurrentSentenceIndex(index);

    // 开始朗读
    speechSynthesisRef.current.speak(utterance);
    setIsSpeaking(true);
    console.log('从句子', index, '开始朗读');
  };

  // 处理收藏切换
  const handleToggleFavorite = async () => {
    if (!user) {
      // 如果用户未登录，重定向到登录页面
      navigate('/login');
      return;
    }

    if (classic) {
      const newFavoriteStatus = await toggleFavorite(classic);
      setIsFavorite(newFavoriteStatus);
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
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#2c3e50] font-serif mb-2">{classic.title}</h1>
            <div className="text-[#666] mb-6">
              <span className="mr-4">作者：{classic.author}</span>
              <span className="mr-4">朝代：{classic.dynasty}</span>
              <span>分类：{classic.category}</span>
            </div>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            {/* 添加收藏按钮 */}
            <FavoriteButton 
              isFavorite={isFavorite} 
              onToggle={handleToggleFavorite} 
              className="mr-4"
            />
            <div className="flex space-x-2">
              {/* 拼音按钮 */}
              <button
                onClick={() => setShowPinyin(!showPinyin)}
                className={`flex items-center justify-center p-2 ${showPinyin ? 'bg-[#8b4513] text-white' : 'bg-gray-200 text-gray-700'
                  } rounded-md hover:bg-gray-300 transition-colors`}
                title={showPinyin ? "隐藏拼音" : "显示拼音"}
              >
                <span className="text-sm">拼音</span>
              </button>

              {/* 释义按钮 */}
              <button
                onClick={() => setIsExplanationMode(!isExplanationMode)}
                className={`flex items-center justify-center p-2 ${isExplanationMode ? 'bg-[#8b4513] text-white' : 'bg-gray-200 text-gray-700'
                  } rounded-md hover:bg-gray-300 transition-colors`}
                title={isExplanationMode ? "退出释义模式" : "进入释义模式"}
              >
                <span className="text-sm">释义</span>
              </button>

              {/* 朗读按钮 */}
              <button
                onClick={() => setIsReadingMode(!isReadingMode)}
                className={`flex items-center justify-center p-2 ${isReadingMode ? 'bg-[#8b4513] text-white' : 'bg-gray-200 text-gray-700'
                  } rounded-md hover:bg-gray-300 transition-colors`}
                title={isReadingMode ? "退出朗读模式" : "进入朗读模式"}
              >
                <span className="text-sm">朗读</span>
              </button>

              {/* 朗读设置和朗读控制按钮 - 只在朗读模式下显示 */}
              {isReadingMode && (
                <>
                  <button
                    onClick={() => setShowSpeechSettings(!showSpeechSettings)}
                    className="flex items-center justify-center p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    title="朗读设置"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>

                  <button
                    onClick={handleSpeak}
                    className={`flex items-center justify-center p-2 ${isSpeaking ? 'bg-[#8b4513] text-white' : 'bg-gray-200 text-gray-700'
                      } rounded-md hover:bg-gray-300 transition-colors`}
                    title={isSpeaking ? "停止朗读" : "朗读原文"}
                  >
                    {isSpeaking ? <BiVolumeMute className="w-5 h-5" /> : <BiVolumeFull className="w-5 h-5" />}
                  </button>

                  {isSpeaking && (
                    <button
                      onClick={handlePauseResume}
                      className={`flex items-center justify-center p-2 ${isPaused ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'
                        } text-white rounded-md transition-colors`}
                      title={isPaused ? "继续朗读" : "暂停朗读"}
                    >
                      {isPaused ? <BiPlay className="w-5 h-5" /> : <BiPause className="w-5 h-5" />}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* 修改原文显示部分，添加拼音标注 */}
        <div className="prose max-w-none dark:prose-invert prose-headings:font-serif prose-headings:text-[#2c3e50] prose-p:text-[#444]">
          {sentences.length > 0 ? (
            <div className="whitespace-pre-wrap">
              {sentences.map((sentence, index) => (
                <span
                  key={index}
                  className={`sentence-container ${currentSentenceIndex === index ? 'current-reading' : ''} ${isReadingMode ? 'readable-sentence' : ''
                    }`}
                  onClick={() => handleSentenceClick(index)}
                  title={isReadingMode ? "点击从此处开始朗读" : ""}
                >
                  {renderClickableText(sentence)}
                </span>
              ))}
            </div>
          ) : (
            <div className="classic-content">
              {renderClickableText(classic.content)}
            </div>
          )}
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
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user'
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

      {showExplanation && selectedCharacter && (
        <CharacterExplanation
          character={selectedCharacter}
          onClose={() => setShowExplanation(false)}
        />
      )}
    </div>
  );
};

export default ClassicDetail;
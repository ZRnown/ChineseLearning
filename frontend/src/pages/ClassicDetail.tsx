import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClassicById } from '../services/classics';
import { Classic } from '../types/classic';
import LoadingSpinner from '../components/LoadingSpinner';
import { BiVolumeFull, BiVolumeMute, BiPause, BiPlay, BiCog } from 'react-icons/bi';
import '../styles/ClassicDetail.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { addPinyinAnnotation } from '../utils/pinyin';
import CharacterExplanation from '../components/CharacterExplanation';
import FavoriteButton from '../components/FavoriteButton';
import { useAuth } from '../contexts/AuthContext';
import { useHistory } from '../contexts/HistoryContext';
import AuthorIntroduction from '../components/AuthorIntroduction';
import WorkExplanation from '../components/WorkExplanation';

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

  // Author introduction modal state
  const [showAuthorIntroduction, setShowAuthorIntroduction] = useState(false);
  const [authorIntroduction, setAuthorIntroduction] = useState('');
  const [translatedAuthorIntroduction, setTranslatedAuthorIntroduction] = useState('');
  const [authorIntroductionCache, setAuthorIntroductionCache] = useState<{ [key: string]: string }>({});
  const [isLoadingAuthorIntro, setIsLoadingAuthorIntro] = useState(false);

  // Work explanation modal state
  const [showWorkExplanation, setShowWorkExplanation] = useState(false);
  const [workExplanation, setWorkExplanation] = useState('');
  const [translatedWorkExplanation, setTranslatedWorkExplanation] = useState('');
  const [workExplanationCache, setWorkExplanationCache] = useState<{ [key: string]: string }>({});
  const [isLoadingWorkExplanation, setIsLoadingWorkExplanation] = useState(false);

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

  // 初始化 speechSynthesis 和加载可用的语音
  useEffect(() => {
    // 检查浏览器是否支持 speechSynthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      console.log('初始化 speechSynthesis');
      speechSynthesisRef.current = window.speechSynthesis;

      // 加载可用语音
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('可用语音:', voices);
        setAvailableVoices(voices);

        // 尝试查找并设置默认使用Xiaoxiao语音
        const xiaoxiaoVoice = voices.find(v =>
          v.name.toLowerCase().includes('xiaoxiao') ||
          v.name.toLowerCase().includes('小小')
        );

        if (xiaoxiaoVoice) {
          console.log('找到Xiaoxiao语音:', xiaoxiaoVoice.name);
          setSelectedVoice(xiaoxiaoVoice.name);
        }
      };

      // 语音列表可能需要一段时间才能加载
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }

      // 初始尝试加载
      loadVoices();
    } else {
      console.error('当前浏览器不支持语音合成');
    }

    return () => {
      // 组件卸载时取消所有朗读
      if (speechSynthesisRef.current && isSpeaking) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, [isSpeaking]); // 依赖于 isSpeaking 以确保清理函数能够访问最新的状态

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

      // 使用Gemini API进行翻译
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

        // 确保作者简介和作品解析也被翻译成对应语言
        translateAuthorIntroduction();
        translateWorkExplanation();
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

      // 使用Gemini API生成AI导读
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

      // 使用Gemini API
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDkCLl2WmZZtWKumwMOSq_79XK42qOiCUM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `你是一个专业的中国古典文学导读助手。现在正在解读《${classic.title}》。
                  请基于以下信息回答用户的问题：
                  原文：${classic.content}
                  
                  用户问题: ${message}
                  
                  请用通俗易懂的语言回答，并保持专业性和准确性。`
                }
              ]
            }
          ],
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
        responseText = `抱歉，我暂时无法回答这个问题。请稍后再试。`;
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

  // 渲染带有可点击字符的文本并添加朗读高亮效果
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
      // 添加描述字段以匹配toggleFavorite期望的Classic类型
      const classicWithDescription = {
        ...classic,
        description: '', // 添加空描述字段
        author: classic.author || '', // 确保author不是undefined
        dynasty: classic.dynasty || '', // 确保dynasty不是undefined
        category: classic.category || '', // 确保category不是undefined
        source: classic.source || '' // 确保source不是undefined
      };
      const newFavoriteStatus = await toggleFavorite(classicWithDescription);
      setIsFavorite(newFavoriteStatus);
    }
  };

  // Function to handle author name click
  const handleAuthorClick = async () => {
    if (!classic?.author) return;

    // 无论如何都显示弹窗（不要重置翻译状态）
    setShowAuthorIntroduction(true);

    // 已经有翻译或原文，直接使用
    if (authorIntroduction || (selectedLanguage !== 'zh' && translatedAuthorIntroduction)) {
      setIsLoadingAuthorIntro(false);
      return;
    }

    // 如果数据库中有作者介绍，直接使用
    if (classic.author_introduction) {
      setAuthorIntroduction(classic.author_introduction);

      // 如果当前语言不是中文，尝试翻译
      if (selectedLanguage !== 'zh') {
        translateAuthorIntroduction();
      }

      setIsLoadingAuthorIntro(false);
      return;
    }

    // 显示加载中状态
    setIsLoadingAuthorIntro(true);

    try {
      // 从数据库中没有作者介绍，显示简单提示
      setAuthorIntroduction('暂无作者详细介绍。');
    } finally {
      setIsLoadingAuthorIntro(false);
    }
  };

  // Function to translate author introduction
  const translateAuthorIntroduction = async () => {
    if (!authorIntroduction || selectedLanguage === 'zh') {
      setTranslatedAuthorIntroduction('');
      return;
    }

    // Check if translation is already cached
    const cacheKey = `${classic?.author || ''}_${selectedLanguage}`;
    if (authorIntroductionCache[cacheKey]) {
      setTranslatedAuthorIntroduction(authorIntroductionCache[cacheKey]);
      return;
    }

    // 如果之前没有翻译过，我们为常见语言提供预设的翻译
    // 这样避免每次都要调用API，提高响应速度
    const commonTranslations: { [key: string]: { [key: string]: string } } = {
      // 使用作者名作为键，然后每种语言的翻译作为内部对象
      // 这里只是示例，实际应用中可以扩展更多常见作者的翻译
      "李白": {
        "en": "Li Bai (701-762), also known as Li Po, was one of the greatest poets of the Tang dynasty, known as the 'Immortal Poet'. His poems often feature themes of nature, friendship, and the joy of wine. Li Bai's writing style is characterized by its imaginative qualities and bold, unconstrained expression.",
        "es": "Li Bai (701-762), también conocido como Li Po, fue uno de los más grandes poetas de la dinastía Tang, conocido como el 'Poeta Inmortal'. Sus poemas a menudo presentan temas de la naturaleza, la amistad y la alegría del vino. El estilo de escritura de Li Bai se caracteriza por sus cualidades imaginativas y su expresión audaz y sin restricciones."
      },
      "杜甫": {
        "en": "Du Fu (712-770) was a prominent Chinese poet of the Tang dynasty. Often called the 'Poet Historian' or 'Poet Sage', his works are known for their realism, social criticism, and deep compassion. Du Fu's life was marked by personal hardship and the political turmoil of his era, which is reflected in his poetry.",
        "es": "Du Fu (712-770) fue un destacado poeta chino de la dinastía Tang. A menudo llamado el 'Poeta Historiador' o 'Poeta Sabio', sus obras son conocidas por su realismo, crítica social y profunda compasión. La vida de Du Fu estuvo marcada por dificultades personales y la agitación política de su época, lo que se refleja en su poesía."
      }
    };

    // 检查是否有这个作者的预设翻译
    if (classic?.author && commonTranslations[classic.author] && commonTranslations[classic.author][selectedLanguage]) {
      const translation = commonTranslations[classic.author][selectedLanguage];
      setTranslatedAuthorIntroduction(translation);

      // 缓存这个翻译
      setAuthorIntroductionCache(prev => {
        const newCache = { ...prev };
        newCache[cacheKey] = translation;
        return newCache;
      });

      return;
    }

    // 如果没有预设翻译，调用Gemini API
    try {
      setIsLoadingAuthorIntro(true);
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDkCLl2WmZZtWKumwMOSq_79XK42qOiCUM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `请将以下中文文本翻译成${languages.find(lang => lang.code === selectedLanguage)?.name}，保持原文的准确性和风格：

${authorIntroduction}

要求：
1. 翻译要准确传达原文的意思
2. 保持专业性和学术性
3. 使用目标语言的自然表达方式`
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`翻译请求失败: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const translatedText = data.candidates[0].content.parts[0].text;
        setTranslatedAuthorIntroduction(translatedText);

        // 缓存翻译结果
        setAuthorIntroductionCache(prev => {
          const newCache = { ...prev };
          newCache[cacheKey] = translatedText;
          return newCache;
        });
      } else {
        // 如果翻译失败，显示原文
        setTranslatedAuthorIntroduction(authorIntroduction);
      }
    } catch (error) {
      console.error('翻译作者简介失败:', error);
      // 出错时显示原文
      setTranslatedAuthorIntroduction(authorIntroduction);
    } finally {
      setIsLoadingAuthorIntro(false);
    }
  };

  // Update translated author introduction when language changes
  useEffect(() => {
    translateAuthorIntroduction();
  }, [selectedLanguage, authorIntroduction]);

  // Function to handle work title click
  const handleWorkTitleClick = async () => {
    if (!classic) return;

    setShowWorkExplanation(true);

    // 如果数据库中有作品解析，直接使用
    if (classic.explanation) {
      setWorkExplanation(classic.explanation);

      // 如果当前语言不是中文，尝试翻译
      if (selectedLanguage !== 'zh') {
        translateWorkExplanation();
      }

      setIsLoadingWorkExplanation(false);
      return;
    }

    // 如果缓存中已有作品解析，直接使用
    if (workExplanation) {
      setIsLoadingWorkExplanation(false);
      return;
    }

    // 显示加载中状态
    setIsLoadingWorkExplanation(true);

    try {
      // 从数据库中没有作品解析，显示简单提示
      setWorkExplanation('暂无作品详细解析。');
    } finally {
      setIsLoadingWorkExplanation(false);
    }
  };

  // Function to translate work explanation
  const translateWorkExplanation = async () => {
    if (!workExplanation || selectedLanguage === 'zh') {
      setTranslatedWorkExplanation('');
      return;
    }

    // Check if translation is already cached
    const cacheKey = `${classic?.title || ''}_${selectedLanguage}`;
    if (workExplanationCache[cacheKey]) {
      setTranslatedWorkExplanation(workExplanationCache[cacheKey]);
      return;
    }

    // 调用Gemini API翻译作品简介
    try {
      setIsLoadingWorkExplanation(true);
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDkCLl2WmZZtWKumwMOSq_79XK42qOiCUM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `请将以下中文文本翻译成${languages.find(lang => lang.code === selectedLanguage)?.name}，保持原文的准确性和风格：

${workExplanation}

要求：
1. 翻译要准确传达原文的意思
2. 保持专业性和学术性
3. 使用目标语言的自然表达方式`
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`翻译请求失败: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const translatedText = data.candidates[0].content.parts[0].text;
        setTranslatedWorkExplanation(translatedText);

        // 缓存翻译结果
        setWorkExplanationCache(prev => {
          const newCache = { ...prev };
          newCache[cacheKey] = translatedText;
          return newCache;
        });
      } else {
        // 如果翻译失败，显示原文
        setTranslatedWorkExplanation(workExplanation);
      }
    } catch (error) {
      console.error('翻译作品简介失败:', error);
      // 出错时显示原文
      setTranslatedWorkExplanation(workExplanation);
    } finally {
      setIsLoadingWorkExplanation(false);
    }
  };

  // Update translated work explanation when language changes
  useEffect(() => {
    if (workExplanation) {
      translateWorkExplanation();
    }
  }, [selectedLanguage, workExplanation]);

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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-[#e8e4e0] dark:border-gray-700 transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <div className="flex items-center">
              <h1
                className="text-3xl font-bold text-[#2c3e50] dark:text-gray-100 font-serif mb-2 mr-3 cursor-pointer hover:text-[#8b4513] dark:hover:text-[#d9c9a3] transition-colors duration-200"
                onClick={handleWorkTitleClick}
                title="点击查看作品解析"
              >
                {classic.title}
              </h1>
            </div>
            <div className="text-[#666] dark:text-gray-400 mb-6 transition-colors duration-200">
              <span className="mr-4">作者：
                <span
                  className="cursor-pointer hover:text-[#8b4513] dark:hover:text-[#d9c9a3] hover:underline transition-colors duration-200"
                  onClick={handleAuthorClick}
                >
                  {classic.author}
                </span>
              </span>
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
                className="flex items-center justify-center p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                onClick={() => setShowPinyin(!showPinyin)}
                title="显示拼音"
              >
                <span className="text-sm">拼音</span>
              </button>

              {/* 释义按钮 */}
              <button
                className={`flex items-center justify-center p-2 ${isExplanationMode
                  ? 'bg-[#8b4513] dark:bg-[#d9c9a3] text-white dark:text-gray-800'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  } rounded-md transition-colors duration-200`}
                onClick={() => setIsExplanationMode(!isExplanationMode)}
                title="进入释义模式"
              >
                <span className="text-sm">释义</span>
              </button>

              {/* 朗读按钮 */}
              <button
                className={`flex items-center justify-center p-2 ${isReadingMode
                  ? 'bg-[#8b4513] dark:bg-[#d9c9a3] text-white dark:text-gray-800'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  } rounded-md transition-colors duration-200`}
                onClick={() => setIsReadingMode(!isReadingMode)}
                title="进入朗读模式"
              >
                <span className="text-sm">朗读</span>
              </button>

              {/* 只在朗读模式下显示的控制按钮 */}
              {isReadingMode && (
                <>
                  <button
                    onClick={handleSpeak}
                    className="ml-2 p-2 rounded-lg bg-[#8b4513] dark:bg-[#d9c9a3]/80 text-white dark:text-gray-900 hover:bg-[#6b3410] dark:hover:bg-[#d9c9a3] transition-colors duration-200"
                    title={isSpeaking ? "停止朗读" : "开始朗读"}
                  >
                    {isSpeaking ? <BiVolumeMute size={20} /> : <BiVolumeFull size={20} />}
                  </button>

                  {/* 暂停/继续按钮，只在朗读时显示 */}
                  {isSpeaking && (
                    <button
                      onClick={handlePauseResume}
                      className="ml-2 p-2 rounded-lg bg-[#8b4513] dark:bg-[#d9c9a3]/80 text-white dark:text-gray-900 hover:bg-[#6b3410] dark:hover:bg-[#d9c9a3] transition-colors duration-200"
                      title={isPaused ? "继续" : "暂停"}
                    >
                      {isPaused ? <BiPlay size={20} /> : <BiPause size={20} />}
                    </button>
                  )}

                  <button
                    onClick={() => setShowSpeechSettings(!showSpeechSettings)}
                    className="ml-2 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                    title="朗读设置"
                  >
                    <BiCog size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 朗读控制面板 */}
        {(showSpeechSettings || isSpeaking) && (
          <div className="mb-6 border-t border-b border-[#e8e4e0] dark:border-gray-700 py-4">
            {showSpeechSettings && (
              <div className="p-4 bg-[#f8f5f0] dark:bg-gray-700 rounded-lg transition-colors duration-200 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#2c3e50] dark:text-gray-200 text-sm font-medium mb-2">语音选择</label>
                    <select
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      className="w-full p-2 border border-[#e8e4e0] dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#444] dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8b4513] dark:focus:ring-[#d9c9a3] focus:border-transparent transition-colors duration-200"
                    >
                      {availableVoices.map((voice) => (
                        <option key={voice.name} value={voice.name}>
                          {voice.name} ({voice.lang})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex justify-between text-[#2c3e50] dark:text-gray-200 text-sm font-medium mb-2">
                      <span>朗读速度</span>
                      <span>{speechRate.toFixed(1)}</span>
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={speechRate}
                      onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="flex justify-between text-[#2c3e50] dark:text-gray-200 text-sm font-medium mb-2">
                      <span>音调</span>
                      <span>{speechPitch.toFixed(1)}</span>
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={speechPitch}
                      onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {isSpeaking && (
              <div className="px-4">
                <div className="mb-2 text-[#2c3e50] dark:text-gray-200 text-sm font-medium">当前朗读进度</div>
                <div className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg">
                  <div
                    className="h-2 bg-[#8b4513] dark:bg-[#d9c9a3] rounded-lg"
                    style={{ width: `${(currentSentenceIndex / sentences.length) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-right text-[#666] dark:text-gray-400">
                  {currentSentenceIndex >= 0 ? `${currentSentenceIndex + 1}/${sentences.length} 句` : ''}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 修改原文显示部分，添加拼音标注 */}
        <div className="prose max-w-none dark:prose-invert prose-headings:font-serif prose-headings:text-[#2c3e50] dark:prose-headings:text-gray-100 prose-p:text-[#444] dark:prose-p:text-gray-300 transition-colors duration-200">
          {sentences.length > 0 ? (
            <div className="whitespace-pre-wrap">
              {sentences.map((sentence, index) => (
                <span
                  key={index}
                  className={`sentence-container ${isReadingMode ? 'readable-sentence' : ''} ${currentSentenceIndex === index ? 'current-reading' : ''}`}
                  onClick={() => isReadingMode && handleSentenceClick(index)}
                  title={isReadingMode ? (currentSentenceIndex === index ? '正在朗读这句' : '点击开始朗读这句') : ''}
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-[#e8e4e0] dark:border-gray-700 transition-colors duration-200">
        <div className="mb-6">
          <label className="block text-[#2c3e50] dark:text-gray-200 font-medium mb-2 transition-colors duration-200">选择翻译语言</label>
          <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`p-2 rounded-lg text-center transition-all duration-300 text-sm ${selectedLanguage === lang.code
                  ? 'bg-[#8b4513] dark:bg-[#d9c9a3] text-white dark:text-gray-900 shadow-md'
                  : 'bg-[#f8f5f0] dark:bg-gray-700 text-[#2c3e50] dark:text-gray-300 hover:bg-[#e8e4e0] dark:hover:bg-gray-600 border border-[#e8e4e0] dark:border-gray-600'
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
            className="flex items-center px-4 py-2 rounded-lg transition-colors bg-[#8b4513] dark:bg-[#d9c9a3]/80 hover:bg-[#6b3410] dark:hover:bg-[#d9c9a3] text-white dark:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-2">🌐</span>
            {isTranslating ? '翻译中...' : '翻译'}
          </button>
          <button
            onClick={handleGenerateAiGuide}
            disabled={isGeneratingGuide}
            className="flex items-center px-4 py-2 rounded-lg transition-colors bg-[#8b4513] dark:bg-[#d9c9a3]/80 hover:bg-[#6b3410] dark:hover:bg-[#d9c9a3] text-white dark:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-2">📚</span>
            {isGeneratingGuide ? 'AI分析中...' : 'AI导读'}
          </button>
        </div>
      </div>

      {/* 翻译结果 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-[#e8e4e0] dark:border-gray-700 transition-colors duration-200">
        <h2 className="text-2xl font-bold text-[#2c3e50] dark:text-gray-100 font-serif mb-6 transition-colors duration-200">翻译结果</h2>
        <div className="prose max-w-none dark:prose-invert prose-headings:font-serif prose-headings:text-[#2c3e50] dark:prose-headings:text-gray-100 prose-p:text-[#444] dark:prose-p:text-gray-300 transition-colors duration-200">
          {isTranslating ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b4513] dark:border-[#d9c9a3] mx-auto mb-4"></div>
              <div className="text-[#666] dark:text-gray-400 text-lg mb-2 transition-colors duration-200">正在翻译中...</div>
              <div className="text-[#999] dark:text-gray-500 text-sm transition-colors duration-200">静候佳音，让文字跨越语言的界限</div>
            </div>
          ) : translatedText ? (
            <div>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {translatedText}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-[#666] dark:text-gray-400 text-lg mb-2 transition-colors duration-200">选择语言并点击翻译按钮</div>
              <div className="text-[#999] dark:text-gray-500 text-sm transition-colors duration-200">让文字跨越语言的界限</div>
            </div>
          )}
        </div>
      </div>

      {/* AI导读 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-[#e8e4e0] dark:border-gray-700 transition-colors duration-200">
        <h2 className="text-2xl font-bold text-[#2c3e50] dark:text-gray-100 font-serif mb-6 transition-colors duration-200">AI导读</h2>
        <div className="prose max-w-none dark:prose-invert prose-headings:font-serif prose-headings:text-[#2c3e50] dark:prose-headings:text-gray-100 prose-p:text-[#444] dark:prose-p:text-gray-300 transition-colors duration-200">
          {isGeneratingGuide ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b4513] dark:border-[#d9c9a3] mx-auto mb-4"></div>
              <div className="text-[#666] dark:text-gray-400 text-lg mb-2 transition-colors duration-200">正在生成AI导读...</div>
              <div className="text-[#999] dark:text-gray-500 text-sm transition-colors duration-200">静候佳音，让AI为你解读文字背后的深意</div>
            </div>
          ) : aiGuide ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {aiGuide}
            </ReactMarkdown>
          ) : (
            <div className="text-center py-12">
              <div className="text-[#666] dark:text-gray-400 text-lg mb-2 transition-colors duration-200">点击AI导读按钮开始分析</div>
              <div className="text-[#999] dark:text-gray-500 text-sm transition-colors duration-200">让AI为你解读文字背后的深意</div>
            </div>
          )}
        </div>
      </div>

      {/* AI智能对话 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-[#e8e4e0] dark:border-gray-700 transition-colors duration-200">
        <h2 className="text-2xl font-bold text-[#2c3e50] dark:text-gray-100 font-serif mb-6 transition-colors duration-200">智能对话</h2>
        <div className="mb-6 space-y-4 max-h-96 overflow-y-auto">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${msg.role === 'user'
                ? 'ml-10 bg-[#f0f0f0] dark:bg-gray-700 text-[#333] dark:text-gray-200'
                : 'mr-10 bg-[#8b4513]/10 dark:bg-[#d9c9a3]/10 text-[#444] dark:text-gray-300'
                } transition-colors duration-200`}
            >
              <div className="flex justify-between mb-2">
                <span className="font-medium text-[#2c3e50] dark:text-gray-200 transition-colors duration-200">
                  {msg.role === 'user' ? '你' : 'AI助手'}
                </span>
                <span className="text-xs text-[#666] dark:text-gray-400 transition-colors duration-200">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            </div>
          ))}
          {isSendingMessage && (
            <div className="p-4 mr-10 rounded-lg bg-[#8b4513]/10 dark:bg-[#d9c9a3]/10 transition-colors duration-200">
              <div className="flex justify-between mb-2">
                <span className="font-medium text-[#2c3e50] dark:text-gray-200 transition-colors duration-200">AI助手</span>
                <span className="text-xs text-[#666] dark:text-gray-400 transition-colors duration-200">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-[#8b4513] dark:bg-[#d9c9a3] rounded-full animate-bounce delay-0"></div>
                <div className="w-2 h-2 bg-[#8b4513] dark:bg-[#d9c9a3] rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-[#8b4513] dark:bg-[#d9c9a3] rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="输入你想了解的内容..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-2 border border-[#e8e4e0] dark:border-gray-600 rounded-lg bg-[#f8f5f0] dark:bg-gray-700 text-[#444] dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8b4513] dark:focus:ring-[#d9c9a3] focus:border-transparent transition-colors duration-200"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isSendingMessage}
            className="px-4 py-2 bg-[#8b4513] dark:bg-[#d9c9a3]/80 text-white dark:text-gray-900 rounded-lg hover:bg-[#6b3410] dark:hover:bg-[#d9c9a3] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            发送
          </button>
        </div>
      </div>

      {/* 作者简介弹窗 */}
      {showAuthorIntroduction && (
        <AuthorIntroduction
          isOpen={showAuthorIntroduction}
          onClose={() => setShowAuthorIntroduction(false)}
          author={classic.author || '佚名'}
          introduction={selectedLanguage !== 'zh' && translatedAuthorIntroduction ? translatedAuthorIntroduction : authorIntroduction}
          isLoading={isLoadingAuthorIntro}
        />
      )}

      {/* 作品解析弹窗 */}
      {showWorkExplanation && (
        <WorkExplanation
          isOpen={showWorkExplanation}
          onClose={() => setShowWorkExplanation(false)}
          title={classic.title}
          explanation={selectedLanguage !== 'zh' && translatedWorkExplanation ? translatedWorkExplanation : workExplanation}
          isLoading={isLoadingWorkExplanation}
        />
      )}

      {/* 字词释义 */}
      {selectedCharacter && showExplanation && (
        <CharacterExplanation
          character={selectedCharacter}
          onClose={() => setShowExplanation(false)}
        />
      )}
    </div>
  );
};

export default ClassicDetail;
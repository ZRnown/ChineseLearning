import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import { FaGlobe, FaRobot } from 'react-icons/fa';

const Translation: React.FC = () => {
    const [text, setText] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('中文');
    const [selectedLanguageCode, setSelectedLanguageCode] = useState('zh');
    const [translatedText, setTranslatedText] = useState('');
    const [aiGuideText, setAiGuideText] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false); 
    const [error, setError] = useState('');
    const [aiError, setAiError] = useState(''); 
    
    // 语言选项
    const languages = [
        { name: '中文', code: 'zh' },
        { name: 'English', code: 'en' },
        { name: 'Español', code: 'es' },
        { name: 'Français', code: 'fr' },
        { name: 'Deutsch', code: 'de' },
        { name: 'Русский', code: 'ru' },
        { name: 'العربية', code: 'ar' },
        { name: '日本語', code: 'ja' },
        { name: '한국어', code: 'ko' },
        { name: 'Português', code: 'pt' },
        { name: 'Italiano', code: 'it' },
        { name: 'हिंदी', code: 'hi' },
        { name: 'Türkçe', code: 'tr' },
        { name: 'Nederlands', code: 'nl' },
        { name: 'Polski', code: 'pl' },
        { name: 'Svenska', code: 'sv' },
        { name: 'Dansk', code: 'da' },
        { name: 'Suomi', code: 'fi' },
        { name: 'Norsk', code: 'no' },
        { name: 'Ελληνικά', code: 'el' },
        { name: 'Čeština', code: 'cs' },
        { name: 'Română', code: 'ro' },
        { name: 'Magyar', code: 'hu' },
        { name: 'ไทย', code: 'th' },
        { name: 'Bahasa Indonesia', code: 'id' },
        { name: 'Tiếng Việt', code: 'vi' },
        { name: 'Українська', code: 'uk' },
        { name: 'Српски', code: 'sr' },
        { name: 'Български', code: 'bg' },
        { name: 'Slovenčina', code: 'sk' },
        { name: 'Hrvatski', code: 'hr' },
        { name: 'Slovenščina', code: 'sl' },
        { name: 'Eesti', code: 'et' },
        { name: 'Latviešu', code: 'lv' },
        { name: 'Lietuvių', code: 'lt' },
        { name: 'עברית', code: 'he' },
        { name: 'বাংলা', code: 'bn' },
        { name: 'Kiswahili', code: 'sw' },
    ];

    // 选择语言时同时更新语言代码
    const handleLanguageSelect = (lang: { name: string, code: string }) => {
        setSelectedLanguage(lang.name);
        setSelectedLanguageCode(lang.code);
    };

    // 翻译功能
    const handleTranslate = async () => {
        if (!text.trim()) {
            setTranslatedText('请提供需要翻译的古文。我没有收到任何需要翻译的文本。');
            return;
        }
        
        try {
            setLoading(true);
            setError('');
            setTranslatedText('');
            
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDkCLl2WmZZtWKumwMOSq_79XK42qOiCUM', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `请将以下古文翻译成${selectedLanguage}，保持原文的文学性和意境：

${text}

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
            console.log("翻译API响应:", data); // 调试用
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                setTranslatedText(data.candidates[0].content.parts[0].text);
            } else {
                throw new Error('API响应格式不正确');
            }
        } catch (err) {
            console.error('翻译失败:', err);
            setError(err instanceof Error ? err.message : '翻译失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    // AI导读功能
    const handleAIGuide = async () => {
        if (!text.trim()) {
            return;
        }
        
        try {
            setAiLoading(true);
            setAiError('');
            
            // 根据选择的语言调整提示词
            let promptText = '';
            
            if (selectedLanguage === '中文') {
                promptText = `请对以下古文进行导读分析：\n\n${text}\n\n请从以下几个方面进行分析：
1. 作品背景与作者简介
2. 文本解读与翻译
3. 文学手法分析
4. 思想内涵探讨
5. 历史文化价值`;
            } else {
                // 为其他语言准备相应的提示词
                const languageMap: Record<string, string> = {
                    'English': 'English',
                    'Español': 'Spanish',
                    'Français': 'French',
                    'Deutsch': 'German',
                    'Русский': 'Russian',
                    '日本語': 'Japanese',
                    '한국어': 'Korean',
                    // 其他语言可以根据需要添加
                };
                
                const targetLanguage = languageMap[selectedLanguage] || 'English';
                
                promptText = `Please analyze the following ancient Chinese text in ${targetLanguage}:\n\n${text}\n\nPlease analyze from the following aspects:
1. Background of the work and author introduction
2. Text interpretation and translation
3. Literary technique analysis
4. Ideological connotation discussion
5. Historical and cultural value`;
            }
            
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDkCLl2WmZZtWKumwMOSq_79XK42qOiCUM', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: promptText
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.2,
                        maxOutputTokens: 4096,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`API请求失败: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                setAiGuideText(data.candidates[0].content.parts[0].text);
            } else {
                throw new Error('API响应格式不正确');
            }
        } catch (err) {
            console.error('AI导读失败:', err);
            setAiError(err instanceof Error ? err.message : 'AI导读失败，请稍后重试');
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl bg-[#f8f5f0]">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h1 className="text-3xl font-bold mb-6">古文翻译</h1>
                
                <div className="mb-4">
                    <label htmlFor="classic-content" className="block text-lg font-medium mb-2">
                        输入古文内容
                    </label>
                    <textarea
                        id="classic-content"
                        className="w-full p-4 border border-gray-300 rounded-lg mb-4 min-h-[120px]"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="请输入要翻译的古文内容..."
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">选择翻译语言</h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={`p-2 rounded-md text-center transition-colors ${
                                selectedLanguage === lang.name
                                    ? 'bg-[#8b4513] text-white'
                                    : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                            onClick={() => handleLanguageSelect(lang)}
                        >
                            {lang.name}
                        </button>
                    ))}
                </div>
                
                <div className="flex space-x-4">
                    <button
                        onClick={handleTranslate}
                        className="flex items-center justify-center px-6 py-3 bg-[#8b4513] text-white rounded-md hover:bg-[#6b3410] transition-colors"
                        disabled={loading}
                    >
                        <FaGlobe className="mr-2" />
                        翻译
                    </button>
                    
                    <button
                        onClick={handleAIGuide}
                        className="flex items-center justify-center px-6 py-3 bg-[#4b5563] text-white rounded-md hover:bg-[#374151] transition-colors"
                        disabled={loading}
                    >
                        <FaRobot className="mr-2" />
                        AI导读
                    </button>
                </div>
            </div>

            {/* 翻译结果区域 */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">翻译结果</h2>
                
                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-xl mb-4">正在翻译中...</p>
                        <p className="text-gray-500">静候佳音，让文字跨越语言的界限</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                ) : translatedText ? (
                    <div className="prose max-w-none">
                        {translatedText}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="mb-4">选择语言并点击翻译按钮</p>
                        <p className="text-gray-500">让文字跨越语言的界限</p>
                    </div>
                )}
            </div>
            
            {/* AI导读区域 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">AI导读</h2>
                
                {aiLoading ? (
                    <div className="text-center py-8">
                        <p className="text-xl mb-4">正在生成AI导读...</p>
                        <p className="text-gray-500">静候佳音，让AI为你解读文字背后的深意</p>
                    </div>
                ) : aiError ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {aiError}
                    </div>
                ) : !text.trim() ? (
                    <div className="text-center py-8">
                        <p className="mb-4">点击AI导读按钮开始分析</p>
                        <p className="text-gray-500">让AI为你解读文字背后的深意</p>
                    </div>
                ) : aiGuideText ? (
                    <div className="prose max-w-none">
                        {aiGuideText}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="mb-4">点击AI导读按钮开始分析</p>
                        <p className="text-gray-500">让AI为你解读古文背后的深意</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Translation;
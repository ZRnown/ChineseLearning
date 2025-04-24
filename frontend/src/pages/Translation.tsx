import React, { useState } from 'react';
// 添加react-markdown导入
import ReactMarkdown from 'react-markdown';
import { FaGlobe, FaRobot } from 'react-icons/fa';
import { AiOutlineRobot } from 'react-icons/ai';

const Translation: React.FC = () => {
    const [text, setText] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('中文');
    // selectedLanguageCode实际上在handleLanguageSelect中被使用，但在翻译API调用中没有使用
    // 修改为使用selectedLanguage而不是selectedLanguageCode
    // const [selectedLanguageCode, setSelectedLanguageCode] = useState('zh');
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
        // 移除对setSelectedLanguageCode的调用，因为我们已经移除了该状态变量
        // setSelectedLanguageCode(lang.code);
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
                promptText = `请对以下古文进行导读分析，并使用Markdown格式输出结果：\n\n${text}\n\n请从以下几个方面进行分析：
1. 作品背景与作者简介
2. 文本解读与翻译
3. 文学手法分析
4. 思想内涵探讨
5. 历史文化价值

请使用Markdown格式进行排版，包括标题、列表、引用等，以提高可读性。`;
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

                promptText = `Please analyze the following ancient Chinese text in ${targetLanguage} and format your response using Markdown:\n\n${text}\n\nPlease analyze from the following aspects:
1. Background of the work and author introduction
2. Text interpretation and translation
3. Literary technique analysis
4. Ideological connotation discussion
5. Historical and cultural value

Please use Markdown formatting including headings, lists, quotes, etc. to improve readability.`;
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
        <div className="container mx-auto px-4 py-8 max-w-4xl bg-[#f8f5f0] dark:bg-gray-900 transition-colors duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 transition-colors duration-200">
                <h1 className="text-4xl font-bold mb-6 font-serif text-[#8b4513] dark:text-[#d9c9a3] text-center transition-colors duration-200">古文翻译</h1>
                <p className="text-center text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-200">让古典文学焕发新生，让智慧跨越时空</p>

                <div className="mb-4">
                    <textarea
                        id="classic-content"
                        className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 min-h-[120px] bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 transition-colors duration-200"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="请输入要翻译的古文内容..."
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 transition-colors duration-200">
                <h2 className="text-2xl font-bold mb-4 font-serif text-[#8b4513] dark:text-[#d9c9a3] transition-colors duration-200">选择翻译语言</h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={`p-2 rounded-md text-center transition-colors ${selectedLanguage === lang.name
                                ? 'bg-[#8b4513] dark:bg-[#d9c9a3] text-white dark:text-gray-900'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
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
                        className={`flex items-center justify-center px-6 py-3 bg-[#8b4513] dark:bg-[#d9c9a3]/80 text-white dark:text-gray-900 rounded-md hover:bg-[#6b3410] dark:hover:bg-[#d9c9a3] transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        disabled={loading || aiLoading}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                翻译中...
                            </>
                        ) : (
                            <>
                                <FaGlobe className="mr-2" />
                                翻译
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleAIGuide}
                        className={`flex items-center justify-center px-6 py-3 bg-[#4b5563] text-white rounded-md hover:bg-[#374151] transition-colors ${aiLoading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        disabled={loading || aiLoading}
                    >
                        {aiLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                分析中...
                            </>
                        ) : (
                            <>
                                <AiOutlineRobot className="mr-2" />
                                AI导读
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* 翻译结果区域 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4 font-serif text-[#8b4513] dark:text-[#d9c9a3]">翻译结果</h2>

                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b4513] dark:border-[#d9c9a3]"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                ) : translatedText ? (
                    <div className="prose max-w-none dark:prose-invert transition-colors duration-200">
                        <h3 className="font-bold text-xl mb-2 text-gray-800 dark:text-gray-200 transition-colors duration-200">{selectedLanguage} 翻译</h3>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line transition-colors duration-200">{translatedText}</p>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="mb-4">选择语言并点击翻译按钮</p>
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8 transition-colors duration-200">翻译结果将显示在这里...</p>
                    </div>
                )}
            </div>

            {/* AI导读区域 - 修改为支持Markdown */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 font-serif text-[#8b4513] dark:text-[#d9c9a3]">AI导读</h2>

                {aiLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b4513] dark:border-[#d9c9a3]"></div>
                    </div>
                ) : aiError ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {aiError}
                    </div>
                ) : !text.trim() ? (
                    <div className="text-center py-8">
                        <p className="mb-4">点击AI导读按钮开始分析</p>
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8 transition-colors duration-200">AI导读将显示在这里...</p>
                    </div>
                ) : aiGuideText ? (
                    <div className="prose max-w-none dark:prose-invert transition-colors duration-200">
                        <ReactMarkdown
                            components={{
                                p: ({ node, ...props }) => <p className="text-gray-700 dark:text-gray-300 transition-colors duration-200" {...props} />
                            }}
                        >{aiGuideText}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="mb-4">点击AI导读按钮开始分析</p>
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8 transition-colors duration-200">AI导读将显示在这里...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Translation;

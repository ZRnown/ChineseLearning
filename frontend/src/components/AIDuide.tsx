import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AIDuideProps {
    text: string;
    language?: string;  // 从翻译组件传入的语言
}

// 语言映射表
const languageMap: { [key: string]: string } = {
    'zh': '中文',
    'en': '英语',
    'ja': '日语',
    'ko': '韩语',
    'fr': '法语',
    'de': '德语',
    'es': '西班牙语',
    'it': '意大利语',
    'ru': '俄语',
    'ar': '阿拉伯语',
    'pl': '波兰语',
    // 可以根据需要添加更多语言
};

// 语言提示词映射
const languagePrompts: { [key: string]: string } = {
    'zh': '请使用中文回答',
    'en': 'Please respond in English only',
    'ja': '日本語で回答してください',
    'ko': '한국어로 답변해 주세요',
    'fr': 'Veuillez répondre en français uniquement',
    'de': 'Bitte antworten Sie nur auf Deutsch',
    'es': 'Por favor, responda solo en español',
    'it': 'Si prega di rispondere solo in italiano',
    'ru': 'Пожалуйста, отвечайте только на русском языке',
    'ar': 'الرجاء الرد باللغة العربية فقط',
    'pl': 'Proszę odpowiadać tylko w języku polskim',
};

// 格式模板映射
const formatTemplates: { [key: string]: string } = {
    'zh': `# 字词解释
（解释重要字词的含义）

# 整体翻译
（用现代汉语翻译全文）

# 深入解读
（分析这段话的思想内涵和现实意义）

# 相关典故
（详细说明与这段文字相关的历史背景、典故和影响）`,

    'en': `# Word Analysis
(Explain the meaning of key words and phrases)

# Complete Translation
(Provide a complete translation of the text)

# In-depth Interpretation
(Analyze the philosophical meaning and practical significance)

# Historical Context
(Explain the historical background, allusions, and influence)`,

    'ja': `# 単語と語句の解説
（重要な単語や語句の意味を説明）

# 全文翻訳
（全文を現代日本語に翻訳）

# 詳細な解釈
（この文章の思想的な意味と現実的な意義を分析）

# 関連する故事
（この文章に関連する歴史的背景、故事、影響について詳しく説明）`,

    'pl': `# Analiza słów
(Wyjaśnienie znaczenia kluczowych słów i zwrotów)

# Pełne tłumaczenie
(Przekład całego tekstu)

# Szczegółowa interpretacja
(Analiza znaczenia filozoficznego i praktycznego)

# Kontekst historyczny
(Wyjaśnienie tła historycznego, aluzji i wpływów)`
};

const getFormatTemplate = (code: string | undefined): string => {
    if (!code) return formatTemplates['zh'];
    return formatTemplates[code.toLowerCase()] || formatTemplates['en'];
};

const getLanguageName = (code: string | undefined): string => {
    if (!code) return '中文';
    return languageMap[code.toLowerCase()] || code;
};

const AIDuide: React.FC<AIDuideProps> = ({ text, language }) => {
    const [explanation, setExplanation] = useState<string>('');
    const [relatedStories, setRelatedStories] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // 添加语言参数日志
    console.log('AIDuide组件接收到的语言参数:', language);
    console.log('当前语言映射:', languageMap[language || '']);

    const getLanguagePrompt = (code: string | undefined): string => {
        if (!code) return languagePrompts['zh'];
        const prompt = languagePrompts[code.toLowerCase()] || `Please respond only in ${getLanguageName(code)}`;
        console.log('获取到的语言提示:', prompt);
        return prompt;
    };

    const fetchAIData = async (): Promise<string> => {
        setIsLoading(true);
        setExplanation('');
        setRelatedStories('');
        
        try {
            const apiKey = import.meta.env.VITE_XINGHUO_API_KEY;
            const apiSecret = import.meta.env.VITE_XINGHUO_API_SECRET;
            const appId = import.meta.env.VITE_XINGHUO_APP_ID;
            if (!apiKey || !apiSecret || !appId) {
                throw new Error("API密钥未配置");
            }

            const host = "spark-api.xf-yun.com";
            const path = "/v1.1/chat";
            const now = new Date();
            const date = now.toUTCString();
            const algorithm = "hmac-sha256";
            const requestLine = "GET /v1.1/chat HTTP/1.1";

            const signatureOrigin = `host: ${host}\ndate: ${date}\n${requestLine}`;
            const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
            const signature = CryptoJS.enc.Base64.stringify(signatureSha);
            const authorizationOrigin = `api_key="${apiKey}",algorithm="${algorithm}",headers="host date request-line",signature="${signature}"`;
            const authorization = btoa(authorizationOrigin);
            const wsUrl = `wss://${host}${path}?authorization=${encodeURIComponent(authorization)}&date=${encodeURIComponent(date)}&host=${encodeURIComponent(host)}`;

            return new Promise((resolve, reject) => {
                const ws = new WebSocket(wsUrl);
                const timeout = setTimeout(() => {
                    ws.close();
                    reject(new Error('连接超时'));
                }, 10000);

                ws.onopen = () => {
                    clearTimeout(timeout);
                    const systemContent = language === 'zh' ? 
                        "你是一个专业的古文解读专家。请使用中文回答。" :
                        language === 'en' ? 
                        "You are a professional classical Chinese expert. RESPOND IN ENGLISH ONLY." :
                        language === 'ja' ?
                        "あなたは古典中国語の専門家です。日本語だけで回答してください。" :
                        `You are a professional classical Chinese expert. RESPOND IN ${getLanguageName(language)} ONLY.`;

                    console.log('发送请求前的语言设置:', language);
                    console.log('System Content:', systemContent);

                    const requestParams = {
                        header: {
                            app_id: appId,
                            uid: uuidv4().replace(/-/g, '').slice(0, 32),
                        },
                        parameter: {
                            chat: {
                                domain: "lite",
                                temperature: 0.5,
                                max_tokens: 2048,
                            },
                        },
                        payload: {
                            message: {
                                text: [
                                    {
                                        role: "system",
                                        content: language === 'zh' ? 
                                            "你是一个专业的古文解读专家。请使用中文回答。" :
                                            language === 'en' ? 
                                            "You are a professional classical Chinese expert. RESPOND IN ENGLISH ONLY." :
                                            language === 'ja' ?
                                            "あなたは古典中国語の専門家です。日本語だけで回答してください。" :
                                            `You are a professional classical Chinese expert. RESPOND IN ${getLanguageName(language)} ONLY.`
                                    },
                                    {
                                        role: "user",
                                        content: language === 'zh' ? 
`请分析这段古文：
"${text}"

要求：
1. 字词解释：说明重要字词的含义
2. 整体翻译：翻译全文
3. 深入解读：分析思想内涵和现实意义
4. 相关典故：说明历史背景和影响

必须用中文回答！` :

language === 'en' ? 
`Analyze this classical Chinese text:
"${text}"

Requirements:
1. Word Analysis: Explain key terms
2. Complete Translation: Translate the full text
3. Deep Interpretation: Analyze the philosophical meaning
4. Historical Context: Explain background and influence

RESPOND IN ENGLISH ONLY!` :

language === 'ja' ?
`この古典中国語の文章を分析してください：
"${text}"

要件：
1. 単語分析：重要な用語の説明
2. 全訳：全文の翻訳
3. 詳細な解釈：哲学的な意味の分析
4. 歴史的背景：背景と影響の説明

日本語だけで回答してください！` :

`Analyze this classical Chinese text:
"${text}"

Requirements:
1. Word Analysis
2. Complete Translation
3. Deep Interpretation
4. Historical Context

RESPOND IN ${getLanguageName(language)} ONLY!`
                                    }
                                ],
                            },
                        },
                    };

                    console.log('发送到API的完整请求参数:', JSON.stringify(requestParams, null, 2));
                    ws.send(JSON.stringify(requestParams));
                };

                let fullResponse = '';
                ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        console.log('收到API响应:', data);
                        if (data.header.code !== 0) {
                            reject(new Error(data.header.message || '请求失败'));
                            return;
                        }
                        if (data.payload && data.payload.choices && data.payload.choices.text) {
                            fullResponse += data.payload.choices.text[0].content;
                            if (data.header.status === 2) {
                                console.log('最终生成的回答:', fullResponse);
                                resolve(fullResponse);
                                ws.close();
                            }
                        }
                    } catch (err) {
                        reject(err);
                    }
                };

                ws.onerror = (error) => {
                    console.error('WebSocket错误:', error);
                    reject(new Error('WebSocket连接错误'));
                };
                ws.onclose = () => clearTimeout(timeout);
            });
        } catch (error) {
            console.error('API调用错误:', error);
            throw error;
        }
    };

    const handleGenerateAIGuide = async () => {
        try {
            setIsLoading(true);
            const response = await fetchAIData();
            
            // 将整个响应作为Markdown内容
            setExplanation(response);
            setRelatedStories(''); // 不再单独显示典故部分
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            setExplanation(`# 错误\n\nAI 导读生成失败：${errorMessage}`);
            setRelatedStories('');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">AI 导读</h3>
                <button
                    onClick={handleGenerateAIGuide}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded ${
                        isLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                >
                    {isLoading ? '生成中...' : '生成导读'}
                </button>
            </div>
            
            {!explanation && !isLoading && (
                <div className="text-center text-gray-500 py-8">
                    点击"生成导读"按钮开始分析文章
                </div>
            )}
            
            {isLoading && (
                <div className="text-center text-gray-500 py-8">
                    正在生成AI导读，请稍候...
                </div>
            )}
            
            {explanation && (
                <div className="prose max-w-none dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{explanation}</ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default AIDuide; 
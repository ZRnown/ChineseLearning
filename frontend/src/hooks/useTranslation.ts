import { useState } from 'react';
import axios from 'axios';

export const useTranslation = () => {
    const [translatedText, setTranslatedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const translate = async (text: string, targetLanguage: string) => {
        setLoading(true);
        setError('');
        try {
            // 使用与古籍详情页相同的 Gemini API 进行翻译
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDkCLl2WmZZtWKumwMOSq_79XK42qOiCUM', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `请将以下古文翻译成${targetLanguage}，保持原文的文学性和意境：

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
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                setTranslatedText(data.candidates[0].content.parts[0].text);
            } else {
                throw new Error('API响应格式不正确');
            }
        } catch (error) {
            console.error('翻译失败:', error);
            setError(error instanceof Error ? error.message : '翻译请求失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    return { translatedText, loading, error, translate };
};
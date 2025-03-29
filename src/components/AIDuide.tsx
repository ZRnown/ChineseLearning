import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
import { languageMap, languagePrompts } from '../config/languages';

interface AIDuideProps {
    text: string;
    language: string;
}

const AIDuide: React.FC<AIDuideProps> = ({ text, language }) => {
    const [explanation, setExplanation] = useState<string>('');
    const [relatedStories, setRelatedStories] = useState<string>('');

    useEffect(() => {
        const fetchAIData = async () => {
            const apiKey = process.env.REACT_APP_XINGHUO_API_KEY;
            const apiSecret = process.env.REACT_APP_XINGHUO_API_SECRET;
            const appId = process.env.REACT_APP_XINGHUO_APP_ID;
            if (!apiKey || !apiSecret || !appId) {
                console.error("API key, secret, or app ID not found. Make sure to set them in your environment variables.");
                return;
            }

            const host = "spark-api.xfyun.cn";
            const path = "/v1.1/chat";
            const algorithm = "hmac-sha256";
            const signHeader = "host date request-line";
            const signatureOrigin = `host: ${host}\ndate: ${new Date().toUTCString()}\nGET ${path} HTTP/1.1`;

            const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
            const signature = CryptoJS.enc.Base64.stringify(signatureSha);

            const authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${signHeader}", signature="${signature}"`;
            const authorization = btoa(authorizationOrigin);

            const wsUrl = `wss://${host}${path}?authorization=${authorization}&date=${new Date().toUTCString()}&host=${host}`;

            let ws: WebSocket | null = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log("WebSocket connected");
                const requestParams = {
                    header: {
                        app_id: appId,
                        uid: uuidv4(),
                    },
                    parameter: {
                        chat: {
                            domain: "general",
                            temperature: 0.5,
                            max_tokens: 1024,
                        },
                    },
                    payload: {
                        message: {
                            text: [
                                {
                                    role: "user",
                                    content: `请用${languageMap[language] || language}解释以下古籍原文，并提供相关的典故：\n${text}`,
                                },
                            ],
                        },
                    },
                };

                if (ws) {
                    ws.send(JSON.stringify(requestParams));
                }
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.payload && data.payload.choices && data.payload.choices.text) {
                    const aiResponse = data.payload.choices.text[0].content;
                    // 分割解释和典故
                    const [exp, stories] = aiResponse.split('典故:');
                    setExplanation(exp ? exp.replace('解释:', '').trim() : aiResponse);
                    setRelatedStories(stories ? stories.trim() : '暂无相关典故');
                } else if (data.header && data.header.code !== 0) {
                    console.error("Xinghuo API error:", data);
                    setExplanation('AI 导读生成失败，请稍后重试。');
                    setRelatedStories('AI 导读生成失败，请稍后重试。');
                    ws?.close();
                }
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
                setExplanation('AI 导读生成失败，请检查网络连接。');
                setRelatedStories('AI 导读生成失败，请检查网络连接。');
            };

            ws.onclose = () => {
                console.log("WebSocket closed");
                ws = null;
            };

            return () => {
                if (ws) {
                    ws.close();
                }
            };
        };

        fetchAIData();
    }, [text, language]);

    return (
        <div>
            <h3>AI 导读</h3>
            <div>
                <h4>原文解释</h4>
                <p>{explanation}</p>
            </div>
            <div>
                <h4>相关典故</h4>
                <p>{relatedStories}</p>
            </div>
        </div>
    );
};

export default AIDuide;

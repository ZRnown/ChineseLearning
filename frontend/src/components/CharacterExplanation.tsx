import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/CharacterExplanation.css';

interface CharacterData {
    word: string;
    traditional: string;
    pinyin: string;
    radicals: string;
    explanation: string;
    strokes: string;
}

interface CharacterExplanationProps {
    character: string;
    onClose: () => void;
}

const CharacterExplanation: React.FC<CharacterExplanationProps> = ({ character, onClose }) => {
    const [data, setData] = useState<CharacterData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const lastRequestRef = useRef<number>(0);

    useEffect(() => {
        const fetchCharacterData = async () => {
            const now = Date.now();
            // 如果距离上次请求不到1秒，则忽略这次请求
            if (now - lastRequestRef.current < 1000) {
                return;
            }
            lastRequestRef.current = now;

            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('https://www.mxnzp.com/api/convert/dictionary', {
                    params: {
                        content: character,
                        app_id: 'rsqlozirsedk8egs',
                        app_secret: 'utI362fFYXO1o64rmmFgEzpbz3lLCbY9'
                    }
                });

                // 忽略频率限制的错误响应
                if (response.data.code === 101) {
                    return;
                }

                if (response.data && response.data.code === 1 && response.data.data && response.data.data.length > 0) {
                    const characterData = response.data.data[0];
                    if (characterData.word && characterData.explanation) {
                        setData(characterData);
                    } else {
                        setError('数据格式不完整');
                    }
                } else {
                    setError('未找到该字的释义');
                }
            } catch (err) {
                console.error('Error fetching character data:', err);
                setError('获取字义失败，请稍后重试');
            } finally {
                setLoading(false);
            }
        };

        if (character) {
            fetchCharacterData();
        }
    }, [character]);

    return (
        <div className="character-explanation-modal">
            <div className="character-explanation-content">
                <button className="close-button" onClick={onClose}>×</button>
                {loading ? (
                    <div className="loading">加载中...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : data ? (
                    <div className="character-info">
                        <h2>{data.word}</h2>
                        <div className="info-row">
                            <span className="label">繁体：</span>
                            <span>{data.traditional}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">拼音：</span>
                            <span>{data.pinyin}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">部首：</span>
                            <span>{data.radicals}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">笔画：</span>
                            <span>{data.strokes}</span>
                        </div>
                        <div className="explanation">
                            <h3>释义</h3>
                            <p>{data.explanation}</p>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default CharacterExplanation; 
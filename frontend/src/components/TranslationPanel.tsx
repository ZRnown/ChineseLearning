import React, { useState, useEffect } from 'react';
import { ArrowsRightLeftIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

interface TranslationPanelProps {
    className?: string;
    initialSourceText?: string;
    initialSourceLang?: string;
    initialTargetLang?: string;
}

interface Language {
    code: string;
    name: string;
}

const languages: Language[] = [
    { code: 'zh', name: '中文' },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
];

export default function TranslationPanel({
    className = '',
    initialSourceText = '',
    initialSourceLang = 'zh',
    initialTargetLang = 'en',
}: TranslationPanelProps) {
    const [sourceText, setSourceText] = useState(initialSourceText);
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState(initialSourceLang);
    const [targetLang, setTargetLang] = useState(initialTargetLang);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (initialSourceText) {
            setSourceText(initialSourceText);
        }
        if (initialSourceLang) {
            setSourceLang(initialSourceLang);
        }
        if (initialTargetLang) {
            setTargetLang(initialTargetLang);
        }
    }, [initialSourceText, initialSourceLang, initialTargetLang]);

    const handleTranslate = async () => {
        if (!sourceText.trim()) return;

        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8000/api/translations/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: sourceText,
                    source_lang: sourceLang,
                    target_lang: targetLang,
                }),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('翻译失败，请稍后重试');
            }

            const data = await response.json();
            setTranslatedText(data.translated_text);
        } catch (error) {
            console.error('Translation error:', error);
            setError(error instanceof Error ? error.message : '翻译失败，请稍后重试');
        } finally {
            setIsLoading(false);
        }
    };

    const switchLanguages = () => {
        const temp = sourceLang;
        setSourceLang(targetLang);
        setTargetLang(temp);
        setSourceText(translatedText);
        setTranslatedText(sourceText);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(translatedText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    const getWordCount = (text: string) => {
        return text.trim().length;
    };

    return (
        <div className={`bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 ${className}`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="w-full sm:w-auto bg-white rounded-md border border-gray-300 px-3 py-1"
                >
                    {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.name}
                        </option>
                    ))}
                </select>

                <button
                    onClick={switchLanguages}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowsRightLeftIcon className="h-5 w-5 text-gray-600" />
                </button>

                <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full sm:w-auto bg-white rounded-md border border-gray-300 px-3 py-1"
                >
                    {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                    <textarea
                        value={sourceText}
                        onChange={(e) => setSourceText(e.target.value)}
                        placeholder="请输入要翻译的文本..."
                        className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none"
                    />
                    <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                        {getWordCount(sourceText)} 字
                    </div>
                </div>

                <button
                    onClick={handleTranslate}
                    disabled={isLoading || !sourceText.trim()}
                    className={`
                        w-full py-2 px-4 rounded-lg text-white font-medium
                        ${isLoading || !sourceText.trim()
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'}
                        transition-colors relative
                    `}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            翻译中...
                        </span>
                    ) : '翻译'}
                </button>

                {error && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="relative">
                    <textarea
                        value={translatedText}
                        readOnly
                        placeholder="翻译结果将显示在这里..."
                        className="w-full h-32 p-3 border border-gray-300 rounded-lg bg-gray-50 resize-none"
                    />
                    {translatedText && (
                        <button
                            onClick={handleCopy}
                            className="absolute bottom-2 right-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            {copied ? (
                                <CheckIcon className="h-5 w-5 text-green-600" />
                            ) : (
                                <ClipboardIcon className="h-5 w-5 text-gray-600" />
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
} 
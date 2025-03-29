import React from 'react';
import { BiGlobe } from 'react-icons/bi';

interface LanguageSelectorProps {
    selectedLanguage: string;
    onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onLanguageChange }) => {
    const languages = [
        { code: 'zh', name: '中文' },
        { code: 'en', name: 'English' },
        { code: 'ja', name: '日本語' },
        { code: 'ko', name: '한국어' },
        { code: 'fr', name: 'Français' },
        { code: 'de', name: 'Deutsch' },
        { code: 'es', name: 'Español' },
        { code: 'ru', name: 'Русский' }
    ];

    return (
        <div className="space-y-2">
            <label className="flex items-center text-[#2c3e50] font-medium">
                <BiGlobe className="mr-2" />
                选择翻译语言
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => onLanguageChange(lang.code)}
                        className={`p-3 rounded-lg text-center transition-all duration-300 ${selectedLanguage === lang.code
                                ? 'bg-[#8b4513] text-white shadow-md'
                                : 'bg-[#f8f5f0] text-[#2c3e50] hover:bg-[#e8e4e0] border border-[#e8e4e0]'
                            }`}
                    >
                        {lang.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LanguageSelector; 
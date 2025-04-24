import React from 'react';
import '../styles/AuthorIntroduction.css';

interface AuthorIntroductionProps {
    isOpen: boolean;
    onClose: () => void;
    author: string;
    introduction: string;
    selectedLanguage?: string;
    translatedIntroduction?: string;
}

const AuthorIntroduction: React.FC<AuthorIntroductionProps> = ({
    isOpen,
    onClose,
    author,
    introduction,
    selectedLanguage = 'zh',
    translatedIntroduction,
}) => {
    if (!isOpen) return null;

    // 根据选择的语言决定显示原文还是翻译
    const displayText = selectedLanguage !== 'zh' && translatedIntroduction
        ? translatedIntroduction
        : introduction;

    return (
        <div className="author-introduction-modal">
            <div className="author-introduction-content">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>{author} {selectedLanguage === 'zh' ? '简介' : 'Introduction'}</h2>
                <div className="author-introduction-text">
                    {displayText || '暂无作者介绍'}
                </div>
            </div>
        </div>
    );
};

export default AuthorIntroduction;

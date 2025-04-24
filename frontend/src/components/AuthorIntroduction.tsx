import React from 'react';
import '../styles/AuthorIntroduction.css';

interface AuthorIntroductionProps {
    isOpen: boolean;
    onClose: () => void;
    author: string;
    introduction: string;
    isLoading?: boolean;
}

const AuthorIntroduction: React.FC<AuthorIntroductionProps> = ({
    isOpen,
    onClose,
    author,
    introduction,
    isLoading = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="work-explanation-modal author-introduction-modal">
            <div className="work-explanation-content author-introduction-content">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>《{author}》 作者简介</h2>
                <div className="work-explanation-text author-introduction-text">
                    {isLoading ? (
                        <div className="loading-indicator">加载中...</div>
                    ) : (
                        introduction || '暂无作者介绍'
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthorIntroduction;

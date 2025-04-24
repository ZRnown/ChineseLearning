import React from 'react';
import '../styles/WorkExplanation.css';

interface WorkExplanationProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    explanation: string;
    isLoading?: boolean;
}

const WorkExplanation: React.FC<WorkExplanationProps> = ({
    isOpen,
    onClose,
    title,
    explanation,
    isLoading = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="work-explanation-modal">
            <div className="work-explanation-content">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>《{title}》 作品解析</h2>
                <div className="work-explanation-text">
                    {isLoading ? (
                        <div className="loading-indicator">加载中...</div>
                    ) : (
                        explanation || '暂无作品解析'
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkExplanation; 
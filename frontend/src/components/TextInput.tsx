import React from 'react';
import { BiSend } from 'react-icons/bi';

interface TextInputProps {
    text: string;
    onTextChange: (text: string) => void;
    onTranslate: (text: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ text, onTextChange, onTranslate }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onTranslate(text);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
                <textarea
                    value={text}
                    onChange={(e) => onTextChange(e.target.value)}
                    placeholder="请输入要翻译的古文..."
                    className="w-full h-48 p-4 text-lg border border-[#e8e4e0] rounded-lg bg-[#f8f5f0] focus:outline-none focus:ring-2 focus:ring-[#8b4513] focus:border-transparent resize-none font-serif"
                />
                <button
                    type="submit"
                    disabled={!text.trim()}
                    className={`absolute bottom-4 right-4 p-2 rounded-full transition-all duration-300 ${text.trim()
                            ? 'bg-[#8b4513] hover:bg-[#6b3410] text-white shadow-md hover:shadow-lg'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    <BiSend className="w-6 h-6" />
                </button>
            </div>
            <div className="text-sm text-[#666] text-right">
                字数：{text.length}
            </div>
        </form>
    );
};

export default TextInput; 
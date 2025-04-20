import React from 'react';

interface PinyinTextProps {
  text: string;
  pinyin: string[][];
  showPinyin: boolean;
  className?: string;
}

const PinyinText: React.FC<PinyinTextProps> = ({ 
  text, 
  pinyin, 
  showPinyin, 
  className = '' 
}) => {
  if (!showPinyin) {
    return <span className={className}>{text}</span>;
  }

  return (
    <div className={`flex flex-wrap ${className}`}>
      {text.split('').map((char, index) => {
        // 检查是否有对应的拼音
        const pinyinForChar = pinyin[index] ? pinyin[index][0] : '';
        
        // 如果是标点符号或空格，不显示拼音
        const isPunctuation = /[\p{P}\s]/u.test(char);
        
        return (
          <div key={index} className="inline-flex flex-col items-center mx-0.5">
            {!isPunctuation && showPinyin && (
              <span className="text-xs text-gray-500 mb-0.5">{pinyinForChar}</span>
            )}
            <span className={isPunctuation ? "mx-0.5" : ""}>{char}</span>
          </div>
        );
      })}
    </div>
  );
};

export default PinyinText;
import React, { useState, useEffect } from 'react';
import { BiSun, BiMoon, BiBook, BiCheck } from 'react-icons/bi';
import useDarkMode from '../hooks/useDarkMode';

const Settings: React.FC = () => {
    const { darkMode, setDarkMode } = useDarkMode();
    const [bodyFontSize, setBodyFontSize] = useState<number>(16);
    const [titleFontSize, setTitleFontSize] = useState<number>(24);

    // 从localStorage加载字体设置
    useEffect(() => {
        const savedBodyFontSize = localStorage.getItem('bodyFontSize');
        const savedTitleFontSize = localStorage.getItem('titleFontSize');

        if (savedBodyFontSize) setBodyFontSize(parseInt(savedBodyFontSize));
        if (savedTitleFontSize) setTitleFontSize(parseInt(savedTitleFontSize));

        // 应用字体设置
        applyFontSettings(
            savedBodyFontSize ? parseInt(savedBodyFontSize) : 16,
            savedTitleFontSize ? parseInt(savedTitleFontSize) : 24
        );
    }, []);

    // 应用字体设置到文档
    const applyFontSettings = (body: number, title: number) => {
        document.documentElement.style.setProperty('--body-font-size', `${body}px`);
        document.documentElement.style.setProperty('--title-font-size', `${title}px`);
    };

    // 处理字体大小变化
    const handleBodyFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const size = parseInt(e.target.value);
        setBodyFontSize(size);
        document.documentElement.style.setProperty('--body-font-size', `${size}px`);
    };

    const handleTitleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const size = parseInt(e.target.value);
        setTitleFontSize(size);
        document.documentElement.style.setProperty('--title-font-size', `${size}px`);
    };

    const handleSaveSettings = () => {
        // 保存字体设置到localStorage
        localStorage.setItem('bodyFontSize', bodyFontSize.toString());
        localStorage.setItem('titleFontSize', titleFontSize.toString());

        // 保存设置的逻辑
        alert('设置已保存！');
    };

    return (
        <div className="min-h-screen bg-[#f8f5f0] dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="w-[65%] mx-auto space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-[#e8e4e0] dark:border-gray-700 transition-colors duration-200">
                    <h2 className="text-2xl font-bold text-[#2c3e50] dark:text-gray-100 font-serif mb-8 transition-colors duration-200">设置</h2>

                    {/* 主题设置 */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-[#2c3e50] dark:text-gray-200 mb-4 flex items-center transition-colors duration-200">
                            {darkMode ? <BiMoon className="mr-2 text-indigo-400" /> : <BiSun className="mr-2 text-yellow-500" />}
                            主题设置
                        </h3>
                        <div className="flex items-center space-x-4">
                            <button
                                className={`p-4 rounded-lg flex flex-col items-center space-y-2 border transition-all duration-200 ${!darkMode
                                    ? 'bg-yellow-50 border-yellow-500 ring-2 ring-yellow-500 text-[#2c3e50]'
                                    : 'bg-[#f8f5f0] dark:bg-gray-700 text-[#2c3e50] dark:text-gray-300 border-[#e8e4e0] dark:border-gray-600 hover:bg-[#e8e4e0] dark:hover:bg-gray-600'
                                    }`}
                                onClick={() => setDarkMode(false)}
                            >
                                <BiSun className="w-8 h-8 text-yellow-500" />
                                <span className="text-sm font-medium">浅色模式</span>
                                {!darkMode && <BiCheck className="absolute top-2 right-2 text-yellow-500 w-5 h-5" />}
                            </button>
                            <button
                                className={`p-4 rounded-lg flex flex-col items-center space-y-2 border transition-all duration-200 ${darkMode
                                    ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 ring-2 ring-indigo-500 text-[#2c3e50] dark:text-gray-200'
                                    : 'bg-[#f8f5f0] dark:bg-gray-700 text-[#2c3e50] dark:text-gray-300 border-[#e8e4e0] dark:border-gray-600 hover:bg-[#e8e4e0] dark:hover:bg-gray-600'
                                    }`}
                                onClick={() => setDarkMode(true)}
                            >
                                <BiMoon className="w-8 h-8 text-indigo-400" />
                                <span className="text-sm font-medium">深色模式</span>
                                {darkMode && <BiCheck className="absolute top-2 right-2 text-indigo-400 w-5 h-5" />}
                            </button>
                        </div>
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 italic">
                            深色模式对眼睛更友好，适合夜间阅读
                        </p>
                    </div>

                    {/* 字体设置 */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-[#2c3e50] dark:text-gray-200 mb-4 flex items-center transition-colors duration-200">
                            <BiBook className="mr-2 text-[#8b4513] dark:text-[#d9c9a3]" />
                            字体设置
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[#666] dark:text-gray-300 transition-colors duration-200">正文字体大小</span>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-[#666] dark:text-gray-400">小</span>
                                    <input
                                        type="range"
                                        min="12"
                                        max="20"
                                        value={bodyFontSize}
                                        onChange={handleBodyFontSizeChange}
                                        className="w-48 h-2 bg-[#e8e4e0] dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[#8b4513] dark:accent-[#d9c9a3]"
                                    />
                                    <span className="text-sm text-[#666] dark:text-gray-400">大</span>
                                </div>
                                <span className="text-[#666] dark:text-gray-400 min-w-[30px] text-right">{bodyFontSize}px</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[#666] dark:text-gray-300 transition-colors duration-200">标题字体大小</span>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-[#666] dark:text-gray-400">小</span>
                                    <input
                                        type="range"
                                        min="16"
                                        max="32"
                                        value={titleFontSize}
                                        onChange={handleTitleFontSizeChange}
                                        className="w-48 h-2 bg-[#e8e4e0] dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[#8b4513] dark:accent-[#d9c9a3]"
                                    />
                                    <span className="text-sm text-[#666] dark:text-gray-400">大</span>
                                </div>
                                <span className="text-[#666] dark:text-gray-400 min-w-[30px] text-right">{titleFontSize}px</span>
                            </div>
                        </div>
                    </div>

                    {/* 保存按钮 */}
                    <button
                        onClick={handleSaveSettings}
                        className="w-full py-3 px-4 bg-[#8b4513] dark:bg-[#d9c9a3]/80 text-white dark:text-gray-900 rounded-lg hover:bg-[#6b3410] dark:hover:bg-[#d9c9a3] transition-colors duration-200 shadow-md hover:shadow-lg font-medium"
                    >
                        保存设置
                    </button>
                </div>

                {/* 预览效果 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-[#e8e4e0] dark:border-gray-700 transition-colors duration-200">
                    <h3 className="text-xl font-bold text-[#2c3e50] dark:text-gray-100 font-serif mb-4 transition-colors duration-200" style={{ fontSize: `${titleFontSize}px` }}>
                        当前主题预览
                    </h3>
                    <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-[#f8f5f0] text-[#2c3e50]'} transition-colors duration-200`}>
                        <h4 className={`text-lg font-medium mb-3 ${darkMode ? 'text-[#d9c9a3]' : 'text-[#8b4513]'}`} style={{ fontSize: `${titleFontSize * 0.75}px` }}>
                            《静夜思》 - 李白
                        </h4>
                        <p className="mb-4 leading-relaxed" style={{ fontSize: `${bodyFontSize}px` }}>
                            床前明月光，疑是地上霜。<br />
                            举头望明月，低头思故乡。
                        </p>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontSize: `${bodyFontSize * 0.875}px` }}>
                            这首诗描述了诗人在月夜思念家乡的情景，表达了游子思乡之情。
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings; 
import React from 'react';
import { BiSun, BiMoon, BiGlobe, BiBook } from 'react-icons/bi';

const Settings: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#f8f5f0] py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-[65%] mx-auto space-y-8">
                <div className="bg-white rounded-lg shadow-lg p-8 border border-[#e8e4e0]">
                    <h2 className="text-2xl font-bold text-[#2c3e50] font-serif mb-8">设置</h2>

                    {/* 主题设置 */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-[#2c3e50] mb-4 flex items-center">
                            <BiSun className="mr-2" />
                            主题设置
                        </h3>
                        <div className="flex items-center space-x-4">
                            <button className="p-3 rounded-lg bg-[#f8f5f0] text-[#2c3e50] border border-[#e8e4e0] hover:bg-[#e8e4e0] transition-colors">
                                <BiSun className="w-6 h-6" />
                            </button>
                            <button className="p-3 rounded-lg bg-[#f8f5f0] text-[#2c3e50] border border-[#e8e4e0] hover:bg-[#e8e4e0] transition-colors">
                                <BiMoon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* 语言设置 */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-[#2c3e50] mb-4 flex items-center">
                            <BiGlobe className="mr-2" />
                            语言设置
                        </h3>
                        <select className="w-full p-3 rounded-lg bg-[#f8f5f0] text-[#2c3e50] border border-[#e8e4e0] focus:outline-none focus:ring-2 focus:ring-[#8b4513] focus:border-transparent">
                            <option value="zh">简体中文</option>
                            <option value="en">English</option>
                            <option value="ja">日本語</option>
                        </select>
                    </div>

                    {/* 字体设置 */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-[#2c3e50] mb-4 flex items-center">
                            <BiBook className="mr-2" />
                            字体设置
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[#666]">正文字体大小</span>
                                <input
                                    type="range"
                                    min="12"
                                    max="20"
                                    defaultValue="16"
                                    className="w-48 h-2 bg-[#e8e4e0] rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[#666]">标题字体大小</span>
                                <input
                                    type="range"
                                    min="16"
                                    max="32"
                                    defaultValue="24"
                                    className="w-48 h-2 bg-[#e8e4e0] rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 保存按钮 */}
                    <button className="w-full py-3 px-4 bg-[#8b4513] text-white rounded-lg hover:bg-[#6b3410] transition-colors shadow-md hover:shadow-lg">
                        保存设置
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings; 
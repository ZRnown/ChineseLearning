import React from 'react';
import { Link } from 'react-router-dom';
import { BiBook, BiGlobe, BiBookmark, BiHistory } from 'react-icons/bi';

const features = [
    {
        icon: <BiBook className="w-8 h-8" />,
        title: '古籍导读',
        description: '探索中华文化瑰宝，感受古典文学的魅力',
        link: '/classics'
    },
    {
        icon: <BiGlobe className="w-8 h-8" />,
        title: '多语言翻译',
        description: '支持多种语言翻译，让古典文学走向世界',
        link: '/translation'
    },
    {
        icon: <BiBookmark className="w-8 h-8" />,
        title: '收藏夹',
        description: '收藏喜爱的古籍，随时重温经典',
        link: '/favorites'
    },
    {
        icon: <BiHistory className="w-8 h-8" />,
        title: '历史记录',
        description: '记录阅读历史，追踪学习进度',
        link: '/history'
    }
];

const Home: React.FC = () => {
    return (
        <div className="space-y-12">
            {/* 欢迎区域 */}
            <div className="text-center py-12">
                <h1 className="text-4xl font-bold text-[#2c3e50] font-serif mb-4">古文导读</h1>
                <p className="text-xl text-[#666] mb-8">让古典文学焕发新生，让智慧跨越时空</p>
                <Link
                    to="/classics"
                    className="inline-block px-8 py-3 bg-[#8b4513] text-white rounded-lg hover:bg-[#6b3410] transition-colors"
                >
                    开始导读
                </Link>
            </div>

            {/* 功能区域 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                    <Link
                        key={index}
                        to={feature.link}
                        className="bg-white rounded-lg shadow-lg p-6 border border-[#e8e4e0] hover:shadow-xl transition-shadow"
                    >
                        <div className="text-[#8b4513] mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-bold text-[#2c3e50] font-serif mb-2">{feature.title}</h3>
                        <p className="text-[#666]">{feature.description}</p>
                    </Link>
                ))}
            </div>

            {/* 使用说明 */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-[#e8e4e0]">
                <h2 className="text-2xl font-bold text-[#2c3e50] font-serif mb-4">使用说明</h2>
                <div className="space-y-4 text-[#666]">
                    <p>1. 点击"开始导读"进入古籍列表</p>
                    <p>2. 选择感兴趣的古籍进行阅读</p>
                    <p>3. 在古籍详情页面可以：</p>
                    <ul className="list-disc list-inside ml-4">
                        <li>查看原文内容</li>
                        <li>选择不同语言进行翻译</li>
                        <li>使用 AI 导读功能获取深入解析</li>
                        <li>收藏喜爱的古籍</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Home; 
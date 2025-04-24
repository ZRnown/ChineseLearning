import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiBook, BiGlobe, BiBookmark, BiHistory, BiCommentDetail, BiHeadphone, BiBookReader, BiSearch, BiChevronDown, BiChevronUp } from 'react-icons/bi';

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

// 定义使用说明部分的数据
const instructionSections = [
    {
        id: 'browse',
        title: '浏览与查找古籍',
        summary: '探索古籍列表，通过朝代、类别或关键词搜索查找您感兴趣的作品。',
        content: (
            <>
                <p className="mb-2">1. 点击"开始导读"或导航栏中的"古籍列表"，进入古籍浏览页面。</p>
                <p className="mb-2">2. 您可以通过以下方式筛选古籍：</p>
                <ul className="list-disc list-inside ml-6 space-y-1">
                    <li>按朝代筛选（唐代、宋代、明代等）</li>
                    <li>按类别筛选（诗词、散文、词等）</li>
                    <li>使用搜索框按标题、作者或内容关键词搜索</li>
                </ul>
                <p className="mt-2">3. 点击任意古籍卡片进入详细阅读页面。</p>
            </>
        )
    },
    {
        id: 'read',
        title: '阅读与学习功能',
        summary: '通过拼音标注、词汇解释、朗读功能等多种方式增强您的阅读体验。',
        content: (
            <>
                <p className="mb-2">在古籍详情页面，您可以使用以下功能增强阅读体验：</p>
                <ul className="list-disc list-inside ml-6 space-y-1">
                    <li><strong>拼音标注：</strong> 点击上方的拼音按钮，为文本添加拼音注解</li>
                    <li><strong>词汇解释：</strong> 点击任意汉字，查看该字的详细解释和用法</li>
                    <li><strong>作者简介：</strong> 点击作者名字，了解作者生平和创作背景</li>
                    <li><strong>作品解析：</strong> 点击作品标题，获取专业的作品内容解析</li>
                    <li><strong>朗读功能：</strong> 点击播放按钮，聆听优美的古文朗读，可调整语速和音调</li>
                </ul>
            </>
        )
    },
    {
        id: 'translate',
        title: '翻译与理解',
        summary: '利用多语言翻译和AI导读功能深入理解古典文学内容。',
        content: (
            <>
                <p className="mb-2">我们提供多种辅助理解工具：</p>
                <ul className="list-disc list-inside ml-6 space-y-1">
                    <li><strong>多语言翻译：</strong> 选择您需要的语言（支持超过30种语言），点击翻译按钮获取翻译结果</li>
                    <li><strong>AI导读：</strong> 点击AI导读按钮，获取智能分析的内容概要、写作背景和文学赏析</li>
                    <li><strong>互动对话：</strong> 在对话框中提问，与AI助手深入交流对文本的疑问和理解</li>
                </ul>
            </>
        )
    },
    {
        id: 'personal',
        title: '个性化功能',
        summary: '收藏喜爱的作品，记录阅读历史，获得个性化学习体验。',
        content: (
            <>
                <p className="mb-2">登录后，您可以使用以下个性化功能：</p>
                <ul className="list-disc list-inside ml-6 space-y-1">
                    <li><strong>收藏功能：</strong> 点击心形图标，将喜爱的古籍加入收藏夹</li>
                    <li><strong>阅读历史：</strong> 系统自动记录您的阅读历史，便于继续学习</li>
                    <li><strong>AI智能对话：</strong> 根据您的学习进度和兴趣，获得个性化的AI辅导和解答</li>
                    <li><strong>多设备同步：</strong> 在不同设备上继续您的学习，收藏和历史记录自动同步</li>
                </ul>
            </>
        )
    },
    {
        id: 'tips',
        title: '学习建议',
        summary: '遵循专业学习路径，循序渐进地探索古典文学的魅力。',
        content: (
            <>
                <p className="mb-2">为了获得最佳学习效果，我们建议：</p>
                <ul className="list-disc list-inside ml-6 space-y-1">
                    <li>先阅读原文，尝试自行理解</li>
                    <li>使用拼音辅助正确读音</li>
                    <li>点击不理解的字词查看解释</li>
                    <li>查看翻译帮助理解全文</li>
                    <li>通过AI导读深入了解文学价值</li>
                    <li>最后使用朗读功能感受语言之美</li>
                </ul>
            </>
        )
    }
];

// 可折叠的部分组件
interface CollapsibleSectionProps {
    title: string;
    summary: string;
    children: React.ReactNode;
    isOpen: boolean;
    toggleOpen: () => void;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, summary, children, isOpen, toggleOpen }) => {
    return (
        <div className="border-b border-[#e8e4e0] dark:border-gray-700 py-3 transition-colors duration-200">
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={toggleOpen}
            >
                <div>
                    <h3 className="text-xl font-bold text-[#2c3e50] dark:text-gray-200 mb-1 transition-colors duration-200">{title}</h3>
                    {!isOpen && <p className="text-[#666] dark:text-gray-400 transition-colors duration-200">{summary}</p>}
                </div>
                <div className="text-[#8b4513] dark:text-[#d9c9a3] text-xl transition-colors duration-200">
                    {isOpen ? <BiChevronUp /> : <BiChevronDown />}
                </div>
            </div>

            {isOpen && (
                <div className="mt-3 border-l-4 border-[#8b4513] dark:border-[#d9c9a3] pl-4 py-2 transition-colors duration-200">
                    {children}
                </div>
            )}
        </div>
    );
};

const Home: React.FC = () => {
    // 使用状态管理每个部分的展开/折叠状态
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    // 切换某个部分的展开/折叠状态
    const toggleSection = (id: string) => {
        setOpenSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // 展开/折叠所有部分
    const [allExpanded, setAllExpanded] = useState(false);
    const toggleAllSections = () => {
        if (allExpanded) {
            // 全部折叠
            setOpenSections({});
        } else {
            // 全部展开
            const allOpen: Record<string, boolean> = {};
            instructionSections.forEach(section => {
                allOpen[section.id] = true;
            });
            setOpenSections(allOpen);
        }
        setAllExpanded(!allExpanded);
    };

    const useInstructions = [
        {
            title: '阅读原文',
            description: '选择感兴趣的古文，系统会展示原文内容。您可以开启拼音功能，辅助阅读。',
            icon: '📖'
        },
        {
            title: '释义模式',
            description: '进入释义模式后，点击任意汉字可以查看详细解释，包括字的意思、读音和部首结构。',
            icon: '🔍'
        },
        {
            title: '朗读功能',
            description: '进入朗读模式后，点击朗读按钮可以聆听古文朗读。您可以调整语速、音调和声音，或点击特定句子从该处开始朗读。',
            icon: '🔊'
        },
        {
            title: '智能翻译',
            description: '选择目标语言，系统会将古文翻译成现代文字，保留原文的文学性和意境。支持多种语言。',
            icon: '🌐'
        },
        {
            title: 'AI导读',
            description: '点击AI导读按钮，系统会分析文章内容，提供背景知识、文学价值和重要字词解释。',
            icon: '📚'
        },
        {
            title: '智能对话',
            description: '如果您对文章有疑问，可以直接在聊天框提问，AI助手会根据文章内容给您专业解答。',
            icon: '💬'
        },
        {
            title: '收藏功能',
            description: '喜欢的文章可以收藏，方便下次快速查看。登录后，您的收藏将跨设备同步。',
            icon: '⭐'
        }
    ];

    return (
        <div className="space-y-12">
            {/* 欢迎区域 */}
            <div className="text-center py-12">
                <h1 className="text-4xl font-bold text-[#2c3e50] dark:text-gray-100 font-serif mb-4 transition-colors duration-200">古文导读</h1>
                <p className="text-xl text-[#666] dark:text-gray-300 mb-8 transition-colors duration-200">让古典文学焕发新生，让智慧跨越时空</p>
                <Link
                    to="/classics"
                    className="inline-block px-8 py-3 bg-[#8b4513] dark:bg-[#d9c9a3]/80 text-white dark:text-gray-900 rounded-lg hover:bg-[#6b3410] dark:hover:bg-[#d9c9a3] transition-colors duration-200 shadow-md"
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
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-[#e8e4e0] dark:border-gray-700 hover:shadow-xl transition-all duration-200"
                    >
                        <div className="text-[#8b4513] dark:text-[#d9c9a3] mb-4 transition-colors duration-200">{feature.icon}</div>
                        <h3 className="text-xl font-bold text-[#2c3e50] dark:text-gray-100 font-serif mb-2 transition-colors duration-200">{feature.title}</h3>
                        <p className="text-[#666] dark:text-gray-300 transition-colors duration-200">{feature.description}</p>
                    </Link>
                ))}
            </div>

            {/* 使用说明 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-[#e8e4e0] dark:border-gray-700 transition-colors duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#2c3e50] dark:text-gray-100 font-serif transition-colors duration-200">使用说明</h2>
                    <button
                        onClick={toggleAllSections}
                        className="text-sm px-3 py-1 bg-[#f5f2e8] dark:bg-gray-700 text-[#8b4513] dark:text-[#d9c9a3] rounded border border-[#d9c9a3] dark:border-gray-600 hover:bg-[#e8e4e0] dark:hover:bg-gray-600 flex items-center transition-colors duration-200"
                    >
                        {allExpanded ? '全部折叠' : '全部展开'}
                        {allExpanded ? <BiChevronUp className="ml-1" /> : <BiChevronDown className="ml-1" />}
                    </button>
                </div>

                <div className="space-y-1">
                    {instructionSections.map(section => (
                        <CollapsibleSection
                            key={section.id}
                            title={section.title}
                            summary={section.summary}
                            isOpen={!!openSections[section.id]}
                            toggleOpen={() => toggleSection(section.id)}
                        >
                            {section.content}
                        </CollapsibleSection>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home; 
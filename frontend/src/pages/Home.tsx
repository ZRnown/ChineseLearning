import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">
                        中国古典文学学习平台
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        探索中国古典文学的魅力，感受传统文化的精髓
                    </p>
                    <div className="space-x-4">
                        <Link
                            to="/classics"
                            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            浏览古籍
                        </Link>
                        <Link
                            to="/login"
                            className="inline-block bg-white text-green-600 border border-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors"
                        >
                            登录
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home; 
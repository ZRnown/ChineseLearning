import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex items-center">
                            <span className="text-xl font-bold text-green-600">中国古典文学</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/classics"
                                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-green-600"
                            >
                                古籍
                            </Link>
                            <Link
                                to="/translations"
                                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-green-600"
                            >
                                翻译
                            </Link>
                            <Link
                                to="/notes"
                                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-green-600"
                            >
                                笔记
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                            登录
                        </Link>
                        <Link
                            to="/register"
                            className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-600 bg-white hover:bg-green-50"
                        >
                            注册
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 
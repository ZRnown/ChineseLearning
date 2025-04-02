import React from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaHome, FaList, FaGlobe, FaCog } from 'react-icons/fa';
// 移除未使用的 useAuth 导入或使用它
// import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
    // 移除未使用的解构变量
    // const { user, logout } = useAuth();

    return (
        <nav className="bg-[#8b4513] text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <Link to="/" className="flex items-center">
                        <FaBook className="mr-2" />
                        <span className="text-xl font-bold">古文导读</span>
                    </Link>
                </div>
                
                <div className="flex items-center space-x-6">
                    <Link to="/" className="hover:text-gray-300 flex items-center">
                        <FaHome className="mr-1" />
                        首页
                    </Link>
                    
                    <Link to="/classics" className="hover:text-gray-300 flex items-center">
                        <FaList className="mr-1" />
                        古籍列表
                    </Link>
                    
                    <Link to="/translation" className="hover:text-gray-300 flex items-center">
                        <FaGlobe className="mr-1" />
                        古文翻译
                    </Link>
                    
                    <Link to="/settings" className="hover:text-gray-300 flex items-center">
                        <FaCog className="mr-1" />
                        设置
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { BiHome, BiCog, BiBook, BiBookOpen, BiUser, BiGlobe } from 'react-icons/bi';

import Home from './pages/Home';
import Settings from './pages/Settings';
import Classics from './pages/Classics';
import ClassicDetail from './pages/ClassicDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Translation from './pages/Translation';

// 定义用户接口
interface User {
  username: string;
  email: string;
}

// 只保留一个App组件
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#f8f5f0] flex flex-col">
        {/* 顶部导航栏 */}
        <nav className="bg-[#8b4513] text-white shadow-lg">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center">
                  <BiBookOpen className="h-8 w-8 text-[#f8f5f0]" />
                  <span className="ml-2 text-xl font-serif text-[#f8f5f0]">古文导读</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-[#f8f5f0] hover:bg-[#6b3410] transition-colors">
                  <BiHome className="mr-2" />
                  首页
                </Link>
                <Link to="/classics" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-[#f8f5f0] hover:bg-[#6b3410] transition-colors">
                  <BiBook className="mr-2" />
                  古籍列表
                </Link>
                {/* 添加古文翻译链接 */}
                <Link to="/translation" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-[#f8f5f0] hover:bg-[#6b3410] transition-colors">
                  <BiGlobe className="mr-2" />
                  古文翻译
                </Link>
                <Link to="/settings" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-[#f8f5f0] hover:bg-[#6b3410] transition-colors">
                  <BiCog className="mr-2" />
                  设置
                </Link>
                <div className="flex items-center space-x-2 ml-4">
                  {user ? (
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-[#f8f5f0]">
                        <BiUser className="mr-2" />
                        <span>{user.username}</span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-medium bg-[#f8f5f0] text-[#8b4513] hover:bg-[#e8e4e0] rounded-md transition-colors"
                      >
                        退出
                      </button>
                    </div>
                  ) : (
                    <>
                      <Link to="/login" className="px-4 py-2 text-sm font-medium text-[#f8f5f0] hover:text-[#f8f5f0] hover:bg-[#6b3410] rounded-md transition-colors">
                        登录
                      </Link>
                      <Link to="/register" className="px-4 py-2 text-sm font-medium bg-[#f8f5f0] text-[#8b4513] hover:bg-[#e8e4e0] rounded-md transition-colors">
                        注册
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* 主要内容区域 - 修改宽度设置 */}
        <main className="flex-grow w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/classics" element={<Classics />} />
            <Route path="/classic/:id" element={<ClassicDetail />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/translation" element={<Translation />} />
          </Routes>
        </main>

        {/* 页脚 */}
        <footer className="bg-[#8b4513] text-white py-4">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm text-[#f8f5f0]">© 2024 古文翻译. All rights reserved.</p>
            </div>
          </div>
        </footer>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#f8f5f0',
              color: '#2c3e50',
              border: '1px solid #e8e4e0',
              borderRadius: '0.5rem',
              padding: '1rem',
            },
          }}
        />
      </div>
    </Router>
  );
};

export default App;

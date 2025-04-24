import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { BiHome, BiCog, BiBook, BiBookOpen, BiUser, BiGlobe, BiHeart, BiHistory } from 'react-icons/bi';

import Home from './pages/Home';
import Settings from './pages/Settings';
import Classics from './pages/Classics';
import ClassicDetail from './pages/ClassicDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Translation from './pages/Translation';
import Favorites from './pages/Favorites';
import History from './pages/History';
import { useAuth } from './contexts/AuthContext';
import { HistoryProvider } from './contexts/HistoryContext';
import ThemeToggle from './components/ThemeToggle';

// App组件
const App: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Router>
      <HistoryProvider>
        <div className="min-h-screen bg-[#f8f5f0] dark:bg-gray-900 flex flex-col transition-colors duration-200">
          {/* 顶部导航栏 */}
          <nav className="bg-[#8b4513] dark:bg-gray-800 text-white shadow-lg transition-colors duration-200">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <Link to="/" className="flex items-center">
                    <BiBookOpen className="h-8 w-8 text-[#f8f5f0] dark:text-[#d9c9a3] transition-colors duration-200" />
                    <span className="ml-2 text-xl font-serif text-[#f8f5f0] dark:text-gray-100 transition-colors duration-200">古文导读</span>
                  </Link>
                </div>
                <div className="flex items-center space-x-4">
                  <Link to="/" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-[#f8f5f0] dark:text-gray-100 hover:bg-[#6b3410] dark:hover:bg-gray-700 transition-colors duration-200">
                    <BiHome className="mr-2" />
                    首页
                  </Link>
                  <Link to="/classics" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-[#f8f5f0] dark:text-gray-100 hover:bg-[#6b3410] dark:hover:bg-gray-700 transition-colors duration-200">
                    <BiBook className="mr-2" />
                    古籍列表
                  </Link>
                  {/* 添加古文翻译链接 */}
                  <Link to="/translation" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-[#f8f5f0] dark:text-gray-100 hover:bg-[#6b3410] dark:hover:bg-gray-700 transition-colors duration-200">
                    <BiGlobe className="mr-2" />
                    古文翻译
                  </Link>
                  {/* 添加收藏夹链接，仅用户登录时显示 */}
                  {user && (
                    <Link to="/favorites" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-[#f8f5f0] dark:text-gray-100 hover:bg-[#6b3410] dark:hover:bg-gray-700 transition-colors duration-200">
                      <BiHeart className="mr-2" />
                      收藏夹
                    </Link>
                  )}
                  {/* 添加历史记录链接 */}
                  <Link to="/history" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-[#f8f5f0] dark:text-gray-100 hover:bg-[#6b3410] dark:hover:bg-gray-700 transition-colors duration-200">
                    <BiHistory className="mr-2" />
                    历史记录
                  </Link>
                  <Link to="/settings" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-[#f8f5f0] dark:text-gray-100 hover:bg-[#6b3410] dark:hover:bg-gray-700 transition-colors duration-200">
                    <BiCog className="mr-2" />
                    设置
                  </Link>
                  <div className="flex items-center space-x-2 ml-4">
                    <ThemeToggle />
                    {user ? (
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-[#f8f5f0] dark:text-gray-100 transition-colors duration-200">
                          <BiUser className="mr-2" />
                          <span>{user.username}</span>
                        </div>
                        <button
                          onClick={logout}
                          className="px-4 py-2 text-sm font-medium bg-[#f8f5f0] dark:bg-gray-700 text-[#8b4513] dark:text-[#d9c9a3] hover:bg-[#e8e4e0] dark:hover:bg-gray-600 rounded-md transition-colors duration-200"
                        >
                          退出
                        </button>
                      </div>
                    ) : (
                      <>
                        <Link to="/login" className="px-4 py-2 text-sm font-medium text-[#f8f5f0] dark:text-gray-100 hover:text-[#f8f5f0] dark:hover:text-white hover:bg-[#6b3410] dark:hover:bg-gray-700 rounded-md transition-colors duration-200">
                          登录
                        </Link>
                        <Link to="/register" className="px-4 py-2 text-sm font-medium bg-[#f8f5f0] dark:bg-gray-700 text-[#8b4513] dark:text-[#d9c9a3] hover:bg-[#e8e4e0] dark:hover:bg-gray-600 rounded-md transition-colors duration-200">
                          注册
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* 主要内容区域 */}
          <main className="flex-grow w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/classics" element={<Classics />} />
              <Route path="/classics/:id" element={<ClassicDetail />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/translation" element={<Translation />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </main>

          {/* 页脚 */}
          <footer className="bg-[#8b4513] dark:bg-gray-800 text-white py-4 transition-colors duration-200">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <p className="text-sm text-[#f8f5f0] dark:text-gray-300 transition-colors duration-200">© 2024 古文导读. All rights reserved.</p>
              </div>
            </div>
          </footer>

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--toast-bg, #f8f5f0)',
                color: 'var(--toast-color, #2c3e50)',
                border: 'var(--toast-border, 1px solid #e8e4e0)',
                borderRadius: '0.5rem',
                padding: '1rem',
              },
              className: 'dark:toast-dark',
            }}
          />
        </div>
      </HistoryProvider>
    </Router>
  );
};

export default App;

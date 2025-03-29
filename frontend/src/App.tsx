import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { BiHome, BiGlobe, BiCog, BiBook, BiBookOpen, BiUser } from 'react-icons/bi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import Home from './pages/Home';
import Translation from './pages/Translation';
import Settings from './pages/Settings';
import Classics from './pages/Classics';
import ClassicDetail from './pages/ClassicDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import AIDuide from './components/AIDuide';
import TextInput from './components/TextInput';
import LanguageSelector from './components/LanguageSelector';

interface User {
  username: string;
  email: string;
}

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('zh');
  const [showAIDuide, setShowAIDuide] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleTranslate = (translated: string) => {
    setTranslatedText(translated);
    setShowAIDuide(true);
  };

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
                <Link to="/translation" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-[#f8f5f0] hover:bg-[#6b3410] transition-colors">
                  <BiGlobe className="mr-2" />
                  翻译
                </Link>
                <Link to="/classics" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-[#f8f5f0] hover:bg-[#6b3410] transition-colors">
                  <BiBook className="mr-2" />
                  古籍列表
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

        {/* 主要内容区域 */}
        <main className="flex-grow w-[65%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/translation" element={
              <div className="space-y-8 w-full">
                <div className="bg-white rounded-lg shadow-lg p-8 border border-[#e8e4e0]">
                  <h2 className="text-2xl font-bold text-[#2c3e50] font-serif mb-6">古文翻译</h2>
                  <div className="space-y-6">
                    <TextInput
                      text={text}
                      onTextChange={setText}
                      onTranslate={handleTranslate}
                    />
                    <LanguageSelector
                      selectedLanguage={selectedLanguage}
                      onLanguageChange={setSelectedLanguage}
                    />
                  </div>
                </div>

                {translatedText && (
                  <div className="bg-white rounded-lg shadow-lg p-8 border border-[#e8e4e0]">
                    <h2 className="text-2xl font-bold text-[#2c3e50] font-serif mb-6">翻译结果</h2>
                    <div className="prose max-w-none dark:prose-invert prose-headings:font-serif prose-headings:text-[#2c3e50] prose-p:text-[#444]">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{translatedText}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {showAIDuide && (
                  <AIDuide text={text} language={selectedLanguage} />
                )}
              </div>
            } />
            <Route path="/classics" element={<Classics />} />
            <Route path="/classics/:id" element={<ClassicDetail />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleLogin} />} />
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

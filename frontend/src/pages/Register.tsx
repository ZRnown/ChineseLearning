import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiUser, BiLock, BiEnvelope } from 'react-icons/bi';
import { register } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';
import useDarkMode from '../hooks/useDarkMode';

const Register = () => {
    const { darkMode } = useDarkMode();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('两次输入的密码不一致');
            return;
        }

        try {
            setError('');
            setLoading(true);
            const response = await register(username, password, email);
            if (response) {
                await login(email, password);
                navigate('/');
            }
        } catch (error: any) {
            setError(error.message || '注册失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-[#f8f5f0]'} py-12 px-4 sm:px-6 lg:px-8`}>
            <div className={`w-full max-w-sm space-y-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 border ${darkMode ? 'border-gray-700' : 'border-[#e8e4e0]'}`}>
                <div className="text-center">
                    <h2 className={`mt-6 text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-[#2c3e50]'} font-serif`}>注册</h2>
                    <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-[#666]'}`}>开启古文学习之旅</p>
                </div>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="username" className="sr-only">用户名</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <BiUser className="h-5 w-5 text-[#8b4513]" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className={`appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border ${darkMode ? 'border-gray-600 bg-gray-700 placeholder-gray-400 text-white' : 'border-[#e8e4e0] placeholder-[#999] text-[#2c3e50]'} focus:outline-none focus:ring-[#8b4513] focus:border-[#8b4513] focus:z-10 sm:text-sm`}
                                    placeholder="用户名"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">邮箱</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <BiEnvelope className="h-5 w-5 text-[#8b4513]" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className={`appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border ${darkMode ? 'border-gray-600 bg-gray-700 placeholder-gray-400 text-white' : 'border-[#e8e4e0] placeholder-[#999] text-[#2c3e50]'} focus:outline-none focus:ring-[#8b4513] focus:border-[#8b4513] focus:z-10 sm:text-sm`}
                                    placeholder="邮箱"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">密码</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <BiLock className="h-5 w-5 text-[#8b4513]" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className={`appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border ${darkMode ? 'border-gray-600 bg-gray-700 placeholder-gray-400 text-white' : 'border-[#e8e4e0] placeholder-[#999] text-[#2c3e50]'} focus:outline-none focus:ring-[#8b4513] focus:border-[#8b4513] focus:z-10 sm:text-sm`}
                                    placeholder="密码"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">确认密码</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <BiLock className="h-5 w-5 text-[#8b4513]" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    className={`appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border ${darkMode ? 'border-gray-600 bg-gray-700 placeholder-gray-400 text-white' : 'border-[#e8e4e0] placeholder-[#999] text-[#2c3e50]'} focus:outline-none focus:ring-[#8b4513] focus:border-[#8b4513] focus:z-10 sm:text-sm`}
                                    placeholder="确认密码"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#8b4513] hover:bg-[#6b3410] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8b4513] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? '注册中...' : '注册'}
                        </button>
                    </div>
                    <div className="text-center">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-[#666]'}`}>已有账号？</span>
                        <Link className="ml-2 text-sm text-[#8b4513] hover:text-[#6b3410] hover:underline" to="/login">
                            立即登录
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register; 
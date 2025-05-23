import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiUser, BiLockAlt } from 'react-icons/bi';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('登录失败，请检查用户名和密码');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f5f0] dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-10 border border-[#e8e4e0] dark:border-gray-700 transition-colors duration-200">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-[#2c3e50] dark:text-gray-100 font-serif transition-colors duration-200">登录</h2>
                    <p className="mt-2 text-sm text-[#666] dark:text-gray-400 transition-colors duration-200">探索古文的智慧</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="username" className="sr-only">用户名</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <BiUser size={20} className="text-[#8b4513] dark:text-[#d9c9a3] transition-colors duration-200" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-[#e8e4e0] dark:border-gray-600 placeholder-[#999] dark:placeholder-gray-500 text-[#2c3e50] dark:text-gray-200 focus:outline-none focus:ring-[#8b4513] dark:focus:ring-[#d9c9a3] focus:border-[#8b4513] dark:focus:border-[#d9c9a3] focus:z-10 sm:text-sm bg-white dark:bg-gray-700 transition-colors duration-200"
                                    placeholder="用户名"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">密码</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <BiLockAlt size={20} className="text-[#8b4513] dark:text-[#d9c9a3] transition-colors duration-200" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-[#e8e4e0] dark:border-gray-600 placeholder-[#999] dark:placeholder-gray-500 text-[#2c3e50] dark:text-gray-200 focus:outline-none focus:ring-[#8b4513] dark:focus:ring-[#d9c9a3] focus:border-[#8b4513] dark:focus:border-[#d9c9a3] focus:z-10 sm:text-sm bg-white dark:bg-gray-700 transition-colors duration-200"
                                    placeholder="密码"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 dark:text-red-400 p-3 rounded-lg transition-colors duration-200">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#8b4513] dark:bg-[#d9c9a3]/80 dark:text-gray-900 hover:bg-[#6b3410] dark:hover:bg-[#d9c9a3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8b4513] dark:focus:ring-[#d9c9a3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? '登录中...' : '登录'}
                        </button>
                    </div>

                    <div className="text-center">
                        <span className="text-sm text-[#666] dark:text-gray-400 transition-colors duration-200">还没有账号？</span>
                        <Link
                            to="/register"
                            className="ml-2 text-sm text-[#8b4513] dark:text-[#d9c9a3] hover:text-[#6b3410] dark:hover:text-[#d9c9a3]/80 hover:underline transition-colors duration-200"
                        >
                            立即注册
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login; 
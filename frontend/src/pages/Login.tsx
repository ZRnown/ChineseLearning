import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiUser, BiLockAlt } from 'react-icons/bi';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // 登录逻辑
            // 登录成功后跳转
            navigate('/');
        } catch (err) {
            setError('登录失败，请检查用户名和密码');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f5f0] py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white rounded-xl shadow-lg p-10 border border-[#e8e4e0]">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-[#2c3e50] font-serif">登录</h2>
                    <p className="mt-2 text-sm text-[#666]">探索古文的智慧</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-[#e8e4e0] placeholder-[#999] text-[#2c3e50] focus:outline-none focus:ring-[#8b4513] focus:border-[#8b4513] focus:z-10 sm:text-sm"
                                    placeholder="用户名"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">密码</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <BiLockAlt className="h-5 w-5 text-[#8b4513]" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-[#e8e4e0] placeholder-[#999] text-[#2c3e50] focus:outline-none focus:ring-[#8b4513] focus:border-[#8b4513] focus:z-10 sm:text-sm"
                                    placeholder="密码"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#8b4513] hover:bg-[#6b3410] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8b4513]"
                        >
                            登录
                        </button>
                    </div>

                    <div className="text-center">
                        <span className="text-sm text-[#666]">还没有账号？</span>
                        <Link
                            to="/register"
                            className="ml-2 text-sm text-[#8b4513] hover:text-[#6b3410] hover:underline"
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
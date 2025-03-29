import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiUser, BiEnvelope, BiLockAlt } from 'react-icons/bi';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('两次输入的密码不一致');
            return;
        }

        try {
            // 注册逻辑
            navigate('/login');
        } catch (err) {
            setError('注册失败，请稍后重试');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f5f0] py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-sm space-y-6 bg-white rounded-xl shadow-lg p-8 border border-[#e8e4e0]">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-[#2c3e50] font-serif">注册</h2>
                    <p className="mt-2 text-sm text-[#666]">开启古文学习之旅</p>
                </div>
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
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-[#e8e4e0] placeholder-[#999] text-[#2c3e50] focus:outline-none focus:ring-[#8b4513] focus:border-[#8b4513] focus:z-10 sm:text-sm"
                                    placeholder="用户名"
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
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-[#e8e4e0] placeholder-[#999] text-[#2c3e50] focus:outline-none focus:ring-[#8b4513] focus:border-[#8b4513] focus:z-10 sm:text-sm"
                                    placeholder="邮箱"
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
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-[#e8e4e0] placeholder-[#999] text-[#2c3e50] focus:outline-none focus:ring-[#8b4513] focus:border-[#8b4513] focus:z-10 sm:text-sm"
                                    placeholder="密码"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">确认密码</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <BiLockAlt className="h-5 w-5 text-[#8b4513]" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-[#e8e4e0] placeholder-[#999] text-[#2c3e50] focus:outline-none focus:ring-[#8b4513] focus:border-[#8b4513] focus:z-10 sm:text-sm"
                                    placeholder="确认密码"
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
                            注册
                        </button>
                    </div>

                    <div className="text-center">
                        <span className="text-sm text-[#666]">已有账号？</span>
                        <Link
                            to="/login"
                            className="ml-2 text-sm text-[#8b4513] hover:text-[#6b3410] hover:underline"
                        >
                            立即登录
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register; 
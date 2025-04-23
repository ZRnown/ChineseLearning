import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
    id: number;
    username: string;
    email: string;
    created_at: string;
}

// 添加古籍类型定义
interface Classic {
    id: number;
    title: string;
    author: string;
    dynasty: string;
    category: string;
    description: string;
    cover_image?: string;
    is_favorite?: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    favorites: Classic[];
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string, email: string) => Promise<void>;
    logout: () => void;
    toggleFavorite: (classic: Classic) => Promise<boolean>;
    getFavorites: () => Promise<Classic[]>;
    checkIsFavorite: (classicId: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [favorites, setFavorites] = useState<Classic[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            validateToken(token);
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            getFavorites();
        } else {
            setFavorites([]);
        }
    }, [user]);

    const validateToken = async (token: string) => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
        } catch (error) {
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await axios.post('http://localhost:8000/api/auth/token', formData);
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        await validateToken(access_token);
    };

    const register = async (username: string, password: string, email: string) => {
        const response = await axios.post('http://localhost:8000/api/auth/register', {
            username,
            password,
            email
        });
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        await validateToken(access_token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setFavorites([]);
    };

    // 获取收藏列表
    const getFavorites = async (): Promise<Classic[]> => {
        if (!user) {
            return [];
        }

        try {
            // 从localStorage获取收藏数据
            const storedFavorites = localStorage.getItem(`favorites_${user.id}`);
            let favoritesData: Classic[] = [];
            
            if (storedFavorites) {
                favoritesData = JSON.parse(storedFavorites);
            }
            
            setFavorites(favoritesData);
            return favoritesData;
        } catch (error) {
            console.error('获取收藏失败:', error);
            return [];
        }
    };

    // 切换收藏状态
    const toggleFavorite = async (classic: Classic): Promise<boolean> => {
        if (!user) {
            return false;
        }

        try {
            const isFavorited = checkIsFavorite(classic.id);
            let newFavorites: Classic[];

            if (isFavorited) {
                // 取消收藏
                newFavorites = favorites.filter(item => item.id !== classic.id);
            } else {
                // 添加收藏
                newFavorites = [...favorites, {...classic, is_favorite: true}];
            }

            // 更新状态
            setFavorites(newFavorites);
            
            // 保存到localStorage
            localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
            
            return !isFavorited;
        } catch (error) {
            console.error('切换收藏状态失败:', error);
            return checkIsFavorite(classic.id);
        }
    };

    // 检查是否收藏
    const checkIsFavorite = (classicId: number): boolean => {
        return favorites.some(item => item.id === classicId);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            favorites,
            login, 
            register, 
            logout,
            toggleFavorite,
            getFavorites,
            checkIsFavorite
        }}>
            {children}
        </AuthContext.Provider>
    );
};
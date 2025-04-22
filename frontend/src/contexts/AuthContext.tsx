import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
    id: number;
    username: string;
    email: string;
    created_at: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string, email: string) => Promise<void>;
    logout: () => void;
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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            validateToken(token);
        } else {
            setLoading(false);
        }
    }, []);

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
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
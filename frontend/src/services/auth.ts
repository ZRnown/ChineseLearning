import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const register = async (username: string, password: string, email: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, {
            username,
            password,
            email,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.detail || '注册失败');
        }
        throw error;
    }
};

export const login = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            username,
            password,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.detail || '登录失败');
        }
        throw error;
    }
}; 
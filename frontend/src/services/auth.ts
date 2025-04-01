import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

interface ApiError {
    response?: {
        status?: number;
        statusText?: string;
        data?: {
            detail?: string;
        };
    };
}

export const register = async (username: string, password: string, email: string) => {
    try {
        console.log('开始注册用户:', { username, email });
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
        console.log('注册响应:', response.data);
        return response.data;
    } catch (error) {
        console.error('注册错误:', error);
        const apiError = error as ApiError;
        if (apiError.response) {
            console.error('Axios错误详情:', {
                status: apiError.response.status,
                statusText: apiError.response.statusText,
                data: apiError.response.data,
            });
            throw new Error(apiError.response.data?.detail || '注册失败');
        }
        throw error;
    }
};

export const login = async (username: string, password: string) => {
    try {
        console.log('开始登录用户:', username);
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await axios.post(`${API_URL}/auth/token`, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            }
        });
        console.log('登录响应:', response.data);
        return response.data;
    } catch (error) {
        console.error('登录错误:', error);
        const apiError = error as ApiError;
        if (apiError.response) {
            console.error('Axios错误详情:', {
                status: apiError.response.status,
                statusText: apiError.response.statusText,
                data: apiError.response.data,
            });
            throw new Error(apiError.response.data?.detail || '登录失败');
        }
        throw error;
    }
}; 
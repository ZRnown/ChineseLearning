import axios from 'axios';

const API_URL = '/api';

export const register = async (username: string, password: string, email: string) => {
    try {
        console.log('Registering user:', { username, email });
        const response = await axios.post(`${API_URL}/api/auth/register`, {
            username,
            password,
            email,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
        console.log('Registration response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        if (axios.isAxiosError(error)) {
            console.error('Axios error details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
            });
            throw new Error(error.response?.data?.detail || '注册失败');
        }
        throw error;
    }
};

export const login = async (username: string, password: string) => {
    try {
        console.log('Logging in user:', username);
        const response = await axios.post(`${API_URL}/api/auth/login`, {
            username,
            password,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
        console.log('Login response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        if (axios.isAxiosError(error)) {
            console.error('Axios error details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
            });
            throw new Error(error.response?.data?.detail || '登录失败');
        }
        throw error;
    }
}; 
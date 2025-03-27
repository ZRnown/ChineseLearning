import axios from 'axios';
import { Classic, Translation } from '../types/classic';

const API_URL = 'http://localhost:8000/api';

export const getClassics = async (skip: number = 0, limit: number = 10): Promise<Classic[]> => {
    try {
        console.log('Fetching classics with params:', { skip, limit });
        const response = await axios.get(`${API_URL}/classics/`, {
            params: { skip, limit },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            timeout: 10000, // 10 second timeout
        });

        console.log('Classics response status:', response.status);
        console.log('Classics response headers:', response.headers);
        console.log('Classics response data:', response.data);

        if (!Array.isArray(response.data)) {
            console.error('Response data is not an array:', response.data);
            throw new Error('Invalid response format');
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching classics:', error);
        if (axios.isAxiosError(error)) {
            console.error('Axios error details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                headers: error.response?.headers,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    headers: error.config?.headers,
                    params: error.config?.params,
                },
            });

            if (error.response?.status === 404) {
                throw new Error('API endpoint not found');
            } else if (error.response?.status === 500) {
                throw new Error('Server error');
            } else if (error.code === 'ECONNABORTED') {
                throw new Error('请求超时，请检查网络连接');
            } else if (error.code === 'ERR_NETWORK') {
                throw new Error('Network error');
            }
        }
        throw new Error('获取古籍列表失败');
    }
};

export const getClassic = async (id: number): Promise<Classic> => {
    try {
        const response = await axios.get(`${API_URL}/classics/${id}/`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            timeout: 10000, // 10 second timeout
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching classic:', error);
        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
                throw new Error('请求超时，请检查网络连接');
            }
        }
        throw new Error('获取古籍详情失败');
    }
};

export const getTranslations = async (classicId: number): Promise<Translation[]> => {
    try {
        const response = await axios.get(`${API_URL}/classics/${classicId}/translations`);
        return response.data;
    } catch (error) {
        console.error('Error fetching translations:', error);
        throw new Error('获取翻译列表失败');
    }
}; 
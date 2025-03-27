import axios from 'axios';
import { Translation } from '../types/translation';

const API_URL = 'http://localhost:8000/api';

const getAuthToken = () => {
    return localStorage.getItem('token');
};

export const getTranslations = async (classicId: number): Promise<Translation[]> => {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('未登录');
        }

        const response = await axios.get(`${API_URL}/classics/${classicId}/translations/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('获取翻译失败:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error('请先登录');
        }
        throw error;
    }
};

export const createTranslation = async (
    classicId: number,
    content: string,
    language: string
): Promise<Translation> => {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('未登录');
        }

        const response = await axios.post(
            `${API_URL}/classics/${classicId}/translations/`,
            {
                content,
                language
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('创建翻译失败:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error('请先登录');
        }
        throw error;
    }
};

export const getTranslation = async (classicId: number, translationId: number): Promise<Translation> => {
    try {
        const response = await axios.get(`${API_URL}/classics/${classicId}/translations/${translationId}/`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            timeout: 10000, // 10 second timeout
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching translation:', error);
        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
                throw new Error('请求超时，请检查网络连接');
            }
        }
        throw new Error('获取翻译详情失败');
    }
}; 
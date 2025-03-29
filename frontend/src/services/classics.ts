import api from '../utils/axios';
import { Classic, Translation } from '../types/classic';

const API_URL = 'http://localhost:8000/api';

export const getClassics = async (offset: number = 0, limit: number = 10): Promise<Classic[]> => {
    try {
        console.log('Fetching classics with params:', { offset, limit });
        const response = await api.get('/classics', {
            params: { offset, limit }
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
        throw error;
    }
};

export const getClassic = async (id: number): Promise<Classic> => {
    try {
        const response = await api.get(`/classics/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching classic:', error);
        throw error;
    }
};

export const getTranslations = async (classicId: number): Promise<Translation[]> => {
    try {
        const response = await api.get(`/classics/${classicId}/translations`);
        return response.data;
    } catch (error) {
        console.error('Error fetching translations:', error);
        throw new Error('获取翻译列表失败');
    }
};

export const getClassicById = async (id: string): Promise<Classic> => {
    try {
        const response = await api.get(`/classics/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching classic by id:', error);
        throw error;
    }
};

export const likeClassic = async (id: string): Promise<void> => {
    try {
        const response = await api.post(`/classics/${id}/like`);
        return response.data;
    } catch (error) {
        console.error('Error liking classic:', error);
        throw error;
    }
}; 
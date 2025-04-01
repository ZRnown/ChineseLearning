import api from '../utils/axios';
import { Classic, Translation } from '../types/classic';

interface PaginatedResponse<T> {
    items: T[];
    total: number;
    skip: number;
    limit: number;
}

export const getClassics = async (
    offset: number = 0,
    limit: number = 10,
    category?: string,
    dynasty?: string,
    tag?: string
): Promise<PaginatedResponse<Classic>> => {
    console.log('Fetching classics with params:', { offset, limit, category, dynasty, tag });
    try {
        const response = await api.get<PaginatedResponse<Classic>>('/classics', {
            params: { skip: offset, limit, category, dynasty, tag },
            timeout: 30000
        });

        console.log('Classics response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching classics:', error);
        throw error;
    }
};

export const getClassic = async (id: number): Promise<Classic> => {
    try {
        const response = await api.get<Classic>(`/classics/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching classic:', error);
        throw error;
    }
};

export const getTranslations = async (classicId: number): Promise<Translation[]> => {
    try {
        const response = await api.get<Translation[]>(`/classics/${classicId}/translations`);
        return response.data;
    } catch (error) {
        console.error('Error fetching translations:', error);
        throw error;
    }
};

export const getClassicById = async (id: string | number): Promise<Classic> => {
    try {
        const response = await api.get<Classic>(`/classics/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching classic by id:', error);
        throw error;
    }
};

export const likeClassic = async (id: string): Promise<void> => {
    try {
        await api.post(`/classics/${id}/like`);
    } catch (error) {
        console.error('Error liking classic:', error);
        throw error;
    }
}; 
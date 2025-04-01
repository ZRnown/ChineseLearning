import api from '../utils/axios';
import { Classic, Translation } from '../types/classic';

interface GetClassicsParams {
    skip?: number;
    limit?: number;
    category?: string;
    dynasty?: string;
}

interface PaginatedResponse {
    items: Classic[];
    total: number;
    skip: number;
    limit: number;
}

export const getClassics = async (params: GetClassicsParams = {}): Promise<PaginatedResponse> => {
    try {
        console.log('Fetching classics with params:', params);
        const response = await api.get<PaginatedResponse>('/classics', {
            params: {
                skip: params.skip || 0,
                limit: params.limit || 9,
                category: params.category || undefined,
                dynasty: params.dynasty || undefined
            }
        });
        console.log('Response data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching classics:', error);
        throw new Error('获取古籍列表失败');
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

export const getClassicById = async (id: number): Promise<Classic> => {
    try {
        const response = await api.get<Classic>(`/classics/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching classic:', error);
        throw new Error('获取古籍详情失败');
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
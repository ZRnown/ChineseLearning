import api from '../utils/axios';
import { Classic, Translation } from '../types/classic';

interface GetClassicsParams {
    skip?: number;
    limit?: number;
    category?: string;
    dynasty?: string;
    tag?: string;
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
                dynasty: params.dynasty || undefined,
                tag: params.tag || undefined
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


export interface SearchClassicsParams {
    query: string;
    searchType?: 'title' | 'content' | 'author' | 'all';
}

export const searchClassics = async (params: SearchClassicsParams) => {
    try {
        console.log('搜索参数:', params);

        // 改用POST请求，将参数放在请求体中
        const response = await api.post('/classics/search', {
            query: params.query,
            search_type: params.searchType || 'all'
        });

        console.log('搜索响应:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('搜索古籍出错:', error);
        if (error.response) {
            console.error('错误响应数据:', error.response.data);
            console.error('错误状态码:', error.response.status);
        }
        throw error;
    }
};
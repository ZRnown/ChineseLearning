import axios from 'axios';
import { Comment } from '../types/comment';

const API_URL = 'http://localhost:8000/api';

export const getComments = async (classicId: number, page: number = 1): Promise<Comment[]> => {
    try {
        const response = await axios.get(`${API_URL}/classics/${classicId}/comments/`, {
            params: { page },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw new Error('获取评论失败');
    }
};

export const createComment = async (classicId: number, content: string): Promise<Comment> => {
    try {
        const response = await axios.post(
            `${API_URL}/classics/${classicId}/comments/`,
            { content },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating comment:', error);
        throw new Error('发表评论失败');
    }
}; 
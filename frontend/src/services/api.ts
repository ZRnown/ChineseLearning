import axios from 'axios';
import type { ApiResponse, User, Classic, Translation, Comment } from '../types';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      config.headers = {}; // 确保 headers 被初始化
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 用户相关API
export const userApi = {
  login: (data: { username: string; password: string }) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/api/auth/login', data),
  
  register: (data: { username: string; email: string; password: string }) =>
    api.post<ApiResponse<User>>('/api/auth/register', data),
  
  getCurrentUser: () =>
    api.get<ApiResponse<User>>('/api/auth/me')
};

// 古籍相关API
export const classicApi = {
  getAll: () =>
    api.get<ApiResponse<Classic[]>>('/api/classics'),
  
  getById: (id: number) =>
    api.get<ApiResponse<Classic>>(`/api/classics/${id}`),
  
  create: (data: Omit<Classic, 'id' | 'created_at' | 'updated_at'>) =>
    api.post<ApiResponse<Classic>>('/api/classics', data),
  
  update: (id: number, data: Partial<Classic>) =>
    api.put<ApiResponse<Classic>>(`/api/classics/${id}`, data),
  
  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/api/classics/${id}`)
};

// 翻译相关API
export const translationApi = {
  translate: (data: { text: string; targetLang: string }) =>
    api.post<ApiResponse<{ translatedText: string }>>('/api/translate', data),
  
  saveTranslation: (data: Omit<Translation, 'id' | 'created_at' | 'updated_at'>) =>
    api.post<ApiResponse<Translation>>('/api/translations', data),
  
  getTranslations: (classicId: number) =>
    api.get<ApiResponse<Translation[]>>(`/api/translations/classic/${classicId}`)
};

// 评论相关API
export const commentApi = {
  getComments: (classicId: number, page: number = 1) =>
    api.get<ApiResponse<Comment[]>>(`/api/classics/${classicId}/comments/`, { params: { page } }),
  
  createComment: (classicId: number, content: string) =>
    api.post<ApiResponse<Comment>>(`/api/classics/${classicId}/comments/`, { content }),
  
  updateComment: (id: number, content: string) =>
    api.put<ApiResponse<Comment>>(`/api/comments/${id}`, { content }),
  
  deleteComment: (id: number) =>
    api.delete<ApiResponse<void>>(`/api/comments/${id}`)
};
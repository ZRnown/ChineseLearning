// 语言相关类型
export interface Language {
  code: string;
  name: string;
}

// 用户相关类型
export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

// 导出 classic.ts 中的类型
export * from './classic';

// 评论相关类型
export interface Comment {
  id: number;
  content: string;
  classic_id: number;
  user_id: number;
  user_name: string; // 添加 user_name 字段
  created_at: string;
  updated_at?: string; // updated_at 是可选字段
}

// API 响应类型
export interface ApiResponse<T> {
  data: T; // 响应数据
  message?: string; // 可选的消息
  status?: string; // 可选的状态
}
export interface Comment {
  id: number; // 评论的唯一标识符
  content: string; // 评论内容
  classic_id: number; // 所属古籍的 ID
  user_id: number; // 用户 ID
  user_name: string; // 用户名
  created_at: string; // 评论创建时间
}
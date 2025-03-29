<template>
  <section class="comment-module">
    <h3>评论</h3>
    
    <!-- 评论列表 -->
    <div class="comments-list" v-if="comments.length > 0">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-header">
          <span class="comment-author">{{ comment.user?.username }}</span>
          <span class="comment-date">{{ formatDate(comment.created_at) }}</span>
        </div>
        <div class="comment-content">{{ comment.content }}</div>
        <div class="comment-actions" v-if="isCurrentUser(comment.user_id)">
          <button @click="editComment(comment)" class="edit-button">编辑</button>
          <button @click="deleteComment(comment.id)" class="delete-button">删除</button>
        </div>
      </div>
    </div>
    <div v-else class="no-comments">
      暂无评论
    </div>

    <!-- 评论输入框 -->
    <div class="comment-input">
      <textarea
        v-model="newComment"
        placeholder="写下你的评论..."
        :disabled="!isLoggedIn"
      ></textarea>
      <button 
        @click="submitComment" 
        :disabled="!isLoggedIn || !newComment.trim()"
        class="submit-button"
      >
        发表评论
      </button>
    </div>

    <!-- 编辑评论对话框 -->
    <div v-if="editingComment" class="edit-dialog">
      <textarea
        v-model="editingComment.content"
        placeholder="编辑你的评论..."
      ></textarea>
      <div class="dialog-actions">
        <button @click="cancelEdit" class="cancel-button">取消</button>
        <button @click="updateComment" class="update-button">更新</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { commentApi } from '../services/api';
import type { Comment } from '../types';
import { useUserStore } from '../stores/user';

const props = defineProps<{
  classicId: number;
}>();

const userStore = useUserStore();
const comments = ref<Comment[]>([]);
const newComment = ref('');
const editingComment = ref<Comment | null>(null);

const isLoggedIn = computed(() => userStore.isLoggedIn);
const currentUserId = computed(() => userStore.currentUser?.id);

onMounted(async () => {
  await loadComments();
});

async function loadComments() {
  try {
    const response = await commentApi.getComments(props.classicId);
    comments.value = response.data;
  } catch (error) {
    console.error('Failed to load comments:', error);
  }
}

async function submitComment() {
  if (!newComment.value.trim()) return;

  try {
    const response = await commentApi.createComment(props.classicId, newComment.value);
    comments.value.push(response.data);
    newComment.value = '';
  } catch (error) {
    console.error('Failed to submit comment:', error);
  }
}

function editComment(comment: Comment) {
  editingComment.value = { ...comment };
}

function cancelEdit() {
  editingComment.value = null;
}

async function updateComment() {
  if (!editingComment.value) return;

  try {
    const response = await commentApi.updateComment(
      editingComment.value.id,
      editingComment.value.content
    );
    const index = comments.value.findIndex(c => c.id === editingComment.value?.id);
    if (index !== -1) {
      comments.value[index] = response.data;
    }
    editingComment.value = null;
  } catch (error) {
    console.error('Failed to update comment:', error);
  }
}

async function deleteComment(commentId: number) {
  try {
    await commentApi.deleteComment(commentId);
    comments.value = comments.value.filter(c => c.id !== commentId);
  } catch (error) {
    console.error('Failed to delete comment:', error);
  }
}

function isCurrentUser(userId: number) {
  return currentUserId.value === userId;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString();
}
</script>

<style scoped>
.comment-module {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fff;
}

.comments-list {
  margin-bottom: 20px;
}

.comment-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.comment-content {
  margin-bottom: 8px;
  line-height: 1.5;
}

.comment-actions {
  display: flex;
  gap: 10px;
}

.edit-button,
.delete-button {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.edit-button {
  background-color: #e3f2fd;
  color: #1976d2;
}

.delete-button {
  background-color: #ffebee;
  color: #d32f2f;
}

.comment-input {
  margin-top: 20px;
}

.comment-input textarea {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  resize: vertical;
}

.submit-button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.edit-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.edit-dialog textarea {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  resize: vertical;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-button,
.update-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #666;
}

.update-button {
  background-color: #4CAF50;
  color: white;
}

.no-comments {
  text-align: center;
  color: #666;
  padding: 20px;
}
</style> 
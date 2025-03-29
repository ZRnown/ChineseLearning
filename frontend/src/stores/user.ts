import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { userApi } from '../services/api';
import type { User } from '../types';

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));

  const isLoggedIn = computed(() => !!token.value);

  async function login(username: string, password: string) {
    try {
      const response = await userApi.login({ username, password });
      token.value = response.data.token;
      currentUser.value = response.data.user;
      localStorage.setItem('token', token.value);
    } catch (error) {
      throw new Error('登录失败，请检查用户名和密码');
    }
  }

  async function register(userData: { username: string; email: string; password: string }) {
    try {
      const response = await userApi.register(userData);
      return response.data;
    } catch (error) {
      throw new Error('注册失败，请重试');
    }
  }

  async function logout() {
    token.value = null;
    currentUser.value = null;
    localStorage.removeItem('token');
  }

  async function fetchCurrentUser() {
    if (!token.value) return;
    try {
      const response = await userApi.getCurrentUser();
      currentUser.value = response.data;
    } catch (error) {
      await logout();
    }
  }

  return {
    currentUser,
    token,
    isLoggedIn,
    login,
    register,
    logout,
    fetchCurrentUser
  };
}); 
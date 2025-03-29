<template>
  <div class="home-container">
    <header class="header">
      <div class="header-left">中国古典文学</div>
      <div class="header-right">
        <button @click="handleLogout">退出</button>
      </div>
    </header>

    <main class="main-content">
      <h1>古典文学列表</h1>
      
      <div class="classics-grid">
        <div v-for="classic in classics" :key="classic.id" class="classic-card">
          <h3>{{ classic.title }}</h3>
          <p>作者：{{ classic.author }}</p>
          <p class="content-title">内涵标题：{{ classic.contentTitle }}</p>
          <router-link :to="`/classics/${classic.id}`" class="view-button">
            查看详情
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { classicApi } from '../services/api';
import type { Classic } from '../types';

const router = useRouter();
const userStore = useUserStore();
const classics = ref<Classic[]>([]);

onMounted(async () => {
  try {
    const response = await classicApi.getAll();
    classics.value = response.data.data;
  } catch (error) {
    console.error('Failed to load classics:', error);
  }
});

function handleLogout() {
  userStore.logout();
  router.push('/login');
}
</script>

<style scoped>
.home-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.header-left {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.header-right button {
  padding: 8px 16px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.header-right button:hover {
  opacity: 0.9;
}

.main-content {
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.classics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.classic-card {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fff;
  transition: transform 0.3s, box-shadow 0.3s;
}

.classic-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.classic-card h3 {
  color: #333;
  margin-bottom: 10px;
}

.classic-card p {
  color: #666;
  margin-bottom: 10px;
}

.content-title {
  font-style: italic;
  color: #888;
}

.view-button {
  display: inline-block;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.view-button:hover {
  background-color: #45a049;
}
</style> 
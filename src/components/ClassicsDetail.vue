<template>
  <div class="classics-detail-container">
    <!-- Header -->
    <header class="header">
      <div class="header-left">中国古典文学</div>
      <div class="header-right">
        <button v-if="!isLoggedIn" @click="handleLogin">登录</button>
        <button v-if="!isLoggedIn" @click="handleRegister">注册</button>
        <button v-else @click="handleLogout">退出</button>
      </div>
    </header>

    <!-- Classics Information -->
    <section class="classics-info">
      <h2>{{ classics.title }}</h2>
      <p>作者：{{ classics.author }}</p>
      <h3>原文</h3>
      <p>{{ classics.originalText }}</p>
      <h3>内涵标题</h3>
      <p>{{ classics.contentTitle }}</p>
    </section>

    <!-- Translation Module -->
    <TranslationModule 
      :source-text="classics.originalText"
      :auto-translate="true"
      @translation-complete="handleTranslationComplete"
    />

    <!-- Comments Module -->
    <CommentModule 
      :classic-id="classics.id"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import TranslationModule from './TranslationModule.vue';
import CommentModule from './CommentModule.vue';
import { useUserStore } from '../stores/user';
import type { Classic } from '../types';

const props = defineProps<{
  classics: Classic;
}>();

const router = useRouter();
const userStore = useUserStore();

const isLoggedIn = computed(() => userStore.isLoggedIn);

function handleTranslationComplete(translatedText: string) {
  console.log('Translation completed:', translatedText);
  // 这里可以添加其他处理逻辑，比如保存翻译结果等
}

function handleLogin() {
  router.push('/login');
}

function handleRegister() {
  router.push('/register');
}

function handleLogout() {
  userStore.logout();
  router.push('/login');
}
</script>

<style scoped>
.classics-detail-container {
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
  margin-left: 10px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.header-right button:first-child {
  background-color: #4CAF50;
  color: white;
}

.header-right button:last-child {
  background-color: #f44336;
  color: white;
}

.header-right button:hover {
  opacity: 0.9;
}

.classics-info {
  margin-bottom: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.classics-info h2 {
  color: #333;
  margin-bottom: 10px;
}

.classics-info p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.classics-info h3 {
  color: #333;
  margin: 20px 0 10px;
}
</style>

<template>
  <div class="ai-guide">
    <h3>AI 导读</h3>
    <div v-if="isLoggedIn">
      <button @click="generateGuide" class="generate-btn">生成导读</button>
      <div v-if="guide" class="guide-content">{{ guide }}</div>
      <p>当前语言：{{ language }}</p>
    </div>
    <div v-else class="login-tip">
      <p>请先登录后使用导读功能</p>
      <router-link to="/login" class="login-link">前往登录</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { getAIGuide } from '../api/ai';

const props = defineProps<{
  language: string,
  isLoggedIn: boolean
}>();

const guide = ref('');

watch(() => props.language, (newLanguage) => {
  if (props.isLoggedIn) {
    generateGuide();
  }
});

async function generateGuide() {
  if (!props.isLoggedIn) {
    return;
  }
  try {
    guide.value = await getAIGuide(props.language);
  } catch (err) {
    console.error('Failed to generate guide:', err);
  }
}
</script>

<style scoped>
.ai-guide {
  margin: 20px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.generate-btn {
  background-color: #4CAF50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.guide-content {
  margin: 15px 0;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.login-tip {
  color: #666;
  text-align: center;
  padding: 20px;
}

.login-link {
  color: #4CAF50;
  text-decoration: none;
  margin-top: 10px;
  display: inline-block;
}
</style>

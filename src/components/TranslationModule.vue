<template>
  <section class="translation-module">
    <h3>翻译</h3>
    <div class="language-selection">
      <label for="language">选择语言：</label>
      <select id="language" v-model="selectedLanguage">
        <option v-for="lang in languages" :key="lang.code" :value="lang.code">
          {{ lang.name }}
        </option>
      </select>
    </div>
    <button 
      @click="handleTranslate" 
      :disabled="loading"
      class="translate-button"
    >
      {{ loading ? '翻译中...' : '获取翻译结果' }}
    </button>
    <div class="translated-text" v-if="translatedText">
      <div class="translation-header">
        <h4>翻译结果：</h4>
        <button 
          @click="copyText" 
          class="copy-button"
          :class="{ 'copied': copied }"
        >
          {{ copied ? '已复制' : '复制' }}
        </button>
      </div>
      <p>{{ translatedText }}</p>
    </div>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { translateText } from '../api/translate';
import { languages } from '../config/languages';

const props = defineProps<{
  sourceText: string;
  autoTranslate?: boolean;
}>();

const emit = defineEmits<{
  (e: 'translation-complete', text: string): void;
  (e: 'language-selected', language: string): void;
}>();

const selectedLanguage = ref('en');
const translatedText = ref('');
const loading = ref(false);
const error = ref('');
const copied = ref(false);

// 监听源文本变化，如果启用了自动翻译，则自动触发翻译
watch(() => props.sourceText, (newText) => {
  if (props.autoTranslate && newText) {
    handleTranslate();
  }
});

// 监听语言选择的变化
watch(selectedLanguage, (newLanguage) => {
  emit('language-selected', newLanguage);
});

async function handleTranslate() {
  if (!props.sourceText) {
    error.value = '请输入要翻译的文本';
    return;
  }

  loading.value = true;
  error.value = '';
  try {
    translatedText.value = await translateText(props.sourceText, selectedLanguage.value);
    emit('translation-complete', translatedText.value);
  } catch (err: any) {
    error.value = err.message || '翻译失败，请稍后重试';
    console.error('Translation error:', err);
  } finally {
    loading.value = false;
  }
}

async function copyText() {
  try {
    await navigator.clipboard.writeText(translatedText.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy text:', err);
    error.value = '复制失败，请手动复制';
  }
}
</script>

<style scoped>
.translation-module {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fff;
}

.language-selection {
  margin-bottom: 15px;
}

.language-selection select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.translate-button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.translate-button:hover {
  background-color: #45a049;
}

.translate-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.translated-text {
  margin-top: 15px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.translation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.copy-button {
  padding: 4px 8px;
  background-color: transparent;
  border: 1px solid #4CAF50;
  color: #4CAF50;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.copy-button:hover {
  background-color: #4CAF50;
  color: white;
}

.copy-button.copied {
  background-color: #4CAF50;
  color: white;
}

.error-message {
  margin-top: 10px;
  color: #f44336;
  font-size: 14px;
}
</style>
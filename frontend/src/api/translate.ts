import api from '../utils/axios';

export async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    const response = await api.post('/translate', {
      text,
      sourceLang: 'zh',  // 默认从中文翻译
      targetLang
    });
    
    return response.data.translatedText;
  } catch (error) {
    console.error('翻译请求失败:', error);
    throw new Error('翻译失败，请稍后再试');
  }
} 
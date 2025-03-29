import api from '../utils/axios';

export async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    const response = await api.post('/api/translations/translate', {
      text: text,
      source_lang: 'zh',  // 默认从中文翻译
      target_lang: targetLang
    });
    
    return response.data.translated_text;  // 修改返回值的键名
  } catch (error) {
    console.error('翻译请求失败:', error);
    throw new Error('翻译失败，请稍后再试');
  }
}

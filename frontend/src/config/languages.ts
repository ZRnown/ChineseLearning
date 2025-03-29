export const languages = [
    { code: 'zh', name: '中文' },
    { code: 'en', name: '英语' },
    { code: 'ja', name: '日语' },
    { code: 'ko', name: '韩语' },
    { code: 'fr', name: '法语' },
    { code: 'de', name: '德语' },
    { code: 'es', name: '西班牙语' },
    { code: 'it', name: '意大利语' },
    { code: 'ru', name: '俄语' },
    { code: 'ar', name: '阿拉伯语' },
    { code: 'pl', name: '波兰语' },
    { code: 'th', name: '泰语' },
];

// 添加 API 语言代码映射，保持前端语言代码不变
export const apiLanguageMap: { [key: string]: string } = {
    'zh': 'zh',
    'en': 'en',
    'ja': 'jp',
    'ko': 'kor',
    'fr': 'fra',
    'es': 'spa',
    'th': 'th',
    'ar': 'ara',
    'ru': 'ru',
    'de': 'de',
    'it': 'it',
    'pl': 'pl'
};

export const languageMap: { [key: string]: string } = {
    'zh': '中文',
    'en': '英语',
    'ja': '日语',
    'ko': '韩语',
    'fr': '法语',
    'de': '德语',
    'es': '西班牙语',
    'it': '意大利语',
    'ru': '俄语',
    'ar': '阿拉伯语',
    'pl': '波兰语',
    'th': '泰语',
};

export const languagePrompts: { [key: string]: string } = {
    'zh': '请使用中文回答',
    'en': 'Please respond in English only',
    'ja': '日本語で回答してください',
    'ko': '한국어로 답변해 주세요',
    'fr': 'Veuillez répondre en français uniquement',
    'de': 'Bitte antworten Sie nur auf Deutsch',
    'es': 'Por favor, responda solo en español',
    'it': 'Si prega di rispondere solo in italiano',
    'ru': 'Пожалуйста, отвечайте только на русском языке',
    'ar': 'الرجاء الرد باللغة العربية فقط',
    'pl': 'Proszę odpowiadać tylko w języku polskim',
    'th': 'กรุณาตอบเป็นภาษาไทยเท่านั้น',
};

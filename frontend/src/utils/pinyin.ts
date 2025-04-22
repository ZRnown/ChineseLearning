import { pinyin } from 'pinyin-pro';

/**
 * 将汉字转换为拼音，并添加拼音标注
 * @param text 要转换的汉字文本
 * @param options 转换选项
 * @returns 带有拼音标注的HTML字符串
 */
export const addPinyinAnnotation = (text: string, options: {
  style?: 'above' | 'below' | 'inline';
  toneType?: 'symbol' | 'num' | 'none';
} = {}): string => {
  const {
    style = 'above',
    toneType = 'symbol'
  } = options;

  // 使用pinyin-pro库获取拼音
  const pinyinResult = pinyin(text, {
    toneType: toneType === 'symbol' ? 'symbol' : toneType === 'num' ? 'num' : 'none',
    type: 'array'
  });

  // 将拼音结果转换为HTML
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const py = pinyinResult[i] || '';

    // 如果是标点符号或空格，不添加拼音标注
    if (/[\p{P}\s]/u.test(char)) {
      result += `<span class="punctuation">${char}</span>`;
      continue;
    }

    // 根据样式生成不同的HTML
    if (style === 'above') {
      // 拼音在上，汉字在下
      result += `<span class="pinyin-annotation" data-char="${char}" data-pinyin="${py}">
        <span class="pinyin">${py}</span>
        <span class="hanzi">${char}</span>
      </span>`;
    } else if (style === 'below') {
      // 汉字在上，拼音在下
      result += `<span class="pinyin-annotation" data-char="${char}" data-pinyin="${py}">
        <span class="hanzi">${char}</span>
        <span class="pinyin">${py}</span>
      </span>`;
    } else {
      // 内联样式，拼音和汉字在同一行
      result += `<span class="pinyin-annotation" data-char="${char}" data-pinyin="${py}">
        <span class="hanzi">${char}</span>${py ? `<span class="pinyin">(${py})</span>` : ''}
      </span>`;
    }
  }

  return result;
};

/**
 * 将汉字转换为拼音（不带声调）
 * @param text 要转换的汉字文本
 * @returns 拼音字符串
 */
export const toPinyin = (text: string): string => {
  return pinyin(text, {
    toneType: 'none',
    type: 'string'
  }) as string;
};

/**
 * 将汉字转换为拼音（带声调）
 * @param text 要转换的汉字文本
 * @returns 带声调的拼音字符串
 */
export const toPinyinWithTone = (text: string): string => {
  return pinyin(text, {
    toneType: 'symbol',
    type: 'string'
  }) as string;
};
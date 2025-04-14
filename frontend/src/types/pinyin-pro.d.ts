declare module 'pinyin-pro' {
  interface PinyinOptions {
    toneType?: 'symbol' | 'num' | 'none';
    type?: 'string' | 'array';
    separator?: string;
    removeNonZh?: boolean;
    nonZh?: 'removed' | 'consecutive' | 'spaced';
    v?: boolean;
  }

  export function pinyin(text: string, options?: PinyinOptions): string | string[];
} 
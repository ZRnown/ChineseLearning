import { useState, useEffect } from 'react';

// Add type declaration for the window.setTheme function
declare global {
  interface Window {
    setTheme: (theme: string) => void;
  }
}

export default function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    // 检查本地存储
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      return true;
    } else if (savedTheme === 'light') {
      return false;
    }
    // 检查系统偏好
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // 只有当用户没有手动设置主题时才跟随系统
      if (!('theme' in localStorage)) {
        setDarkMode(e.matches);
      }
    };

    // 添加监听器
    mediaQuery.addEventListener('change', handleChange);

    // 清理
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // 使用我们添加的window.setTheme函数
    if (window.setTheme) {
      window.setTheme(darkMode ? 'dark' : 'light');
    } else {
      // 后备方案
      if (darkMode) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.setItem('theme', 'light');
      }
    }
  }, [darkMode]);

  return { darkMode, setDarkMode };
}
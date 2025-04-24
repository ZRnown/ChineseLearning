// 在页面加载或主题更改时检查暗色模式偏好
// 添加在head标签内以避免闪烁(FOUC)
function applyTheme() {
    if (localStorage.theme === 'dark' ||
        (!('theme' in localStorage) &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
    } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    }
}

// 立即应用主题
applyTheme();

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!('theme' in localStorage)) {
        applyTheme();
    }
});

// 暴露设置主题的方法供其他代码使用
window.setTheme = function (theme) {
    if (theme === 'dark') {
        localStorage.theme = 'dark';
    } else if (theme === 'light') {
        localStorage.theme = 'light';
    } else {
        // 根据系统偏好设置
        localStorage.removeItem('theme');
    }
    applyTheme();
}; 
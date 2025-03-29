// ...existing code...

// 添加语言选择的下拉菜单
const languageSelector = document.createElement('select');
languageSelector.id = 'language-selector';
languageSelector.innerHTML = `
    <option value="zh-cn">中文</option>
    <option value="en">English</option>
    <option value="es">Español</option>
    <option value="fr">Français</option>
    <!-- 添加更多语言选项 -->
`;
languageSelector.addEventListener('change', (event) => {
    setLanguage(event.target.value);
});
document.body.appendChild(languageSelector);

// ...existing code...

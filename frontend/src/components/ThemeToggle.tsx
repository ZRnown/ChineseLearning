import { BiSun, BiMoon } from 'react-icons/bi';
import useDarkMode from '../hooks/useDarkMode';

const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useDarkMode();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="切换暗色模式"
    >
      {darkMode ? (
        <BiSun className="w-5 h-5 text-yellow-500" />
      ) : (
        <BiMoon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  );
};

export default ThemeToggle;
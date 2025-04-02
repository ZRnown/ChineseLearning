import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-sm shadow-ink py-4 mt-auto dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-ink-600 dark:text-gray-300 text-sm">
              © 2024 古文导读. 保留所有权利.
            </p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-ink-600 dark:text-gray-300 hover:text-ink-900 dark:hover:text-white text-sm">
              关于我们
            </a>
            <a href="#" className="text-ink-600 dark:text-gray-300 hover:text-ink-900 dark:hover:text-white text-sm">
              使用条款
            </a>
            <a href="#" className="text-ink-600 dark:text-gray-300 hover:text-ink-900 dark:hover:text-white text-sm">
              隐私政策
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
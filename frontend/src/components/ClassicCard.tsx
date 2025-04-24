import React from 'react';
import { Link } from 'react-router-dom';
import { Classic } from '../types/classic';

interface ClassicCardProps {
  classic: Classic;
}

const ClassicCard: React.FC<ClassicCardProps> = ({ classic }) => {
  return (
    <Link to={`/classics/${classic.id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-200">{classic.title}</h3>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors duration-200">
            {classic.author && (
              <span className="mr-3">{classic.author}</span>
            )}
            {classic.dynasty && (
              <span>{classic.dynasty}</span>
            )}
          </div>

          <p className="text-gray-700 dark:text-gray-300 line-clamp-3 mb-3 transition-colors duration-200">
            {classic.content.substring(0, 100)}...
          </p>

          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
            <span>{classic.category || '未分类'}</span>
            <span>查看详情 →</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ClassicCard;
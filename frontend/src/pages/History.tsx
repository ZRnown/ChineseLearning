import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiHistory, BiX, BiCog } from 'react-icons/bi';
import { useHistory } from '../contexts/HistoryContext';

const History: React.FC = () => {
  const { history, clearHistory, maxHistoryItems, setMaxHistoryItems } = useHistory();
  const [showSettings, setShowSettings] = useState(false);
  const [newMaxItems, setNewMaxItems] = useState(maxHistoryItems);

  const handleMaxItemsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setNewMaxItems(value);
    }
  };

  const saveSettings = () => {
    setMaxHistoryItems(newMaxItems);
    setShowSettings(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">浏览历史</h1>
          <p className="text-gray-600">
            最近浏览的古籍 ({history.length}/{maxHistoryItems})
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <BiCog className="mr-2" />
            设置
          </button>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <BiX className="mr-2" />
              清空历史
            </button>
          )}
        </div>
      </div>

      {showSettings && (
        <div className="mb-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">历史记录设置</h2>
          <div className="flex items-center">
            <label htmlFor="maxItems" className="mr-4">最大记录数量：</label>
            <input
              id="maxItems"
              type="number"
              min="1"
              max="20"
              value={newMaxItems}
              onChange={handleMaxItemsChange}
              className="px-3 py-2 border border-gray-300 rounded-md mr-4 w-20"
            />
            <button
              onClick={saveSettings}
              className="px-4 py-2 bg-[#8b4513] text-white rounded-lg hover:bg-[#6b3410] transition-colors"
            >
              保存
            </button>
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <div className="text-center py-16">
          <BiHistory className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">您还没有浏览过任何古籍</p>
          <Link
            to="/classics"
            className="inline-block px-4 py-2 bg-[#8b4513] text-white rounded-lg hover:bg-[#6b3410] transition-colors"
          >
            浏览古籍
          </Link>
        </div>
      ) : (
        <div className="w-full">
          <div className="flex flex-wrap gap-4">
            {history.map((item) => (
              <Link
                key={item.id}
                to={`/classics/${item.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col w-64 min-w-64 h-60"
              >
                <div className="p-4 bg-[#8b4513] text-white">
                  <h3 className="text-lg font-bold truncate">{item.title}</h3>
                  <p className="text-sm opacity-90">{item.author} · {item.dynasty}</p>
                </div>
                <div className="p-4 flex-grow">
                  <p className="text-gray-700 line-clamp-4 text-sm">
                    {item.content.substring(0, 100)}...
                  </p>
                </div>
                <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500">
                  {new Date().toLocaleDateString()} 浏览
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default History; 
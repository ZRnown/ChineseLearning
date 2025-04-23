import React, { createContext, useContext, useState, useEffect } from 'react';
// 导入Classic类型但添加一个别名避免冲突
import { Classic as ClassicType } from '../types/classic';
import { useAuth } from './AuthContext';

// 明确定义HistoryContext中使用的Classic类型，使其与实际类型兼容
type Classic = ClassicType;

interface HistoryContextType {
  history: Classic[];
  addToHistory: (classic: Classic) => void;
  clearHistory: () => void;
  maxHistoryItems: number;
  setMaxHistoryItems: (max: number) => void;
}

const defaultState: HistoryContextType = {
  history: [],
  addToHistory: () => {},
  clearHistory: () => {},
  maxHistoryItems: 5,
  setMaxHistoryItems: () => {},
};

const HistoryContext = createContext<HistoryContextType>(defaultState);

export const useHistory = () => useContext(HistoryContext);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [history, setHistory] = useState<Classic[]>([]);
  const [maxHistoryItems, setMaxHistoryItems] = useState<number>(5);

  // 从本地存储加载历史记录
  useEffect(() => {
    if (user) {
      const storedHistory = localStorage.getItem(`browsing_history_${user.id}`);
      if (storedHistory) {
        try {
          setHistory(JSON.parse(storedHistory));
        } catch (error) {
          console.error('Failed to parse history:', error);
          setHistory([]);
        }
      }
      
      const storedMaxItems = localStorage.getItem(`history_max_items_${user.id}`);
      if (storedMaxItems) {
        try {
          setMaxHistoryItems(parseInt(storedMaxItems, 10));
        } catch (error) {
          console.error('Failed to parse max history items:', error);
        }
      }
    } else {
      // 未登录用户使用本地存储
      const storedHistory = localStorage.getItem('browsing_history_guest');
      if (storedHistory) {
        try {
          setHistory(JSON.parse(storedHistory));
        } catch (error) {
          console.error('Failed to parse history:', error);
          setHistory([]);
        }
      }
      
      const storedMaxItems = localStorage.getItem('history_max_items_guest');
      if (storedMaxItems) {
        try {
          setMaxHistoryItems(parseInt(storedMaxItems, 10));
        } catch (error) {
          console.error('Failed to parse max history items:', error);
        }
      }
    }
  }, [user]);

  // 将历史记录保存到本地存储
  useEffect(() => {
    if (user) {
      localStorage.setItem(`browsing_history_${user.id}`, JSON.stringify(history));
    } else {
      localStorage.setItem('browsing_history_guest', JSON.stringify(history));
    }
  }, [history, user]);

  // 保存最大历史记录数量
  useEffect(() => {
    if (user) {
      localStorage.setItem(`history_max_items_${user.id}`, maxHistoryItems.toString());
    } else {
      localStorage.setItem('history_max_items_guest', maxHistoryItems.toString());
    }
  }, [maxHistoryItems, user]);

  const addToHistory = (classic: Classic) => {
    setHistory(prev => {
      // 检查是否已存在，如果存在则移除旧记录
      const filteredHistory = prev.filter(item => item.id !== classic.id);
      
      // 添加新记录到最前面
      const newHistory = [classic, ...filteredHistory];
      
      // 如果超过最大记录数，则截取
      if (newHistory.length > maxHistoryItems) {
        return newHistory.slice(0, maxHistoryItems);
      }
      
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    if (user) {
      localStorage.removeItem(`browsing_history_${user.id}`);
    } else {
      localStorage.removeItem('browsing_history_guest');
    }
  };

  const updateMaxItems = (max: number) => {
    setMaxHistoryItems(max);
    // 如果当前历史记录超过新设置的最大值，则截断
    if (history.length > max) {
      setHistory(prev => prev.slice(0, max));
    }
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        addToHistory,
        clearHistory,
        maxHistoryItems,
        setMaxHistoryItems: updateMaxItems,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}; 
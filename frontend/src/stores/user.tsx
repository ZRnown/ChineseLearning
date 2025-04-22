import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import type { User } from '../types';

interface UserContextType {
  currentUser: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: { username: string; email: string; password: string }) => Promise<any>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserStore = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserStore must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const isLoggedIn = !!token;

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  async function login(username: string, password: string) {
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      setToken(response.data.token);
      setCurrentUser(response.data.user);
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      throw new Error('登录失败，请检查用户名和密码');
    }
  }

  async function register(userData: { username: string; email: string; password: string }) {
    try {
      const response = await axios.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error('注册失败，请重试');
    }
  }

  function logout() {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('token');
  }

  async function fetchCurrentUser() {
    if (!token) return;
    try {
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentUser(response.data);
    } catch (error) {
      logout();
    }
  }

  const value = {
    currentUser,
    token,
    isLoggedIn,
    login,
    register,
    logout,
    fetchCurrentUser
  };

  return (
    <UserContext.Provider value={value} >
      {children}
    </UserContext.Provider>
  );
};
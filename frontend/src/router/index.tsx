import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ClassicDetail from '../pages/ClassicDetail';
import Classics from '../pages/Classics';
import Translation from '../pages/Translation';
import Favorites from '../pages/Favorites';
import Settings from '../pages/Settings';
import { AuthProvider } from '../contexts/AuthContext';
import React from 'react';

// 创建路由配置
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/classics',
    element: <Classics />
  },
  {
    path: '/classic/:id',
    element: <ClassicDetail />
  },
  {
    path: '/settings',
    element: <Settings />
  },
  {
    path: '/login',
    element: <Login onLogin={() => { }} />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/translation',
    element: <Translation />
  },
  {
    path: '/favorites',
    element: <Favorites />
  }
]);

// 路由提供组件
const AppRouter: React.FC = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default AppRouter;
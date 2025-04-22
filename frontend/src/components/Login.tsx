import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginComponent: React.FC = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleLogin = async (values: LoginFormValues) => {
    try {
      const formData = new FormData();
      formData.append('username', values.username);
      formData.append('password', values.password);

      const response = await fetch('/api/auth/token', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login failed:', errorData.detail);
        setError(errorData.detail);
        return;
      }

      const data = await response.json();

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      await authLogin(values.username, values.password);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError('登录过程中发生错误，请重试');
    }
  };

  return (
    <div className="login-container">
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleLogin({
          username: formData.get('username') as string,
          password: formData.get('password') as string
        });
      }}>
        <div className="form-group">
          <label htmlFor="username">用户名</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">密码</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">登录</button>
      </form>
    </div>
  );
};

export default LoginComponent;
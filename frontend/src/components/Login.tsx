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
      // 显示错误消息
      setError(errorData.detail);
      return;
    }

    const data = await response.json();
    
    // 保存 token
    localStorage.setItem('token', data.access_token);
    
    // 保存用户信息
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // 更新全局用户状态
    setUser(data.user);  // 假设你使用了某种状态管理
    
    // 重定向到主页
    navigate('/');  // 使用 react-router-dom 的 navigate
    
    console.log('Login successful:', data);
  } catch (error) {
    console.error('Login error:', error);
    setError('Login failed. Please try again.');
  }
}; 
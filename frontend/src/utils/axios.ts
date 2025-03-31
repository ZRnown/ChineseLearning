import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api', // 修改默认端口为8000
  timeout: 30000, // 增加超时时间到30秒
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // 允许跨域请求携带凭证
});

// 添加请求拦截器
api.interceptors.request.use(
  config => {
    console.log('Request:', config.url, config.params);
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
api.interceptors.response.use(
  response => {
    console.log('Response:', response.data);
    return response;
  },
  async error => {
    const config = error.config;

    // 如果是网络错误或超时错误，尝试重试
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      config.retryCount = config.retryCount || 0;
      const maxRetries = 3;

      if (config.retryCount < maxRetries) {
        config.retryCount += 1;

        // 创建新的Promise来处理重试
        const backoff = new Promise(resolve => {
          setTimeout(() => {
            resolve(null);
          }, 1000 * config.retryCount); // 指数退避
        });

        // 等待延迟后重试
        await backoff;
        return api(config);
      }
    }

    console.error('API Error:', error);
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - please check if the backend server is running');
    }
    return Promise.reject(error);
  }
);

export default api;
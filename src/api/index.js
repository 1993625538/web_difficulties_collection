import axios from "axios";

const baseApi = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 3000, // 延长超时时间，特别是文件上传
    headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}` // 如果需要认证
    }
});

// 请求拦截器
baseApi.interceptors.request.use(
    (config) => {
        console.log('请求发送至:', config.url);
        // 可以在这里添加 token 等
        // const token = localStorage.getItem('token');
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        console.log(config.headers["Content-Type"]);

        return config;
    },
    (error) => {
        console.error('请求错误:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器
baseApi.interceptors.response.use(
    (response) => {
        console.log('响应接收:', response.config.url);
        return response.data; // 直接返回 data 而不是整个 response
    },
    (error) => {
        console.error('响应错误:', error.response?.status, error.message);
        // 统一错误处理
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 处理未授权
                    break;
                case 404:
                    // 处理未找到
                    break;
                case 500:
                    // 处理服务器错误
                    break;
            }
        }

        return Promise.reject(error);
    }
);

export default baseApi;
import axios from 'axios';
import { useSettingStore } from '../stores/setting.js'; // 引入 setting Store

// 创建 axios 实例（从环境变量获取基础 URL）
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.siliconflow.cn/v1',
  timeout: 15000, // 超时时间 15s
  headers: { 'Content-Type': 'application/json' },
});

// 请求拦截器：注入 API 密钥、通用配置，并保存流式开关状态到 config
service.interceptors.request.use(
  (config) => {
    const settingStore = useSettingStore(); // 获取 setting Store
    const { apiKey, model, stream, maxTokens, temperature, topP, topK } = settingStore.settings;

    // 注入 API 密钥（从 Store 获取）
    if (apiKey) {
      config.headers.Authorization = `Bearer ${apiKey}`;
    } else {
      console.warn('未配置 API 密钥，可能导致请求失败');
    }

    // 保存流式开关状态到 config（供响应拦截器使用）
    config.stream = stream;

    // 自动填充模型相关参数（仅针对 POST /chat/completions）
    if (config.method === 'post' && config.url.includes('/chat/completions')) {
      config.data = {
        ...config.data, // 保留手动传入的参数（如 messages）
        model: model, // 从 Store 获取当前模型
        stream: stream, // 从 Store 获取流式开关
        max_tokens: maxTokens, // 从 Store 获取最大 Token 数
        temperature: temperature, // 从 Store 获取温度参数
        top_p: topP, // 从 Store 获取核采样参数
        top_k: topK, // 从 Store 获取前 K 采样参数
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：根据流式开关返回不同格式响应
service.interceptors.response.use(
  (response) => {
    // 从请求 config 中获取流式开关状态
    const isStream = response.config.stream;

    if (isStream) {
      // 流式响应：返回原始响应对象（包含可读流）
      return response;
    } else {
      // 非流式响应：返回解析后的 JSON 数据
      return response.data;
    }
  },
  (error) => {
    const message = error.response?.data?.message || '请求失败，请检查网络或配置';
    console.error('请求错误:', message);
    return Promise.reject(message);
  }
);

export default service; // 导出 axios 实例供 api.js 使用


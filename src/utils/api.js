import service from './request.js';

// 发送聊天请求（只需传递 messages，其他参数自动从 setting.js 获取）
export const createChatCompletion = (messages) => {
  return service.post('/chat/completions', {
    messages: messages, // 手动传递消息列表
    // 其他参数（model/stream 等）由 request.js 自动填充
  });
};
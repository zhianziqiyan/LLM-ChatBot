import { useSettingStore } from '../stores/setting'

// 定义 API 基础 URL（后端接口的根路径）
const API_BASE_URL = 'https://api.siliconflow.cn/v1'

/**
 * 调用聊天模型 API 获取回复的核心函数
 * @param {Array<object>} messages - 对话消息列表（格式：{ role: 'user'|'assistant', content: '消息内容' }）
 * @returns {Promise<Response|object>} - 流式响应返回 Response 对象，非流式返回包含回复数据的对象（含 speed 字段）
 */
export const createChatCompletion = async (messages) => {
  // 获取全局的 setting store 实例（包含用户配置）
  const settingStore = useSettingStore()

  // 构造请求负载（根据用户配置生成请求参数）
  const payload = {
    model: settingStore.settings.model,          // 用户选择的模型（如 "deepseek-ai/DeepSeek-R1"）
    messages,                                     // 对话消息列表（传递给模型的上下文）
    stream: settingStore.settings.stream,        // 是否启用流式响应（用户配置的开关）
    max_tokens: settingStore.settings.maxTokens, // 最大返回 Token 数（限制输出长度）
    temperature: settingStore.settings.temperature, // 温度参数（控制输出随机性）
    top_p: settingStore.settings.topP,           // 核采样参数（控制输出确定性）
    top_k: settingStore.settings.topK,           // 前 K 采样参数（限制候选词数量）
  }

  // 构造 fetch 请求配置（包含请求方法、头部和请求体）
  const options = {
    method: 'POST',                               // 使用 POST 方法提交数据
    headers: {
      Authorization: `Bearer ${settingStore.settings.apiKey}`, // API 密钥（用于身份验证）
      'Content-Type': 'application/json',         // 指定请求体为 JSON 格式
    },
    body: JSON.stringify(payload),               // 将负载转换为 JSON 字符串
  }

  try {
    const startTime = Date.now() // 记录请求开始时间（用于计算响应速度）
    // 发送请求到后端聊天接口
    const response = await fetch(`${API_BASE_URL}/chat/completions`, options)

    // 检查 HTTP 状态码（非 2xx 状态抛出错误）
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 根据用户配置的流式开关，返回不同格式的响应
    if (settingStore.settings.stream) {
      return response // 流式响应直接返回 Response 对象（需流式读取）
    } else {
      const data = await response.json() // 非流式响应解析为 JSON 对象
      const duration = (Date.now() - startTime) / 1000 // 计算请求耗时（秒）
      // 计算响应速度（Token/秒）并添加到返回数据中
      data.speed = (data.usage.completion_tokens / duration).toFixed(2)
      return data // 返回包含 speed 字段的完整数据
    }
  } catch (error) {
    console.error('Chat API Error:', error) // 打印错误日志
    throw error // 抛出错误供上层逻辑处理（如显示错误提示）
  }
}

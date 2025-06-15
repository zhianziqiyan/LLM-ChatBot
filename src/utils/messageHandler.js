/**
 * 消息处理工具对象（封装消息格式化、响应处理等核心逻辑）
 */
export const messageHandler = {
    /**
  * 格式化消息对象（用于统一消息结构）
  * @param {string} role - 消息角色（'user' 用户 / 'assistant' 助手）
  * @param {string} content - 消息正文内容
  * @param {string} [reasoning_content=''] - 推理过程（可选）
  * @returns {object} 格式化后的消息对象
  */
    formatMessage(role, content, reasoning_content = '') {
        return {
            id: Date.now(), // 使用时间戳生成唯一 ID
            role, // 消息角色（决定显示样式）
            content, // 消息正文
            reasoning_content, // 推理过程（用于展示详细思考步骤）
            completion_tokens: 0, // 消耗的 Token 数（初始为 0，后续填充）
            speed: 0, // 响应速度（Token/秒，初始为 0，后续填充）
            loading: false, // 加载状态（控制加载动画，初始为未加载）
        }
    },
    /**
   * 处理流式响应（逐行读取并更新消息内容）
   * @param {Response} response - 流式响应对象（来自 fetch 的 Response）
   * @param {Function} updateCallback - 更新回调（接收 content, reasoning, tokens, speed）
   */
    async handleStreamResponse(response, updateCallback) {
      const reader = response.body.getReader() // 获取流式读取器
      const decoder = new TextDecoder() // 用于解码二进制数据为字符串
      let accumulatedContent = '' // 累加的消息正文（流式逐步填充）
      let accumulatedReasoning = '' // 累加的推理过程（流式逐步填充）
      let startTime = Date.now() // 记录响应开始时间（用于计算速度）
  
      while (true) {
        const { done, value } = await reader.read() // 读取流式数据块
        if (done) break // 读取完成时退出循环
  
        const chunk = decoder.decode(value) // 解码二进制数据为字符串
        // 按行分割数据（过滤空行）
        const lines = chunk.split('\n').filter((line) => line.trim() !== '')
  
        for (const line of lines) {
          if (line === 'data: [DONE]') continue // 忽略结束标志
          if (line.startsWith('data: ')) { // 处理数据行（格式：data: JSON）
            const data = JSON.parse(line.slice(5)) // 提取 JSON 数据（去掉 'data: ' 前缀）
            const content = data.choices[0].delta.content || '' // 本次返回的正文增量
            const reasoning = data.choices[0].delta.reasoning_content || '' // 本次返回的推理增量
  
            accumulatedContent += content // 累加正文
            accumulatedReasoning += reasoning // 累加推理过程
  
            // 调用回调更新 UI（传递当前累计内容、Token 数、速度）
            updateCallback(
              accumulatedContent,
              accumulatedReasoning,
              data.usage?.completion_tokens || 0, // 累计消耗的 Token 数
              ((data.usage?.completion_tokens || 0) / ((Date.now() - startTime) / 1000)).toFixed(2) // 速度（Token/秒）
            )
          }
        }
      }
    },

    /**
   * 处理非流式响应（一次性获取完整内容）
   * @param {object} response - 非流式响应数据（已解析的 JSON 对象）
   * @param {Function} updateCallback - 更新回调（接收 content, reasoning, tokens, speed）
   */
    handleNormalResponse(response, updateCallback) {
        // 直接提取完整内容并调用回调
        updateCallback(
          response.choices[0].message.content, // 完整正文
          response.choices[0].message.reasoning_content || '', // 完整推理过程
          response.usage.completion_tokens, // 总消耗 Token 数
          response.speed // 响应速度（来自 API 计算）
        )
      },

      /**
   * 统一响应处理入口（根据是否流式选择处理方式）
   * @param {Response|object} response - 原始响应（流式为 Response 对象，非流式为 JSON 对象）
   * @param {boolean} isStream - 是否为流式响应
   * @param {Function} updateCallback - 更新回调（传递给具体处理方法）
   */
      async handleResponse(response, isStream, updateCallback) {
        if (isStream) {
          await this.handleStreamResponse(response, updateCallback) // 流式处理
        } else {
          this.handleNormalResponse(response, updateCallback) // 非流式处理
        }
      },
}
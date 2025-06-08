import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingStore = defineStore(
  'llm-setting',
  ()=>{
    /**
     * 存储用户的聊天配置
     * @type {Ref<object>}
     * @property {string} model - 当前选择的模型（如 "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B"）
     * @property {string} apiKey - 用户的 API 密钥（用于调用模型接口）
     * @property {boolean} stream - 是否开启流式响应（开启后逐句返回结果）
     * @property {number} maxTokens - 最大返回 Token 数（限制单次对话的输出长度）
     * @property {number} temperature - 温度参数（控制输出随机性，0~1，值越大越随机）
     * @property {number} topP - 核采样参数（0~1，值越小输出越确定）
     * @property {number} topK - 前 K 采样参数（限制候选词数量）
     */
    const settings = ref({
        model: 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B',
        apiKey: '',
        stream: true,
        maxTokens: 2048,
        temperature: 0.8,
        topP: 0.8,
        topK: 40,
    })
    return {
        settings
    }
  },
  {
    persist: true
  }

)

/**
 * 可选的模型列表（用于下拉选择）
 * @type {Array<object>}
 * @property {string} label - 模型显示名称（如 "DeepSeek-R1"）
 * @property {string} value - 模型标识（用于接口调用）
 * @property {number} maxTokens - 该模型支持的最大 Token 数（用于校验配置）
 */
export const modelOptions = [
    {
        label: 'DeepSeek-R1',
        value: 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B',
        maxTokens: 2048,
    },
    {
        label: 'Qwen3-8B',
        value: 'Qwen/Qwen3-8B',
        maxTokens: 2048,
    },
    {
        label:'GLM-Z1-9B-0414',
        value: 'THUDM/GLM-Z1-9B-0414',
        maxTokens: 2048,
    }
]
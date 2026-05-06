import type { AppSettings } from '@/types'

export const API_BASE_URL = 'https://api.siliconflow.cn/v1'

export const DEFAULT_SETTINGS: AppSettings = {
  model: 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B',
  apiKey: '',
  stream: true,
  maxTokens: 2048,
  temperature: 0.8,
  topP: 0.8,
  topK: 40,
}

export const APP_NAME = 'LLM ChatBot'

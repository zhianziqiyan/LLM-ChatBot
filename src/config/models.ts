import type { ModelOption } from '@/types'

export const MODEL_OPTIONS: ModelOption[] = [
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
    label: 'GLM-Z1-9B-0414',
    value: 'THUDM/GLM-Z1-9B-0414',
    maxTokens: 2048,
  },
]

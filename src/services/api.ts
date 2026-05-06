import { useSettingStore } from '@/stores/settings'
import { API_BASE_URL } from '@/config'
import type { ChatCompletionResponse } from '@/types'

const CHAT_ENDPOINT = `${API_BASE_URL}/chat/completions`

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function createChatCompletion(
  messages: Array<{ role: string; content: string }>,
): Promise<Response | ChatCompletionResponse> {
  const settingStore = useSettingStore()
  const { settings } = settingStore

  const payload = {
    model: settings.model,
    messages,
    stream: settings.stream,
    max_tokens: settings.maxTokens,
    temperature: settings.temperature,
    top_p: settings.topP,
    top_k: settings.topK,
  }

  const startTime = Date.now()

  const response = await fetch(CHAT_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${settings.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let errorMsg = `HTTP ${response.status}`
    try {
      const errBody = await response.json()
      errorMsg = errBody.error?.message || errorMsg
    } catch {
      /* ignore parse error */
    }
    throw new ApiError(errorMsg, response.status)
  }

  if (settings.stream) {
    return response
  }

  const data: ChatCompletionResponse = await response.json()
  const duration = (Date.now() - startTime) / 1000
  if (data.usage) {
    data.speed = (data.usage.completion_tokens / duration).toFixed(2)
  }
  return data
}

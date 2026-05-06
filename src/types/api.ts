export interface ChatCompletionRequest {
  model: string
  messages: Array<{ role: string; content: string }>
  stream: boolean
  max_tokens: number
  temperature: number
  top_p: number
  top_k: number
}

export interface ChatCompletionChoice {
  index: number
  delta?: {
    role?: string
    content?: string
    reasoning_content?: string
  }
  message?: {
    role: string
    content: string
    reasoning_content?: string
  }
  finish_reason: string | null
}

export interface ChatCompletionUsage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

export interface ChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: ChatCompletionChoice[]
  usage?: ChatCompletionUsage
  speed?: string
}

export interface StreamChunk {
  choices?: Array<{
    delta?: {
      content?: string
      reasoning_content?: string
    }
    finish_reason?: string | null
  }>
  usage?: ChatCompletionUsage
}

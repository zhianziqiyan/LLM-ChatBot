export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  reasoning_content: string
  completion_tokens: number
  speed: string
  loading: boolean
  timestamp: string
  error?: string
}

export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
}

export interface StreamUpdate {
  content: string
  reasoning_content: string
  completion_tokens: number
  speed: string
}

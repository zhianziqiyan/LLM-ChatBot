export interface AppSettings {
  model: string
  apiKey: string
  stream: boolean
  maxTokens: number
  temperature: number
  topP: number
  topK: number
}

export interface ModelOption {
  label: string
  value: string
  maxTokens: number
}

export type ThemeMode = 'light' | 'dark' | 'auto'

export type Language = 'zh' | 'en'

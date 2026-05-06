import { useChatStore } from '@/stores/chat'
import { useSettingStore } from '@/stores/settings'
import { createChatCompletion, handleStreamResponse, handleNormalResponse, ApiError } from '@/services'
import type { ChatMessage, ChatCompletionResponse } from '@/types'

export function useChat() {
  const chatStore = useChatStore()
  const settingStore = useSettingStore()

  let abortController: AbortController | null = null

  function buildMessage(role: 'user' | 'assistant', content: string, reasoningContent = ''): Omit<ChatMessage, 'id' | 'timestamp'> {
    return {
      role,
      content,
      reasoning_content: reasoningContent,
      completion_tokens: 0,
      speed: '0',
      loading: false,
    }
  }

  async function sendMessage(content: string): Promise<void> {
    if (chatStore.isLoading) return

    chatStore.addMessage(buildMessage('user', content))
    chatStore.addMessage(buildMessage('assistant', ''))
    chatStore.setIsLoading(true)
    chatStore.setIsStreaming(true)

    const lastMsg = chatStore.getLastMessage()
    if (lastMsg) lastMsg.loading = true

    abortController = new AbortController()

    try {
      const messages = chatStore.currentMessages
        .filter((m) => !m.loading)
        .map(({ role, content: c }) => ({ role, content: c }))

      const response = await createChatCompletion(messages)

      if (settingStore.settings.stream) {
        await handleStreamResponse(response as Response, (update) => {
          chatStore.updateLastMessage({
            content: update.content,
            reasoning_content: update.reasoning_content,
            completion_tokens: update.completion_tokens,
            speed: update.speed,
          })
        })
      } else {
        handleNormalResponse(response as ChatCompletionResponse, (update) => {
          chatStore.updateLastMessage({
            content: update.content,
            reasoning_content: update.reasoning_content,
            completion_tokens: update.completion_tokens,
            speed: update.speed,
          })
        })
      }
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Network error, please try again'
      chatStore.updateLastMessage({ content: '', error: msg })
    } finally {
      chatStore.setIsLoading(false)
      chatStore.setIsStreaming(false)
      const finalMsg = chatStore.getLastMessage()
      if (finalMsg) finalMsg.loading = false
      abortController = null
    }
  }

  function stopStreaming() {
    abortController?.abort()
    chatStore.setIsLoading(false)
    chatStore.setIsStreaming(false)
    const lastMsg = chatStore.getLastMessage()
    if (lastMsg) lastMsg.loading = false
  }

  function retryLastMessage() {
    const msgs = chatStore.currentMessages
    if (msgs.length < 2) return
    // Remove last assistant message and retry
    const conv = chatStore.currentConversation
    if (!conv) return
    conv.messages.pop()
    const lastUserMsg = conv.messages[conv.messages.length - 1]
    if (!lastUserMsg || lastUserMsg.role !== 'user') return
    const userContent = lastUserMsg.content
    conv.messages.pop()
    sendMessage(userContent)
  }

  return { sendMessage, stopStreaming, retryLastMessage }
}

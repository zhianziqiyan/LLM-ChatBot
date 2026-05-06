import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLanguageStore } from './language'
import type { Conversation, ChatMessage } from '@/types'

const NEW_CHAT_TITLES: Record<string, string> = {
  zh: '新对话',
  en: 'New Chat',
}

export const useChatStore = defineStore(
  'chat',
  () => {
    const langStore = useLanguageStore()
    const defaultTitle = computed(() => NEW_CHAT_TITLES[langStore.locale] ?? 'New Chat')

    const conversations = ref<Conversation[]>([
      {
        id: '1',
        title: NEW_CHAT_TITLES[langStore.locale] ?? 'New Chat',
        messages: [],
        createdAt: Date.now(),
      },
    ])

    const isLoading = ref(false)
    const currentConversationId = ref('1')
    const isStreaming = ref(false)

    const currentConversation = computed<Conversation | undefined>(() =>
      conversations.value.find((c) => c.id === currentConversationId.value),
    )

    const currentMessages = computed<ChatMessage[]>(() =>
      currentConversation.value?.messages ?? [],
    )

    const sortedConversations = computed(() =>
      [...conversations.value].sort((a, b) => b.createdAt - a.createdAt),
    )

    function setIsLoading(value: boolean) {
      isLoading.value = value
    }

    function setIsStreaming(value: boolean) {
      isStreaming.value = value
    }

    function createConversation() {
      const conv: Conversation = {
        id: Date.now().toString(),
        title: defaultTitle.value,
        messages: [],
        createdAt: Date.now(),
      }
      conversations.value.unshift(conv)
      currentConversationId.value = conv.id
    }

    function switchConversation(id: string) {
      currentConversationId.value = id
    }

    function deleteConversation(id: string) {
      const idx = conversations.value.findIndex((c) => c.id === id)
      if (idx === -1) return
      conversations.value.splice(idx, 1)
      if (currentConversationId.value === id) {
        currentConversationId.value = conversations.value[0]?.id ?? '1'
      }
    }

    function updateConversationTitle(id: string, title: string) {
      const conv = conversations.value.find((c) => c.id === id)
      if (conv) conv.title = title
    }

    function addMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>) {
      const conv = currentConversation.value
      if (!conv) return
      conv.messages.push({
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        timestamp: new Date().toISOString(),
        ...message,
      })
    }

    function updateLastMessage(partial: Partial<ChatMessage>) {
      const conv = currentConversation.value
      if (!conv || conv.messages.length === 0) return
      Object.assign(conv.messages[conv.messages.length - 1], partial)
    }

    function getLastMessage(): ChatMessage | null {
      const conv = currentConversation.value
      if (!conv || conv.messages.length === 0) return null
      return conv.messages[conv.messages.length - 1]
    }

    function clearCurrentMessages() {
      const conv = currentConversation.value
      if (conv) conv.messages = []
    }

    return {
      conversations,
      isLoading,
      isStreaming,
      currentConversationId,
      currentConversation,
      currentMessages,
      sortedConversations,
      setIsLoading,
      setIsStreaming,
      createConversation,
      switchConversation,
      deleteConversation,
      updateConversationTitle,
      addMessage,
      updateLastMessage,
      getLastMessage,
      clearCurrentMessages,
    }
  },
  { persist: true },
)

<script setup lang="ts">
import { ref, inject, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useChatStore } from '@/stores/chat'
import { useChat } from '@/composables/useChat'
import { useAutoScroll } from '@/composables/useAutoScroll'
import ChatMessage from './ChatMessage.vue'
import ChatInput from './ChatInput.vue'
import EmptyState from './EmptyState.vue'
import AppIcon from '@/components/common/AppIcon.vue'

const { t } = useI18n()
const chatStore = useChatStore()
const { sendMessage, stopStreaming, retryLastMessage } = useChat()

const messagesContainerRef = ref<HTMLDivElement | null>(null)
const { onScroll, scrollToBottom } = useAutoScroll(messagesContainerRef)
const toggleSidebar = inject<() => void>('toggleSidebar', () => {})

const isMobile = ref(window.innerWidth < 768)

function handleResize() {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  scrollToBottom()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

watch(
  () => chatStore.currentMessages.length,
  () => scrollToBottom(),
)

async function handleSubmit(content: string) {
  await sendMessage(content)
}

function title() {
  const conv = chatStore.currentConversation
  if (!conv) return 'LLM Chat'
  return conv.title.length > 20 ? conv.title.slice(0, 20) + '...' : conv.title
}
</script>

<template>
  <div class="chat-view">
    <!-- Header -->
    <header class="chat-header">
      <button
        v-if="isMobile"
        class="menu-btn"
        @click="toggleSidebar"
      >
        <AppIcon name="menu" :size="20" />
      </button>
      <h1 class="chat-title">{{ title() }}</h1>
      <button
        v-if="chatStore.currentMessages.length > 0"
        class="clear-btn"
        @click="chatStore.clearCurrentMessages()"
        :title="t('chatView.clear')"
      >
        <AppIcon name="delete" :size="16" />
      </button>
    </header>

    <!-- Messages -->
    <div
      ref="messagesContainerRef"
      class="messages-container"
      @scroll="onScroll"
    >
      <EmptyState v-if="chatStore.currentMessages.length === 0" />
      <div v-else class="messages-list">
        <ChatMessage
          v-for="msg in chatStore.currentMessages"
          :key="msg.id"
          :message="msg"
          @retry="retryLastMessage"
        />
      </div>
    </div>

    <!-- Input -->
    <div class="chat-input-area">
      <ChatInput @submit="handleSubmit" @stop="stopStreaming" />
    </div>
  </div>
</template>

<style scoped>
.chat-view {
  flex: 1;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
  min-width: 0;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  height: var(--header-height);
  padding: 0 20px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.menu-btn:hover {
  background: var(--color-bg-secondary);
}

.chat-title {
  flex: 1;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  color: var(--color-text-tertiary);
  transition: all var(--transition-fast);
}

.clear-btn:hover {
  background: var(--color-error-bg);
  color: var(--color-error);
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

.messages-list {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
}

.chat-input-area {
  padding: 12px 20px 16px;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  flex-shrink: 0;
}

@media (max-width: 767px) {
  .chat-header {
    padding: 0 16px;
  }

  .messages-container {
    padding: 12px 12px;
  }

  .chat-input-area {
    padding: 10px 12px 12px;
  }
}
</style>

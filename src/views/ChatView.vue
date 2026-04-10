<script setup>
  import ChatInput from '../components/ChatInput.vue';
import ChatMessage from '../components/ChatMessage.vue';
import { ref, computed, nextTick, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useChatStore } from '../stores/chat.js';
import { useSettingStore } from '../stores/setting.js';
import { createChatCompletion } from '../utils/api.js';
import { messageHandler } from '../utils/messageHandler.js';
import { ChatLineRound } from '@element-plus/icons-vue';

const { t } = useI18n();
const chatStore = useChatStore();
const settingStore = useSettingStore();
const isLoading = computed(() => chatStore.isLoading);
const currentMessages = computed(() => chatStore.currentMessages);
const messagesContainerRef = ref(null);

const currentTitle = computed(() => chatStore.currentConversation?.title || 'LLM Chat');

const formatTitle = (title) => {
  return title.length > 4 ? title.slice(0, 4) + '...' : title
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainerRef.value) {
      const container = messagesContainerRef.value;
      container.scrollTop = container.scrollHeight;
    }
  });
};

watch(currentMessages, () => {
  scrollToBottom();
}, { deep: true });

const handleMessageSubmit = async (messageContent) => {
  try {
    chatStore.addMessage(
      messageHandler.formatMessage('user', messageContent, '')
    )
    chatStore.addMessage(
      messageHandler.formatMessage('assistant', '', '')
    )

    chatStore.setIsLoading(true);
    const lastMessage = chatStore.getLastMessage()
    lastMessage.loading = true

    scrollToBottom();

    const messages = chatStore.currentMessages.map(({ role, content }) => ({ role, content }))
    const response = await createChatCompletion(messages)

    await messageHandler.handleResponse(
      response,
      settingStore.settings.stream,
      (content, reasoning_content, tokens, speed) => {
        chatStore.updateLastMessage(content, reasoning_content, tokens, speed)
        scrollToBottom();
      }
    )

  } catch (error) {
    console.error('Full error:', error);
    chatStore.updateLastMessage(t('chatView.errorMessage') + error.message)
  } finally {
    chatStore.setIsLoading(false)
    const lastMessage = chatStore.getLastMessage()
    if (lastMessage) lastMessage.loading = false
  }
};
</script>

<template>
  <div class="chat-view-container">
    <el-header class="chat-header">
      <span class="current-title">{{ currentTitle }}</span>
    </el-header>

    <el-main class="messages-container" ref="messagesContainerRef">
      <div v-if="currentMessages.length === 0" class="empty-state">
        <div class="empty-icon">
          <el-icon :size="64"><ChatLineRound /></el-icon>
        </div>
        <h2 class="empty-title">{{ t('chatView.emptyTitle') }}</h2>
        <p class="empty-description">{{ t('chatView.emptyDescription') }}</p>
      </div>
      <div v-else class="messages-list">
        <ChatMessage
          v-for="(message, index) in currentMessages"
          :key="message.id"
          :message="message"
          :is-last-assistant-message="index === currentMessages.length - 1"
        />
      </div>
    </el-main>

    <div class="input-container">
      <ChatInput @submit="handleMessageSubmit" :loading="isLoading" />
    </div>
  </div>
</template>

<style scoped>
.chat-view-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-color);
}

.chat-header {
  height: 60px;
  line-height: 60px;
  padding: 0 32px;
  background: #ffffff;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.current-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--text-secondary);
}

.empty-icon {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-light) 0%, #ffffff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.empty-description {
  font-size: 14px;
  color: var(--text-placeholder);
  margin: 0;
}

.messages-list {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
}

.input-container {
  padding: 16px 32px 24px;
  background: #ffffff;
  border-top: 1px solid var(--border-color);
}
</style>

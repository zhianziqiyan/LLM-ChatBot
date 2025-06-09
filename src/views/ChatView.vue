<script setup>
import ChatInput from '../components/ChatInput.vue';
import ChatMessage from '../components/ChatMessage.vue'; // 新增：导入消息显示组件

import { ref, computed } from 'vue';

import { useChatStore } from '../stores/chat.js';
import { useSettingStore } from '../stores/setting.js';

import { createChatCompletion } from '../utils/api.js';
import { messageHandler } from '../utils/messageHandler.js'; // 导入消息处理器

const chatStore = useChatStore();
const settingStore = useSettingStore();
const isLoading = computed(() => chatStore.isLoading)
const currentMessages = computed(() => chatStore.currentMessages);

// 当前对话标题（计算属性，从 Store 获取）
const currentTitle = computed(() => chatStore.currentConversation?.title || 'LLM Chat')
// 格式化标题（过长时截断显示）
const formatTitle = (title) => {
  return title.length > 4 ? title.slice(0, 4) + '...' : title // 超过4字符显示前4位+...
}

// 处理输入框提交事件（包含 API 调用）
const handleMessageSubmit = async (messageContent) => {
  try {
    // 1. 添加用户消息到当前对话（使用消息处理器格式化）
    chatStore.addMessage(
      messageHandler.formatMessage('user', messageContent, '')
    )
    // 2. 添加空的助手消息占位（等待 API 响应填充内容）
    chatStore.addMessage(
      messageHandler.formatMessage('assistant', '', '')
    )

    // 3. 开启加载状态（输入框显示加载动画）
    chatStore.setIsLoading(true);
    const lastMessage = chatStore.getLastMessage() // 获取最后一条消息（助手消息）
    lastMessage.loading = true // 标记消息为加载中（用于 UI 状态）

    // 4. 调用 API 获取模型回复（传入当前对话的消息列表）
    const messages = chatStore.currentMessages.map(({ role, content }) => ({ role, content }))
    const response = await createChatCompletion(messages)

    // 5. 处理 API 响应（流式或非流式）
    await messageHandler.handleResponse(
      response, // API 原始响应
      settingStore.settings.stream, // 是否开启流式响应（来自设置）
      // 流式回调：逐步更新助手消息内容（正文、推理过程、Token 数、速度）
      (content, reasoning_content, tokens, speed) => {
        chatStore.updateLastMessage(content, reasoning_content, tokens, speed)
      }
    )

  } catch (error) {
    // 错误处理：更新助手消息为错误提示
    console.error('Failed to send message:', error)
    chatStore.updateLastMessage('抱歉，发生了一些错误，请稍后重试。')
  } finally {
    // 无论成功/失败，重置加载状态
    chatStore.setIsLoading(false)
    const lastMessage = chatStore.getLastMessage()
    lastMessage.loading = false
  }
};
</script>

<template>
  <el-container class="chat-view-container">
    <el-header class="chat-header">
      <span class="current-title">{{ currentTitle }}</span>
    </el-header>

    <el-main class="messages-container">
      <!-- 没有消息时显示空状态 -->
      <div v-if="currentMessages.length === 0" class="empty-state">
        <el-icon class="empty-logo">
          <ChatLineRound />
        </el-icon>
        <p class="empty-text">有什么可以帮忙的？</p>
      </div>
      <!-- 有消息时显示消息列表 -->
      <div v-else class="messages-list">
        <ChatMessage
         v-for="(message,index) in currentMessages" 
         :key="message.id" 
         :message="message"
         :is-last-assistant-message="index === currentMessages.length - 1"
          />
      </div>
    </el-main>

    <div class="input-container">
      <ChatInput @submit="handleMessageSubmit" :loading="isLoading" />
    </div>
  </el-container>
</template>

<style scoped>
.chat-view-container {
  height: 100vh;
  /* 占满整个视口高度 */
}

.chat-header {
  height: 56px;
  /* Header高度固定 */
  line-height: 60px;
  /* 文字垂直居中 */
  padding: 0 24px;
  background: #ffffff;
  border-bottom: 1px solid #e9ecef;
  font-size: 16px;
  font-weight: 500;
}

.messages-container {
  padding: 24px;
  overflow-y: auto;
  /* 消息过多时滚动 */
  background: #ffffff;
  display: flex;
  /* 启用flex布局 */
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中（关键修改） */
  /* 移除 min-height: 100%，避免强制占满父容器 */
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #6c757d;
}

.empty-logo {
  font-size: 48px;
  color: #ced4da;
}

.empty-text {
  font-size: 14px;
}

.messages-list {
  width: 100%;
  overflow-y: auto;
}
</style>
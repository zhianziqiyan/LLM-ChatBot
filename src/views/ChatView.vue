<script setup>
import { ref, computed } from 'vue';
import ChatInput from '../components/ChatInput.vue'; 
import { useChatStore } from '../stores/chat.js'; // 引入聊天状态管理
import { sendChatMessage } from '../utils/api.js'; // 引入 API 发送方法

const chatStore = useChatStore(); // 获取聊天状态实例

// 当前对话标题（从 Store 获取）
const currentConversationTitle = computed(() => {
  return chatStore.currentConversation?.title || '新对话';
});

// 是否有消息（从 Store 获取）
const hasMessages = computed(() => {
  return chatStore.currentMessages.length > 0;
});

// 处理输入框提交事件（包含 API 调用）
const handleMessageSubmit = async (content) => {
  chatStore.addMessage({ role: 'user', content });

  try {
    const response = await sendChatMessage(chatStore.currentMessages);
    
    // 根据实际响应结构调整：直接获取 choices[0].message.content
    const assistantContent = response.choices?.[0]?.message?.content;
    if (assistantContent) {
      chatStore.addMessage({ 
        role: 'assistant', 
        content: assistantContent 
      });
    } else {
      // 处理响应中无 content 的异常情况
      chatStore.addMessage({ 
        role: 'system', 
        content: '未获取到有效回复内容' 
      });
    }
  } catch (error) {
    console.error('消息发送失败:', error);
    chatStore.addMessage({ 
      role: 'system', 
      content: '消息发送失败，请检查网络或重试' 
    });
  }
};
</script>

<template>
  <el-container class="chat-view-container">
    <el-header class="chat-header">
      <span class="current-title">{{ currentConversationTitle }}</span>
    </el-header>

    <el-main class="messages-container">
      <div v-if="!hasMessages" class="empty-state">
        <el-icon class="empty-logo">
          <ChatLineRound />
        </el-icon>
        <p class="empty-text">有什么可以帮忙的？</p>
      </div>
      <!-- 消息列表后续补充 -->
    </el-main>

    <div class="input-container">
      <ChatInput @submit="handleMessageSubmit" /> <!-- 监听提交事件 -->
    </div>
  </el-container>
</template>

<style scoped>
.chat-view-container {
  height: 100vh; /* 占满整个视口高度 */
}

.chat-header {
  height: 56px; /* Header高度固定 */
  line-height: 60px; /* 文字垂直居中 */
  padding: 0 24px;
  background: #ffffff;
  border-bottom: 1px solid #e9ecef;
  font-size: 16px;
  font-weight: 500;
}

.messages-container {
  padding: 24px;
  overflow-y: auto; /* 消息过多时滚动 */
  background: #ffffff;
  display: flex; /* 启用flex布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中（关键修改） */
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
</style>
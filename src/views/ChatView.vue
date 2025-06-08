<script setup>
import { ref, computed } from 'vue';
import ChatInput from '../components/ChatInput.vue'; 
// import { useChatStore } from '../stores/chat.js'; // 假设已定义聊天Store

// // 获取聊天Store
// const chatStore = useChatStore();

// // 当前对话标题（从Store获取，若不存在则显示默认）
// const currentConversationTitle = computed(() => {
//   return chatStore.currentConversation?.title || '新对话';
// });

// // 是否有消息（从Store获取当前对话的消息数量）
// const hasMessages = computed(() => {
//   return chatStore.currentMessages.length > 0;
// });

// // 处理输入框提交事件
// const handleMessageSubmit = (e) => {
//   const content = e.detail.content;
//   // 调用Store添加消息（示例逻辑，需根据实际接口补充）
//   chatStore.addMessage({ role: 'user', content });
// };
</script>

<template>
  <el-container class="chat-view-container">
    <!-- 顶部 Header -->
    <el-header class="chat-header">
      <span class="current-title">{{ currentConversationTitle }}</span>
    </el-header>

    <!-- 消息容器 -->
    <el-main class="messages-container">
      <!-- 无消息时显示空状态 -->
      <div v-if="!hasMessages" class="empty-state">
        <el-icon class="empty-logo">
          <ChatLineRound />
        </el-icon>
        <p class="empty-text">有什么可以帮忙的？</p>
      </div>
      <!-- 有消息时渲染消息列表（暂留空，后续补充） -->
    </el-main>

    <!-- 底部输入框 -->
    <div class="input-container">
      <ChatInput @submit="handleMessageSubmit" />
    </div>
  </el-container>
</template>

<style scoped>
.chat-view-container {
  height: 100vh; /* 占满整个视口高度 */
}

.chat-header {
  height: 60px; /* Header高度固定 */
  line-height: 60px; /* 文字垂直居中 */
  padding: 0 24px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  font-size: 16px;
  font-weight: 500;
}

.messages-container {
  padding: 24px;
  overflow-y: auto; /* 消息过多时滚动 */
  background: #ffffff;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #6c757d;
  margin-top: 40px;
}

.empty-logo {
  font-size: 48px;
  color: #ced4da;
}

.empty-text {
  font-size: 14px;
}
</style>
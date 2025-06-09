<script setup>

// 导入 Markdown 渲染工具（将 Markdown 文本转换为 HTML）
import { renderMarkdown } from '../utils/markdown.js'
// 定义组件接收的消息 prop
const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  isLastAssistantMessage: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div :class="['message-item', `message-${props.message.role}`]">
    <!-- 消息头像（用户/助手区分） -->
    <div class="message-avatar">
      <span v-if="props.message.role === 'user'">👤</span>
      <span v-else>🤖</span>
    </div>

    <!-- 消息内容容器 -->
    <div class="message-content">
      <!-- 加载状态（流式响应时显示） -->
      <div v-if="props.message.loading" class="message-loading">
        <el-loading text="思考中..."></el-loading>
      </div>

      <!-- 实际内容（加载完成后显示） -->
      <div v-else class="message-body">
        <!-- Markdown 渲染内容 -->
        <div class="message-text" v-html="renderMarkdown(props.message.content)"></div>

        <!-- 推理过程（可选显示） -->
        <div v-if="props.message.reasoning_content" class="message-reasoning">
          <el-collapse>
            <el-collapse-item title="查看推理过程">
              <div v-html="renderMarkdown(props.message.reasoning_content)"></div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <!-- 元数据（Token 消耗、响应速度） -->
        <div class="message-meta">
          <span>消耗 Token: {{ props.message.completion_tokens }}</span>
          <span>响应速度: {{ props.message.speed }} Token/秒</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-item {
  display: flex;
  margin: 12px 0;
  padding: 0 24px;
}

/* 用户消息右对齐 */
.message-user {
  justify-content: flex-end;
}

/* 助手消息左对齐 */
.message-assistant {
  justify-content: flex-start;
}

.message-avatar {
  width: 32px;
  height: 32px;
  margin: 0 12px;
  text-align: center;
  line-height: 32px;
}

.message-content {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
}

/* 用户消息样式 */
.message-user .message-content {
  background: #409eff;
  color: white;
}

/* 助手消息样式 */
.message-assistant .message-content {
  background: #f0f2f5;
  color: #303133;
}

.message-text {
  word-wrap: break-word;
  line-height: 1.6;
}

.message-reasoning {
  margin-top: 8px;
  font-size: 0.9em;
}

.message-meta {
  margin-top: 8px;
  font-size: 0.8em;
  color: #909399;
}

.message-loading {
  min-width: 200px;
  min-height: 40px;
}
</style>
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

    <!-- 消息内容容器 -->
    <div class="message-content">
      <!-- 加载状态（流式响应时显示） -->
      <div v-if="props.message.loading" class="message-loading">
        <el-icon>
          <Loading />
        </el-icon>
        <span>思考中...</span>
      </div>

      <!-- 实际内容（加载完成后显示） -->
      <div v-else class="message-body">
        <!-- 推理过程（可选显示） -->
        <div v-if="props.message.reasoning_content" class="message-reasoning">
          <el-collapse>
            <el-collapse-item title="查看推理过程">
              <div v-html="renderMarkdown(props.message.reasoning_content)"></div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <!-- Markdown 渲染内容 -->
        <div class="message-text" v-html="renderMarkdown(props.message.content)"></div>

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

/* 推理过程样式 */
.message-reasoning {
  margin-top: 8px;
  font-size: 0.9em;
  background-color: #f0f2f5; /* 添加背景色 */
  padding: 12px; /* 可选：添加内边距增强视觉效果 */
  border-radius: 8px; /* 可选：添加圆角 */
}

/* 确保折叠面板背景透明 */
:deep(.message-reasoning .el-collapse) {
  background-color: transparent !important;
}

:deep(.message-reasoning .el-collapse-item__content) {
  background-color: transparent !important;
  color: #5d5d5d !important;
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

/* 修复：使用 :deep() 穿透 scoped 并强制优先级 */
:deep(.message-reasoning) {
  margin-top: 8px;
  font-size: 0.9em;
  background-color: #f0f2f5 !important;
  padding: 12px !important;
  border-radius: 8px !important;
}

/* 强制所有子元素继承样式 */
:deep(.message-reasoning *) {
  background-color: inherit !important;
  color: #5d5d5d !important;
  line-height: 1.6 !important;
}

/* 修复代码块样式冲突 */
:deep(.message-reasoning pre),
:deep(.message-reasoning code) {
  background-color: #e8e8e8 !important; /* 代码块背景色 */
  color: #333 !important; /* 代码文本色 */
  padding: 4px !important;
  border-radius: 4px !important;
}

/* 彻底清除 Element Plus 折叠面板的默认背景 */
:deep(.el-collapse),
:deep(.el-collapse-item),
:deep(.el-collapse-item__header),
:deep(.el-collapse-item__content) {
  background-color: transparent !important;
  border: none !important; /* 移除默认边框 */
}

/* 修复折叠面板标题样式 */
:deep(.el-collapse-item__header) {
  color: #5d5d5d !important;
  padding-left: 0 !important;
}
</style>
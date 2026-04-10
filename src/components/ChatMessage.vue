<script setup>
import { renderMarkdown } from '../utils/markdown.js'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { User, Cpu } from '@element-plus/icons-vue'

const { t } = useI18n();
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

const renderedContent = computed(() => {
  return renderMarkdown(props.message.content)
})
</script>

<template>
  <div :class="['message-item', `message-${props.message.role}`]">
    <div class="message-avatar">
      <div class="avatar-circle">
        <el-icon v-if="props.message.role === 'user'" :size="16"><User /></el-icon>
        <el-icon v-else :size="16"><Cpu /></el-icon>
      </div>
    </div>
    <div class="message-content">
      <div v-if="props.message.loading" class="message-loading">
        <span class="loading-dot"></span>
        <span class="loading-dot"></span>
        <span class="loading-dot"></span>
      </div>
      <div class="message-body">
        <div v-if="props.message.reasoning_content" class="message-reasoning">
          <el-collapse>
            <el-collapse-item :title="t('chatMessage.reasoningTitle')">
              <div v-html="renderMarkdown(props.message.reasoning_content)"></div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="message-text" v-html="renderedContent"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-item {
  display: flex;
  gap: 16px;
  margin: 20px 0;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-user {
  flex-direction: row-reverse;
}

.message-assistant {
  flex-direction: row;
}

.message-avatar {
  flex-shrink: 0;
}

.avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  color: var(--primary-color);
}

.message-user .avatar-circle {
  background: var(--primary-color);
  color: #ffffff;
}

.message-assistant .avatar-circle {
  background: var(--primary-light);
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.message-content {
  max-width: 75%;
  padding: 14px 18px;
  border-radius: var(--radius-lg);
  box-shadow: var(--card-shadow);
}

.message-user .message-content {
  background: linear-gradient(135deg, var(--primary-color) 0%, #66b1ff 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.message-assistant .message-content {
  background: #ffffff;
  color: var(--text-primary);
}

.message-text {
  word-wrap: break-word;
  line-height: 1.7;
  font-size: 14px;
}

:deep(.message-text ol),
:deep(.message-text ul) {
  margin: 8px 0;
  padding-left: 24px;
}

:deep(.message-text ol) {
  list-style-type: decimal;
}

:deep(.message-text ul) {
  list-style-type: disc;
}

:deep(.message-text li) {
  margin: 4px 0;
}

.message-reasoning {
  margin-bottom: 12px;
  padding: 12px 16px;
  background-color: var(--primary-light);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--primary-color);
}

:deep(.message-reasoning .el-collapse) {
  background-color: transparent !important;
  border: none !important;
}

:deep(.message-reasoning .el-collapse-item__content) {
  background-color: transparent !important;
  color: var(--text-secondary) !important;
  padding-bottom: 0;
  font-size: 13px;
  line-height: 1.7;
}

:deep(.message-reasoning .el-collapse-item__header) {
  background-color: transparent !important;
  border: none !important;
  color: var(--primary-color) !important;
  font-size: 13px;
  font-weight: 500;
  padding-left: 0 !important;
  height: 32px;
  line-height: 32px;
}

:deep(.message-reasoning .el-collapse-item) {
  border: none !important;
}

:deep(.message-reasoning .el-collapse-item__wrap) {
  background-color: transparent !important;
  border: none !important;
}

:deep(.message-reasoning .el-collapse-item__arrow) {
  color: var(--primary-color) !important;
}

:deep(.message-reasoning pre),
:deep(.message-reasoning code) {
  background-color: rgba(0, 0, 0, 0.05) !important;
  color: var(--text-primary) !important;
  padding: 2px 6px !important;
  border-radius: 4px !important;
  font-size: 12px;
}

:deep(.message-reasoning pre) {
  padding: 12px !important;
  margin-top: 8px;
  overflow-x: auto;
}

:deep(.message-reasoning pre code) {
  padding: 0 !important;
  background: none !important;
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { renderMarkdown } from '@/utils/markdown'
import { copyToClipboard } from '@/utils/clipboard'
import { formatTime } from '@/utils/format'
import TypingIndicator from './TypingIndicator.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import type { ChatMessage as ChatMessageType } from '@/types'

const { t } = useI18n()

const props = defineProps<{
  message: ChatMessageType
}>()

const emit = defineEmits<{
  retry: []
}>()

const showReasoning = ref(false)
const copyLabel = ref(t('chatMessage.copy'))

const renderedContent = computed(() => renderMarkdown(props.message.content))
const renderedReasoning = computed(() => renderMarkdown(props.message.reasoning_content))
const formattedTime = computed(() => formatTime(props.message.timestamp))

const hasReasoning = computed(() => !!props.message.reasoning_content)
const hasContent = computed(() => !!props.message.content)
const hasError = computed(() => !!props.message.error)

function onCodeCopy(e: Event) {
  const btn = (e.target as HTMLElement).closest('.copy-btn') as HTMLElement | null
  if (!btn) return
  const code = btn.dataset.code
  if (!code) return
  copyToClipboard(code).then((ok) => {
    if (ok) {
      btn.textContent = 'Copied!'
      btn.classList.add('copied')
      setTimeout(() => {
        btn.textContent = 'Copy'
        btn.classList.remove('copied')
      }, 1500)
    }
  })
}

async function handleCopy() {
  const ok = await copyToClipboard(props.message.content)
  copyLabel.value = ok ? t('chatMessage.copied') : t('chatMessage.copyFailed')
  setTimeout(() => {
    copyLabel.value = t('chatMessage.copy')
  }, 1500)
}
</script>

<template>
  <div :class="['message-item', `message-${message.role}`]">
    <!-- Avatar -->
    <div class="message-avatar">
      <div :class="['avatar-circle', `avatar-${message.role}`]">
        <AppIcon :name="message.role === 'user' ? 'user' : 'bot'" :size="16" />
      </div>
    </div>

    <!-- Content -->
    <div class="message-body-wrapper">
      <!-- Time -->
      <div class="message-time">{{ formattedTime }}</div>

      <div :class="['message-bubble', `bubble-${message.role}`]">
        <!-- Loading indicator -->
        <TypingIndicator v-if="message.loading && !hasContent" size="sm" />

        <!-- Reasoning -->
        <div v-if="hasReasoning" class="reasoning-block">
          <button class="reasoning-toggle" @click="showReasoning = !showReasoning">
            <AppIcon :name="showReasoning ? 'chevronDown' : 'chevronRight'" :size="14" />
            <span>{{ t('chatMessage.reasoningTitle') }}</span>
          </button>
          <div v-if="showReasoning" class="reasoning-content" v-html="renderedReasoning" />
        </div>

        <!-- Error -->
        <div v-if="hasError" class="message-error">
          <AppIcon name="error" :size="16" />
          <span>{{ message.error }}</span>
          <button class="retry-btn" @click="emit('retry')">
            {{ t('chatMessage.retry') }}
          </button>
        </div>

        <!-- Markdown Content -->
        <div
          v-if="hasContent"
          class="message-text markdown-body"
          :class="{ 'message-user': message.role === 'user' }"
          v-html="renderedContent"
          @click="onCodeCopy"
        />

        <!-- Streaming cursor -->
        <span v-if="message.loading && hasContent" class="streaming-cursor">|</span>
      </div>

      <!-- Actions -->
      <div v-if="hasContent && !message.loading" class="message-actions">
        <button class="action-btn" @click="handleCopy" :title="t('chatMessage.copy')">
          <AppIcon :name="copyLabel === t('chatMessage.copied') ? 'check' : 'copy'" :size="14" />
        </button>
        <span v-if="message.completion_tokens > 0" class="token-info">
          {{ message.completion_tokens }} tokens
          <template v-if="message.speed"> &middot; {{ message.speed }} t/s</template>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-item {
  display: flex;
  gap: 12px;
  margin: 18px 0;
  animation: fadeIn 0.3s ease;
}

.message-user {
  flex-direction: row-reverse;
}

/* Avatar */
.message-avatar {
  flex-shrink: 0;
  padding-top: 2px;
}

.avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.avatar-user {
  background: linear-gradient(135deg, var(--color-primary) 0%, #8ba4ff 100%);
  color: #fff;
}

.avatar-assistant {
  background: var(--color-primary-alpha);
  color: var(--color-primary);
}

/* Body */
.message-body-wrapper {
  max-width: 78%;
  min-width: 0;
}

.message-time {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin-bottom: 4px;
  padding: 0 4px;
}

.message-user .message-time {
  text-align: right;
}

/* Bubble */
.message-bubble {
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  line-height: var(--line-height);
  font-size: var(--font-size-base);
  position: relative;
}

.bubble-user {
  background: linear-gradient(135deg, var(--color-primary) 0%, #6b85f0 100%);
  color: var(--color-text-inverse);
  border-bottom-right-radius: 4px;
}

.bubble-assistant {
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-light);
  border-bottom-left-radius: 4px;
}

/* Reasoning */
.reasoning-block {
  margin-bottom: 12px;
}

.reasoning-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-primary);
  background: var(--color-primary-alpha);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.reasoning-toggle:hover {
  background: var(--color-primary);
  color: #fff;
}

.reasoning-content {
  margin-top: 10px;
  padding: 12px 14px;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--color-primary);
  line-height: 1.65;
}

/* Error */
.message-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  font-size: var(--font-size-sm);
  color: var(--color-error);
  background: var(--color-error-bg);
  border-radius: var(--radius-sm);
  margin-bottom: 8px;
}

.retry-btn {
  margin-left: auto;
  padding: 4px 12px;
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: #fff;
  background: var(--color-error);
  border-radius: var(--radius-full);
  transition: opacity var(--transition-fast);
}

.retry-btn:hover {
  opacity: 0.85;
}

/* Actions */
.message-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
  padding: 0 4px;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.message-item:hover .message-actions {
  opacity: 1;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  color: var(--color-text-tertiary);
  transition: all var(--transition-fast);
}

.action-btn:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.token-info {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

/* Streaming cursor */
.streaming-cursor {
  animation: pulse 0.8s infinite;
  font-weight: 300;
  color: var(--color-primary);
}
</style>

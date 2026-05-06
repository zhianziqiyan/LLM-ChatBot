<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useChatStore } from '@/stores/chat'
import AppIcon from '@/components/common/AppIcon.vue'

const { t } = useI18n()
const chatStore = useChatStore()

const emit = defineEmits<{
  submit: [content: string]
  stop: []
}>()

const inputValue = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const isSending = ref(false)
const sendCooldown = ref(false)

const isLoading = computed(() => chatStore.isLoading)
const isStreaming = computed(() => chatStore.isStreaming)
const canSend = computed(() => inputValue.value.trim().length > 0 && !sendCooldown.value && !isLoading.value)

function autoResize() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 160) + 'px'
}

function handleSubmit(e?: KeyboardEvent) {
  if (e?.shiftKey) return
  e?.preventDefault()

  const content = inputValue.value.trim()
  if (!content || sendCooldown.value || isLoading.value) return

  isSending.value = true
  sendCooldown.value = true
  emit('submit', content)
  inputValue.value = ''
  nextTick(autoResize)

  setTimeout(() => {
    sendCooldown.value = false
    isSending.value = false
  }, 500)
}

function handleStop() {
  emit('stop')
}

watch(inputValue, autoResize)

const isFocused = ref(false)

function onFocus() {
  isFocused.value = true
}

function onBlur() {
  isFocused.value = false
}

function focus() {
  textareaRef.value?.focus()
}

defineExpose({ focus })
</script>

<template>
  <div class="chat-input-wrapper">
    <div :class="['input-container', { focused: isFocused }]">
      <textarea
        ref="textareaRef"
        v-model="inputValue"
        :placeholder="t('chatInput.placeholder')"
        :disabled="isLoading"
        rows="1"
        class="input-textarea"
        @keydown.enter="handleSubmit"
        @focus="onFocus"
        @blur="onBlur"
      />

      <div class="input-actions">
        <button
          v-if="isStreaming"
          class="stop-btn"
          @click="handleStop"
          :title="t('chatInput.stop')"
        >
          <AppIcon name="stop" :size="16" />
        </button>
        <button
          v-else
          :class="['send-btn', { disabled: !canSend }]"
          :disabled="!canSend"
          @click="handleSubmit()"
          :title="t('chatInput.send')"
        >
          <AppIcon name="send" :size="16" />
        </button>
      </div>
    </div>
    <p class="input-hint">{{ t('chatInput.hint') }}</p>
  </div>
</template>

<style scoped>
.chat-input-wrapper {
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
}

.input-container {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  padding: 12px 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.input-container.focused {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-alpha);
}

.input-textarea {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--font-size-base);
  line-height: 1.5;
  color: var(--color-text-primary);
  resize: none;
  min-height: 24px;
  max-height: 160px;
  overflow-y: auto;
}

.input-textarea::placeholder {
  color: var(--color-text-tertiary);
}

.input-textarea:disabled {
  opacity: 0.6;
}

.input-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.send-btn,
.stop-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: all var(--transition-fast);
}

.send-btn {
  background: var(--color-primary);
  color: #fff;
}

.send-btn:hover:not(.disabled) {
  background: var(--color-primary-hover);
  transform: scale(1.05);
}

.send-btn.disabled {
  background: var(--color-bg-secondary);
  color: var(--color-text-tertiary);
  cursor: not-allowed;
}

.stop-btn {
  background: var(--color-error-bg);
  color: var(--color-error);
}

.stop-btn:hover {
  background: var(--color-error);
  color: #fff;
}

.input-hint {
  text-align: center;
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin-top: 10px;
}
</style>

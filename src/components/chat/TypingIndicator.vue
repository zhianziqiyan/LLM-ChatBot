<script setup lang="ts">
withDefaults(defineProps<{ size?: 'sm' | 'md' }>(), { size: 'md' })
</script>

<template>
  <div :class="['typing-indicator', `typing-${size}`]">
    <span class="typing-dot" />
    <span class="typing-dot" />
    <span class="typing-dot" />
  </div>
</template>

<style scoped>
.typing-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.typing-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-text-tertiary);
  animation: typingDot 1.4s infinite;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

.typing-sm .typing-dot {
  width: 5px;
  height: 5px;
}
</style>

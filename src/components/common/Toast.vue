<script setup lang="ts">
import { ref } from 'vue'
import AppIcon from './AppIcon.vue'
import type { IconName } from '@/utils/icons'

export interface ToastMessage {
  id: number
  text: string
  type: 'success' | 'error' | 'info'
}

const toasts = ref<ToastMessage[]>([])
let nextId = 0

const typeIcon: Record<ToastMessage['type'], IconName> = {
  success: 'check',
  error: 'error',
  info: 'warning',
}

function show(text: string, type: ToastMessage['type'] = 'info', duration = 2500) {
  const id = nextId++
  toasts.value.push({ id, text, type })
  setTimeout(() => remove(id), duration)
}

function remove(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

defineExpose({ show })
</script>

<template>
  <Teleport to="body">
    <div class="toast-container" aria-live="polite">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast-item', `toast-${toast.type}`]"
        >
          <AppIcon :name="typeIcon[toast.type]" :size="16" />
          <span>{{ toast.text }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}

.toast-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
  pointer-events: auto;
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow-lg);
  white-space: nowrap;
}

.toast-success {
  background: var(--color-success);
  color: #fff;
}

.toast-error {
  background: var(--color-error);
  color: #fff;
}

.toast-info {
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.toast-enter-active {
  animation: toastIn var(--transition-base) forwards;
}

.toast-leave-active {
  animation: toastOut var(--transition-fast) forwards;
}
</style>

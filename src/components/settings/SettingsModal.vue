<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSettingStore } from '@/stores/settings'
import { MODEL_OPTIONS } from '@/config/models'
import AppIcon from '@/components/common/AppIcon.vue'

const { t } = useI18n()
const settingStore = useSettingStore()
const settings = settingStore.settings

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

function close() {
  emit('update:modelValue', false)
}

function handleOverlayClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
    close()
  }
}

function handleEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="modal-overlay"
      @click="handleOverlayClick"
      @keydown="handleEsc"
    >
      <div class="modal-panel" @click.stop>
        <!-- Header -->
        <div class="modal-header">
          <h2 class="modal-title">{{ t('setting.title') }}</h2>
          <button class="modal-close" @click="close">
            <AppIcon name="close" :size="18" />
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <!-- Model -->
          <div class="form-group">
            <label class="form-label">{{ t('setting.selectModel') }}</label>
            <select v-model="settings.model" class="form-select">
              <option
                v-for="opt in MODEL_OPTIONS"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>

          <!-- API Key -->
          <div class="form-group">
            <label class="form-label">API Key</label>
            <input
              v-model="settings.apiKey"
              type="password"
              class="form-input"
              :placeholder="t('setting.apiKeyPlaceholder')"
              autocomplete="off"
            />
          </div>

          <!-- Stream -->
          <div class="form-group horizontal">
            <label class="form-label">{{ t('setting.streaming') }}</label>
            <button
              :class="['toggle-switch', { active: settings.stream }]"
              @click="settings.stream = !settings.stream"
              role="switch"
              :aria-checked="settings.stream"
            >
              <span class="toggle-thumb" />
            </button>
          </div>

          <!-- Max Tokens -->
          <div class="form-group">
            <div class="form-label-row">
              <label class="form-label">{{ t('setting.maxTokens') }}</label>
              <span class="form-value">{{ settings.maxTokens }}</span>
            </div>
            <input
              type="range"
              v-model.number="settings.maxTokens"
              :min="512"
              :max="4096"
              :step="128"
              class="form-range"
            />
            <div class="range-labels">
              <span>512</span>
              <span>4096</span>
            </div>
          </div>

          <!-- Temperature -->
          <div class="form-group">
            <div class="form-label-row">
              <label class="form-label">{{ t('setting.temperature') }}</label>
              <span class="form-value">{{ settings.temperature.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              v-model.number="settings.temperature"
              :min="0"
              :max="1"
              :step="0.1"
              class="form-range"
            />
            <div class="range-labels">
              <span>0</span>
              <span>1</span>
            </div>
          </div>

          <!-- Top P -->
          <div class="form-group">
            <div class="form-label-row">
              <label class="form-label">{{ t('setting.topP') }}</label>
              <span class="form-value">{{ settings.topP.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              v-model.number="settings.topP"
              :min="0"
              :max="1"
              :step="0.1"
              class="form-range"
            />
            <div class="range-labels">
              <span>0</span>
              <span>1</span>
            </div>
          </div>

          <!-- Top K -->
          <div class="form-group">
            <div class="form-label-row">
              <label class="form-label">{{ t('setting.topK') }}</label>
              <span class="form-value">{{ settings.topK }}</span>
            </div>
            <input
              type="range"
              v-model.number="settings.topK"
              :min="10"
              :max="100"
              :step="10"
              class="form-range"
            />
            <div class="range-labels">
              <span>10</span>
              <span>100</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="confirm-btn" @click="close">
            {{ t('setting.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  animation: fadeIn 0.15s ease;
  padding: 16px;
}

.modal-panel {
  width: 100%;
  max-width: 440px;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  animation: fadeInScale 0.2s ease;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
}

.modal-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  color: var(--color-text-tertiary);
  transition: all var(--transition-fast);
}

.modal-close:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.modal-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Form */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.horizontal {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}

.form-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-value {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-primary);
  font-variant-numeric: tabular-nums;
}

.form-input,
.form-select {
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  background: var(--color-surface);
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
  outline: none;
  width: 100%;
}

.form-input:focus,
.form-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-alpha);
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239a9aad' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

.form-range {
  width: 100%;
  height: 6px;
  appearance: none;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-full);
  outline: none;
  cursor: pointer;
}

.form-range::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--color-primary);
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.form-range::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

/* Toggle */
.toggle-switch {
  position: relative;
  width: 44px;
  height: 26px;
  background: var(--color-border);
  border-radius: var(--radius-full);
  transition: background var(--transition-fast);
  cursor: pointer;
  flex-shrink: 0;
}

.toggle-switch.active {
  background: var(--color-primary);
}

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast);
}

.toggle-switch.active .toggle-thumb {
  transform: translateX(18px);
}

/* Footer */
.modal-footer {
  padding: 16px 24px 20px;
  border-top: 1px solid var(--color-border-light);
}

.confirm-btn {
  width: 100%;
  padding: 12px;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: #fff;
  background: var(--color-primary);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.confirm-btn:hover {
  background: var(--color-primary-hover);
}
</style>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Promotion } from '@element-plus/icons-vue';

const { t } = useI18n();
const emit = defineEmits(['submit']);
const inputValue = ref('');

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const handleSubmit = (e) => {
  if (e?.shiftKey) return;

  const messageContent = inputValue.value.trim();
  if (!messageContent) return;

  emit('submit', messageContent);
  inputValue.value = '';
};
</script>

<template>
  <div class="chat-input-wrapper">
    <div class="chat-input-container">
      <el-input
        v-model="inputValue"
        type="textarea"
        resize="none"
        :autosize="{ minRows: 1, maxRows: 4 }"
        :placeholder="t('chatInput.placeholder')"
        @keyup.enter="handleSubmit"
        :disabled="loading"
        class="input-area"
      />
      <el-button
        :icon="Promotion"
        type="primary"
        circle
        :disabled="loading || !inputValue.trim()"
        @click="handleSubmit"
        class="submit-btn"
      />
    </div>
    <p class="input-hint">{{ t('chatInput.hint') }}</p>
  </div>
</template>

<style scoped>
.chat-input-wrapper {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
}

.chat-input-container {
  position: relative;
  background: #ffffff;
  border-radius: var(--radius-lg);
  padding: 12px 60px 12px 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-color);
  transition: all var(--transition-fast);
}

.chat-input-container:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.15);
}

.input-area {
  width: 100%;
  overflow: hidden;
}

:deep(.el-textarea__inner) {
  border: none;
  box-shadow: none;
  padding: 4px 0;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

:deep(.el-textarea__inner::-webkit-scrollbar) {
  display: none;
}

:deep(.el-textarea__inner:focus) {
  border: none;
  box-shadow: none;
}

:deep(.el-textarea__inner::placeholder) {
  color: var(--text-placeholder);
}

.submit-btn {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--primary-color) 0%, #66b1ff 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
  transition: all var(--transition-fast);
}

.submit-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.submit-btn:disabled {
  background: var(--bg-color);
  box-shadow: none;
}

.input-hint {
  text-align: center;
  font-size: 12px;
  color: var(--text-placeholder);
  margin-top: 12px;
}
</style>

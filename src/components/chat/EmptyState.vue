<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/common/AppIcon.vue'

const { t } = useI18n()
</script>

<template>
  <div class="empty-state">
    <div class="empty-icon">
      <AppIcon name="bot" :size="36" />
    </div>
    <h2 class="empty-title">{{ t('chatView.emptyTitle') }}</h2>
    <p class="empty-description">{{ t('chatView.emptyDescription') }}</p>
  </div>
</template>

<style scoped>
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: var(--space-2xl);
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--color-primary-alpha);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.empty-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-text-primary);
}

.empty-description {
  font-size: var(--font-size-base);
  color: var(--color-text-tertiary);
}
</style>

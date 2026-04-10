<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSettingStore } from '../stores/setting.js';
import { modelOptions } from '../stores/setting.js';

const { t } = useI18n();
const props = defineProps({
  modelValue: { type: Boolean, default: false }
});
const emit = defineEmits(['update:modelValue']);

const settingStore = useSettingStore();
const settings = settingStore.settings;

const handleClose = () => {
  emit('update:modelValue', false);
};
</script>

<template>
  <el-dialog
    v-bind:model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :title="t('setting.title')"
    width="480px"
    class="setting-dialog"
    @close="handleClose"
  >
    <el-form label-width="120px" class="setting-form">
      <el-form-item :label="t('setting.selectModel')">
        <el-select v-model="settings.model" :placeholder="t('setting.selectModelPlaceholder')" class="full-width">
          <el-option
            v-for="option in modelOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="API Key">
        <el-input
          v-model="settings.apiKey"
          :placeholder="t('setting.apiKeyPlaceholder')"
          show-password
          class="full-width"
        />
      </el-form-item>

      <el-form-item :label="t('setting.streaming')">
        <el-switch v-model="settings.stream" />
      </el-form-item>

      <el-form-item :label="t('setting.maxTokens')">
        <div class="slider-container">
          <el-slider
            v-model="settings.maxTokens"
            :min="512"
            :max="4096"
            :step="128"
            show-tooltip
            :format-tooltip="(val) => val + ' tokens'"
            class="slider-width"
          />
        </div>
      </el-form-item>

      <el-form-item :label="t('setting.temperature')">
        <div class="slider-container">
          <el-slider
            v-model="settings.temperature"
            :min="0"
            :max="1"
            :step="0.1"
            show-tooltip
            :format-tooltip="(val) => val.toFixed(1)"
            class="slider-width"
          />
        </div>
      </el-form-item>

      <el-form-item :label="t('setting.topP')">
        <div class="slider-container">
          <el-slider
            v-model="settings.topP"
            :min="0"
            :max="1"
            :step="0.1"
            show-tooltip
            :format-tooltip="(val) => val.toFixed(1)"
            class="slider-width"
          />
        </div>
      </el-form-item>

      <el-form-item :label="t('setting.topK')">
        <div class="slider-container">
          <el-slider
            v-model="settings.topK"
            :min="10"
            :max="100"
            :step="10"
            show-tooltip
            :format-tooltip="(val) => val + ' ' + t('setting.topKTooltip')"
            class="slider-width"
          />
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="primary" @click="handleClose" class="confirm-btn">
        {{ t('setting.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.setting-form {
  padding: 8px 0;
}

.setting-form .el-form-item {
  margin-bottom: 24px;
}

.full-width {
  width: 100%;
}

.slider-container {
  width: 100%;
  padding-right: 60px;
}

.slider-width {
  width: 100%;
}

:deep(.el-slider__tooltip) {
  min-width: 80px;
  text-align: center;
}

.confirm-btn {
  padding: 10px 32px;
  background: linear-gradient(135deg, var(--primary-color) 0%, #66b1ff 100%);
  border: none;
  border-radius: var(--radius-md);
}

.confirm-btn:hover {
  background: linear-gradient(135deg, #66b1ff 0%, #409eff 100%);
}
</style>

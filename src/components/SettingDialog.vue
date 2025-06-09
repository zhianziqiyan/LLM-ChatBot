<script setup>
import { ref, computed } from 'vue';
import { useSettingStore } from '../stores/setting.js';
import { modelOptions } from '../stores/setting.js';

const props = defineProps({
  modelValue: { type: Boolean, default: false } // 接收父组件传递的显示状态
});
const emit = defineEmits(['update:modelValue']); // 定义更新事件

// 获取 setting Store
const settingStore = useSettingStore();
const settings = settingStore.settings;

// 关闭对话框时通知父组件更新状态
const handleClose = () => {
  emit('update:modelValue', false); // 触发更新事件
};
</script>

<template>
  <el-dialog  
    v-bind:model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)" 
    title="聊天配置"
    width="500px"
    @close="handleClose"
  >
    <el-form  
      label-width="120px"
    >
      <!-- 模型选择 -->
      <el-form-item  
        label="选择模型"
      >
        <el-select 
          v-model="settings.model"
          placeholder="请选择模型"
        >
          <el-option 
            v-for="option in modelOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>

      <!-- 新增：API Key 输入框 -->
      <el-form-item 
        label="API Key"
      >
        <el-input 
          v-model="settings.apiKey"
          placeholder="请输入 API Key"
          show-password 
        />
      </el-form-item>

      <!-- 流式响应开关 -->
      <el-form-item  
        label="流式响应"
      >
        <el-switch 
          v-model="settings.stream"
        />
      </el-form-item>

      <!-- maxTokens 滑块 -->
      <el-form-item 
        label="最大 Token 数"
      >
        <el-slider 
          v-model="settings.maxTokens"
          :min="512"
          :max="4096"
          :step="128"
          show-tooltip
          format-tooltip="{value} tokens"
          show-input 
        />
      </el-form-item>

      <!-- Temperature 滑块 -->
      <el-form-item 
        label="温度参数"
      >
        <el-slider 
          v-model="settings.temperature"
          :min="0"
          :max="1"
          :step="0.1"
          show-tooltip
          format-tooltip="{value.toFixed(1)}"
          show-input 
        />
      </el-form-item>

      <!-- Top-P 滑块 -->
      <el-form-item 
        label="核采样参数"
      >
        <el-slider  
          v-model="settings.topP"
          :min="0"
          :max="1"
          :step="0.1"
          show-tooltip
          format-tooltip="{value.toFixed(1)}"
          show-input  
        />
      </el-form-item>

      <!-- Top-K 滑块 -->
      <el-form-item 
        label="前 K 采样参数"
      >
        <el-slider  
          v-model="settings.topK"
          :min="10"
          :max="100"
          :step="10"
          show-tooltip
          format-tooltip="{value} 个候选词"
          show-input  
        />
      </el-form-item>
    </el-form>

    <!-- 新增：对话框底部确定按钮 -->
    <template #footer>
      <el-button 
        type="primary" 
        @click="handleClose"
      >
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
/* 调整滑块容器的上下间距 */
.el-form-item {
  margin-bottom: 20px;
}

/* 滑块数值提示样式优化 */
.el-slider__tooltip {
  min-width: 60px;
  text-align: center;
}
</style>
<script setup>
import { ref } from 'vue';
import { Promotion } from '@element-plus/icons-vue';

const emit = defineEmits(['submit']); // 定义提交事件
const inputValue = ref('');

// 定义组件的 props，接收 loading 状态
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

// 处理提交逻辑（仅触发事件）
const handleSubmit = (e) => {
  if (e?.shiftKey) return;
  
  const messageContent = inputValue.value.trim();
  if (!messageContent) return;

  emit('submit', messageContent); // 触发提交事件并传递内容
  inputValue.value = ''; // 清空输入框
};
</script>

<template>
  <div class="chat-input-container">
    <el-input
      v-model="inputValue"
      type="textarea"
      resize="none"
      :autosize="{ minRows: 1, maxRows: 3 }"
      placeholder="输入消息，Enter 发送，Shift + Enter 换行"
      @keyup.enter="handleSubmit"
      class="input-area"
    />
    <el-button 
      :icon="Promotion" 
      type="primary"
      circle 
      @click="handleSubmit"
      class="submit-btn"
    />
  </div>
</template>

<style scoped>
.chat-input-container {
  width: 640px;
  height: 104px;
  position: relative;
  border: 1px solid #e5e7eb;
  border-radius: 28px;
  padding: 16px;
  background: #ffffff;
  margin: 0 auto;
  margin-bottom: 32px;
}

.input-area {
  width: 100%;
  height: 100%;
}

/* 覆盖正常状态和聚焦状态的边框 */
.input-area ::v-deep .el-textarea__inner {
    border-radius: 8px;
    resize: none;
    border: none;
    box-shadow: none;

    &:focus {
      border: none;
      box-shadow: none;
    }
}

.submit-btn {
  position: absolute;
  right: 16px;
  bottom: 16px;
  height: 30px;
  width: 30px;
  flex-shrink: 0;
}
</style>
<script setup>
import { ref, nextTick } from 'vue';
import SettingDialog from './SettingDialog.vue';
import { useChatStore } from '../stores/chat';
import { Expand, Fold, Edit, Setting, ChatLineSquare, Close, EditPen } from '@element-plus/icons-vue';

const isCollapse = ref(false);
const isSettingDialogVisible = ref(false);
const chatStore = useChatStore();
// 新增：编辑状态管理
const editingId = ref(null);
const editTitle = ref('');

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

const deleteChat = (id) => {
  chatStore.deleteConversation(id);
};

// 新增：开始编辑标题
const startEditing = (conversation) => {
  editingId.value = conversation.id;
  editTitle.value = conversation.title;
  // 等待DOM更新后聚焦输入框
  nextTick(() => {
    const input = document.querySelector(`.title-input-${conversation.id}`);
    if (input) input.focus();
  });
};

// 新增：保存标题修改
const saveTitle = (id) => {
  if (editTitle.value.trim()) {
    chatStore.updateConversationTitle(id, editTitle.value.trim());
  }
  editingId.value = null;
};

// 新增：点击外部区域保存
const handleClickOutside = (e) => {
  if (editingId.value && !e.target.closest('.title-content')) {
    saveTitle(editingId.value);
  }
};

// 新增：打开设置对话框的方法
const openSettingDialog = () => {
  isSettingDialogVisible.value = true;
};


document.addEventListener('click', handleClickOutside);
</script>

<template>
  <el-menu class="el-menu" :collapse="isCollapse">
    <!-- 侧边栏顶部控制图标 -->
    <div class="menu-header">
      <el-icon @click="toggleCollapse" class="control-icon">
        <Expand v-if="isCollapse" />
        <Fold v-else />
      </el-icon>
    </div>
    <!-- 新聊天菜单项 -->
    <el-menu-item index="1" class="new-chat-item" @click="chatStore.createConversation">
      <el-icon>
        <Edit />
      </el-icon>
      <template #title>新聊天</template>
    </el-menu-item>
    <!-- 设置菜单项（关键修改） -->
    <el-menu-item index="2" class="setting-item" @click="openSettingDialog">
      <el-icon>
        <Setting />
      </el-icon>
      <template #title>设置</template>
    </el-menu-item>
    <!-- 不可点击的"聊天"文字 -->
    <div class="section-title">聊天</div>
    <!-- 动态渲染聊天记录（关键修改） -->
    <el-menu-item v-for="(conversation, index) in chatStore.conversations" :key="conversation.id"
      :index="`chat-${conversation.id}`" class="chat-item" @click="chatStore.switchConversation(conversation.id)">
      <el-icon>
        <ChatLineSquare />
      </el-icon>
      <template #title>
        <div class="title-content">
          <!-- 修改：条件渲染标题或输入框 -->
          <template v-if="editingId === conversation.id">
            <el-input
              v-model="editTitle"
              size="small"
              class="title-input title-input-{{ conversation.id }}"
              @blur="saveTitle(conversation.id)"
              @keyup.enter="saveTitle(conversation.id)"
            />
          </template>
          <span v-else>{{ conversation.title }}</span>

          <div class="action-icons">
            <el-icon @click.stop="startEditing(conversation)" class="edit-icon">
              <EditPen />
            </el-icon>
            <el-icon @click.stop="deleteChat(conversation.id)" class="delete-icon">
              <Close />
            </el-icon>
          </div>
        </div>
      </template>
    </el-menu-item>

    <!-- 新增：设置对话框 -->
    <SettingDialog v-model="isSettingDialogVisible" />
  </el-menu>
</template>

<style scoped>
.el-menu:not(.el-menu--collapse) {
  width: 250px;
  background-color: #f9f9f9;
  height: 100vh;
}

.el-menu.el-menu--collapse {
  width: 62px;
  background-color: #f9f9f9;
  overflow: hidden;
  height: 100vh;
}

.section-title {
  padding: 8px 16px;
  font-size: 14px;
  color: #8f8f8f;
  cursor: default;
}

.menu-header {
  padding: 15.25px 0;
  text-align: left;
  padding-left: 20px;
}

.control-icon {
  cursor: pointer;
  font-size: 20px;
  transition: color 0.2s;
}

.control-icon:hover {
  color: #409eff;
}

.new-chat-item .el-menu-item__title,
.setting-item .el-menu-item__title,
.chat-item .el-menu-item__title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}

/* 新增：删除图标的样式 */
.delete-icon {
  margin-left: auto;
  /* 右对齐 */
  color: #c0c4cc;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.2s;
}

.delete-icon:hover {
  color: #f56c6c;
  /* 红色悬停反馈 */
}

.title-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.action-icons {
  display: flex;
  gap: 8px; /* 控制图标之间的间距 */
}

/* 新增：输入框样式 */
.title-input {
  width: 120px;
  margin-right: 8px;
}

/* 调整图标样式 */
.edit-icon,
.delete-icon {
  cursor: pointer;
  font-size: 16px;
  color: #c0c4cc;
  transition: color 0.2s;
}

.edit-icon:hover {
  color: #409eff;
}

.delete-icon:hover {
  color: #f56c6c;
}
</style>
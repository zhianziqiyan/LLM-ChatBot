<script setup>
import { ref, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import SettingDialog from './SettingDialog.vue';
import { useChatStore } from '../stores/chat';
import { useLanguageStore } from '../stores/language';
import { Expand, Fold, Edit, Setting, ChatLineSquare, Close, EditPen, Switch } from '@element-plus/icons-vue';

const { t } = useI18n();
const isCollapse = ref(false);
const isSettingDialogVisible = ref(false);
const chatStore = useChatStore();
const languageStore = useLanguageStore();
const editingId = ref(null);
const editTitle = ref('');

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

const deleteChat = (id) => {
  chatStore.deleteConversation(id);
};

const startEditing = (conversation) => {
  editingId.value = conversation.id;
  editTitle.value = conversation.title;
  nextTick(() => {
    const input = document.querySelector(`.title-input-${conversation.id}`);
    if (input) input.focus();
  });
};

const saveTitle = (id) => {
  if (editTitle.value.trim()) {
    chatStore.updateConversationTitle(id, editTitle.value.trim());
  }
  editingId.value = null;
};

const handleClickOutside = (e) => {
  if (editingId.value && !e.target.closest('.title-content')) {
    saveTitle(editingId.value);
  }
};

const openSettingDialog = () => {
  isSettingDialogVisible.value = true;
};

const toggleLanguage = () => {
  languageStore.locale = languageStore.locale === 'zh' ? 'en' : 'zh';
};


document.addEventListener('click', handleClickOutside);
</script>

<template>
  <div class="sidebar" :class="{ 'is-collapse': isCollapse }">
    <div class="sidebar-header">
      <el-icon @click="toggleCollapse" class="toggle-btn">
        <Expand v-if="isCollapse" />
        <Fold v-else />
      </el-icon>
    </div>

    <div class="sidebar-content">
      <div class="sidebar-actions">
        <el-button class="action-btn new-chat-btn" @click="chatStore.createConversation">
          <el-icon><Edit /></el-icon>
          <span v-if="!isCollapse">{{ t('sidebar.newChat') }}</span>
        </el-button>
        <el-button class="action-btn setting-btn" @click="openSettingDialog">
          <el-icon><Setting /></el-icon>
          <span v-if="!isCollapse">{{ t('sidebar.settings') }}</span>
        </el-button>
        <el-button class="action-btn language-btn" @click="toggleLanguage">
          <el-icon><Switch /></el-icon>
          <span v-if="!isCollapse">{{ t('common.switchLang') }}</span>
        </el-button>
      </div>

      <div class="section-label" v-if="!isCollapse">{{ t('sidebar.chatHistory') }}</div>

      <div class="chat-list">
        <div
          v-for="conversation in chatStore.conversations"
          :key="conversation.id"
          class="chat-item"
          :class="{ 'is-active': chatStore.currentConversation?.id === conversation.id }"
          @click="chatStore.switchConversation(conversation.id)"
        >
          <el-icon class="chat-icon"><ChatLineSquare /></el-icon>
          <div class="chat-info title-content" v-if="!isCollapse">
            <template v-if="editingId === conversation.id">
              <el-input
                v-model="editTitle"
                size="small"
                class="title-input"
                @blur="saveTitle(conversation.id)"
                @keyup.enter="saveTitle(conversation.id)"
              />
            </template>
            <span v-else class="chat-title">{{ conversation.title }}</span>
            <div class="chat-actions">
              <el-icon @click.stop="startEditing(conversation)" class="action-icon">
                <EditPen />
              </el-icon>
              <el-icon @click.stop="deleteChat(conversation.id)" class="action-icon delete">
                <Close />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <SettingDialog v-model="isSettingDialogVisible" />
  </div>
</template>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: width var(--transition-normal);
}

.sidebar.is-collapse {
  width: 72px;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.toggle-btn {
  font-size: 27px;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-btn:hover {
  background: var(--bg-color);
  color: var(--primary-color);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
}

.sidebar-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  margin: 0;
  border-radius: var(--radius-md);
  border: 1px dashed var(--border-color);
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  width: 100%;
  justify-content: flex-start;
}

.action-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: var(--primary-light);
}

.new-chat-btn {
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-placeholder);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 12px;
  margin-bottom: 12px;
}

.chat-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.chat-item:hover {
  background: var(--bg-color);
}

.chat-item.is-active {
  background: var(--primary-light);
}

.chat-item.is-active .chat-icon {
  color: var(--primary-color);
}

.chat-icon {
  font-size: 18px;
  color: var(--text-placeholder);
  flex-shrink: 0;
}

.chat-info {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
}

.chat-title {
  font-size: 14px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.chat-item:hover .chat-actions {
  opacity: 1;
}

.action-icon {
  font-size: 18px;
  color: var(--text-placeholder);
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  min-height: 28px;
}

.action-icon:hover {
  background: var(--border-color);
}

.action-icon.delete:hover {
  color: #f56c6c;
  background: #fef0f0;
}

.title-input {
  flex: 1;
  min-width: 0;
}
</style>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useChatStore } from '@/stores/chat'
import { useLanguageStore } from '@/stores/language'
import { useThemeStore } from '@/stores/theme'
import AppIcon from '@/components/common/AppIcon.vue'
import type { IconName } from '@/utils/icons'
import type { Conversation } from '@/types'

const { t } = useI18n()
const chatStore = useChatStore()
const langStore = useLanguageStore()
const themeStore = useThemeStore()

const emit = defineEmits<{
  openSettings: []
  conversationSelected: []
}>()

function handleSelectConversation(id: string) {
  chatStore.switchConversation(id)
  emit('conversationSelected')
}

const isCollapsed = ref(false)
const editingId = ref<string | null>(null)
const editTitle = ref('')

function startEditing(conv: Conversation) {
  editingId.value = conv.id
  editTitle.value = conv.title
  nextTick(() => {
    const input = document.querySelector<HTMLInputElement>(`.title-input-${conv.id}`)
    input?.focus()
    input?.select()
  })
}

function saveTitle(id: string) {
  if (editTitle.value.trim()) {
    chatStore.updateConversationTitle(id, editTitle.value.trim())
  }
  editingId.value = null
}

function cycleTheme() {
  themeStore.toggle()
}

const themeIcon = (): IconName => {
  return 'theme'
}
</script>

<template>
  <aside :class="['sidebar', { collapsed: isCollapsed }]">
    <!-- Header -->
    <div class="sidebar-header">
      <button class="collapse-btn" @click="isCollapsed = !isCollapsed" :title="t('sidebar.toggle')">
        <AppIcon name="menu" :size="20" />
      </button>
    </div>

    <!-- Actions -->
    <div class="sidebar-actions">
      <button class="sidebar-btn primary-btn" @click="chatStore.createConversation()">
        <AppIcon name="plus" :size="18" />
        <span v-show="!isCollapsed" class="btn-label">{{ t('sidebar.newChat') }}</span>
      </button>

      <button class="sidebar-btn" @click="emit('openSettings')">
        <AppIcon name="settings" :size="18" />
        <span v-show="!isCollapsed" class="btn-label">{{ t('sidebar.settings') }}</span>
      </button>

      <button class="sidebar-btn" @click="cycleTheme">
        <AppIcon :name="themeIcon()" :size="18" />
        <span v-show="!isCollapsed" class="btn-label">{{ t('sidebar.theme') }}</span>
      </button>

      <button class="sidebar-btn" @click="langStore.toggle()">
        <AppIcon name="language" :size="18" />
        <span v-show="!isCollapsed" class="btn-label">{{ t('common.switchLang') }}</span>
      </button>
    </div>

    <!-- Separator -->
    <div v-show="!isCollapsed" class="sidebar-separator">
      <span class="separator-label">{{ t('sidebar.chatHistory') }}</span>
    </div>

    <!-- Conversation List -->
    <div class="chat-list">
      <div
        v-for="conv in chatStore.sortedConversations"
        :key="conv.id"
        :class="['chat-item', { active: chatStore.currentConversationId === conv.id }]"
        @click="handleSelectConversation(conv.id)"
      >
        <AppIcon name="bot" :size="16" class="chat-item-icon" />
        <div v-show="!isCollapsed" class="chat-item-content">
          <template v-if="editingId === conv.id">
            <input
              v-model="editTitle"
              :class="`title-input-${conv.id}`"
              class="title-input"
              @blur="saveTitle(conv.id)"
              @keydown.enter="saveTitle(conv.id)"
              @click.stop
            />
          </template>
          <span v-else class="chat-title">{{ conv.title }}</span>
          <div class="chat-item-actions">
            <button
              class="item-action-btn"
              @click.stop="startEditing(conv)"
              :title="t('sidebar.rename')"
            >
              <AppIcon name="edit" :size="14" />
            </button>
            <button
              class="item-action-btn danger"
              @click.stop="chatStore.deleteConversation(conv.id)"
              :title="t('sidebar.delete')"
            >
              <AppIcon name="delete" :size="14" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100dvh;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  transition: width var(--transition-base);
  flex-shrink: 0;
  z-index: var(--z-sidebar);
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 12px;
  min-height: var(--header-height);
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.collapse-btn:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

/* Actions */
.sidebar-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 12px 12px;
}

.sidebar-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
  width: 100%;
}

.sidebar-btn:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.primary-btn {
  color: var(--color-primary);
  background: var(--color-primary-alpha);
}

.primary-btn:hover {
  background: var(--color-primary);
  color: #fff;
}

/* Separator */
.sidebar-separator {
  padding: 8px 16px;
}

.separator-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Chat list */
.chat-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: 40px;
}

.chat-item:hover {
  background: var(--color-bg-secondary);
}

.chat-item.active {
  background: var(--color-primary-alpha);
}

.chat-item-icon {
  flex-shrink: 0;
  color: var(--color-text-tertiary);
}

.chat-item.active .chat-item-icon {
  color: var(--color-primary);
}

.chat-item-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.chat-title {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-item-actions {
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.chat-item:hover .chat-item-actions {
  opacity: 1;
}

.item-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  color: var(--color-text-tertiary);
  transition: all var(--transition-fast);
}

.item-action-btn:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.item-action-btn.danger:hover {
  background: var(--color-error-bg);
  color: var(--color-error);
}

.title-input {
  flex: 1;
  min-width: 0;
  padding: 4px 8px;
  font-size: var(--font-size-sm);
  border: 1px solid var(--color-primary);
  border-radius: 6px;
  outline: none;
  background: var(--color-surface);
  color: var(--color-text-primary);
}

/* Mobile overlay */
@media (max-width: 767px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: var(--z-sidebar);
    box-shadow: var(--shadow-xl);
    transform: translateX(0);
  }

  .sidebar.collapsed {
    transform: translateX(-100%);
    width: var(--sidebar-width);
  }
}
</style>

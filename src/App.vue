<script setup lang="ts">
import { ref, provide, onMounted, onUnmounted } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import SettingsModal from '@/components/settings/SettingsModal.vue'
import Toast from '@/components/common/Toast.vue'

const showSettings = ref(false)
const sidebarOpen = ref(window.innerWidth >= 768)
const isMobile = ref(window.innerWidth < 768)
const toastRef = ref<InstanceType<typeof Toast> | null>(null)

function handleResize() {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) sidebarOpen.value = true
}

onMounted(() => window.addEventListener('resize', handleResize))
onUnmounted(() => window.removeEventListener('resize', handleResize))

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function closeSidebar() {
  if (isMobile.value) {
    sidebarOpen.value = false
  }
}

provide('toggleSidebar', toggleSidebar)
provide('toast', {
  show: (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    toastRef.value?.show(text, type)
  },
})
</script>

<template>
  <div class="app-shell">
    <Transition name="sidebar-slide">
      <AppSidebar
        v-if="sidebarOpen"
        class="app-sidebar"
        @open-settings="showSettings = true"
        @conversation-selected="closeSidebar"
      />
    </Transition>

    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen && isMobile"
      class="sidebar-overlay"
      @click="closeSidebar"
    />

    <main class="app-main">
      <router-view />
    </main>

    <SettingsModal v-model="showSettings" />
    <Toast ref="toastRef" />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  position: relative;
}

.app-sidebar {
  flex-shrink: 0;
}

.app-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}

.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  z-index: calc(var(--z-sidebar) - 1);
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
}

@media (max-width: 767px) {
  .app-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: var(--z-sidebar);
    box-shadow: var(--shadow-xl);
  }

  .sidebar-overlay {
    display: block;
  }
}

/* Slide transition */
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: transform var(--transition-base);
}

.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  transform: translateX(-100%);
}
</style>

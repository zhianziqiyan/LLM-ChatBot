<script setup>
import SideMenu from './components/SideMenu.vue';
</script>

<template>
  <div class="app-container">
    <!-- 侧边菜单组件 -->
    <div class="sidebar">
      <SideMenu />
    </div>
    <!-- 主界面内容 -->
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
}

/* .sidebar {
  background-color: #f0f0f0;
} */

.main-content {
  flex: 1;
  background-color: #ffffff;
}
</style>

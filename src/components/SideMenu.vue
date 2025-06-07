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
    <el-menu-item index="1" class="new-chat-item">
      <el-icon>
        <Edit />
      </el-icon>
      <template #title>新聊天</template>
    </el-menu-item>
    <!-- 设置菜单项 -->
    <el-menu-item index="2" class="setting-item">
      <el-icon>
        <Setting />
      </el-icon>
      <template #title>设置</template>
    </el-menu-item>
    <!-- 不可点击的"聊天"文字 -->
    <div class="section-title">聊天</div>
    <!-- 动态渲染聊天记录（关键修改） -->
    <el-menu-item v-for="(chat, index) in chatList" :key="chat.id" :index="`chat-${index + 3}`" class="chat-item">
      <el-icon>
        <ChatLineSquare />
      </el-icon>
      <template #title>
        <span>{{ chat.name }}</span>
        <!-- 折叠时隐藏删除图标，展开时显示 -->
        <el-icon v-if="!isCollapse" @click.stop="deleteChat(chat.id)" class="delete-icon">
          <Close />
        </el-icon>
      </template>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue';

const isCollapse = ref(false);
// 新增：动态聊天记录数组（模拟 ChatGPT 聊天列表）
const chatList = ref([
  { id: 1, name: "与 AI 讨论 Vue 开发" },
  { id: 2, name: "学习 Element Plus 组件" },
  { id: 3, name: "项目需求分析" }
]);

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

// 新增：删除聊天记录方法
const deleteChat = (id) => {
  chatList.value = chatList.value.filter(chat => chat.id !== id);
};
</script>

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
  padding: 16px 0;
  border-bottom: 1px solid #e4e7ed;
  text-align: left;
  padding-left: 16px;
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
</style>
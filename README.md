# LLM-ChatBot

一个基于 Vue 3 的现代化 LLM 聊天机器人应用，支持多对话管理、Markdown 渲染、流式响应和推理过程展示。

## 功能特点

- **多对话管理**：支持创建、切换和删除对话，方便用户组织不同主题的聊天
- **Markdown 支持**：消息内容支持 Markdown 格式，包括代码高亮
- **流式响应**：支持 LLM 的流式输出，提供更流畅的聊天体验
- **推理过程展示**：可展开查看模型的推理过程，了解 AI 思考逻辑
- **数据持久化**：使用 localStorage 存储聊天记录，刷新页面后数据不丢失
- **响应式设计**：适配不同屏幕尺寸，提供良好的用户体验

## 技术栈

- **前端框架**：Vue 3
- **状态管理**：Pinia
- **UI 组件库**：Element Plus
- **路由**：Vue Router
- **构建工具**：Vite
- **网络请求**：Axios
- **Markdown 渲染**：markdown-it
- **代码高亮**：highlight.js

## 快速开始

### 环境要求

- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. 克隆项目到本地

```bash
git clone https://github.com/zhianziqiyan/LLM-ChatBot.git
cd LLM-ChatBot
```

2. 安装依赖

```bash
npm install
# 或
yarn install
```

3. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

4. 构建生产版本

```bash
npm run build
# 或
yarn build
```

5. 预览生产构建

```bash
npm run preview
# 或
yarn preview
```

## 项目结构

```
LLM-ChatBot/
├── public/             # 静态资源
├── src/
│   ├── assets/        # 静态资源
│   ├── components/    # 组件
│   │   ├── ChatInput.vue        # 聊天输入框组件
│   │   ├── ChatMessage.vue      # 消息显示组件
│   │   ├── DialogEdit.vue       # 对话编辑弹窗
│   │   ├── PopupMenu.vue        # 侧边菜单组件
│   │   ├── SearchDialog.vue     # 搜索对话框组件
│   │   └── SettingsPanel.vue    # 设置面板组件
│   ├── stores/        # Pinia 状态管理
│   │   ├── chat.js              # 聊天相关状态
│   │   └── setting.js           # 设置相关状态
│   ├── utils/         # 工具函数
│   │   ├── request.js           # 网络请求封装
│   │   ├── api.js               # 具体接口定义
│   │   ├── markdown.js          # Markdown 处理
│   │   └── messageHandler.js    # 消息处理
│   ├── views/         # 页面
│   │   └── ChatView.vue         # 主聊天页面
│   ├── App.vue        # 根组件
│   ├── main.js        # 应用入口
│   └── style.css      # 全局样式
├── .gitignore         # Git 忽略文件
├── index.html         # HTML 模板
├── package.json       # 项目配置
├── package-lock.json  # 依赖锁定
└── vite.config.js     # Vite 配置
```

## 使用方法

### 基本操作

1. **发送消息**：在输入框中输入消息，按 Enter 键或点击发送按钮
2. **换行**：按 Shift + Enter 键在输入框中换行
3. **创建新对话**：点击侧边菜单的「新对话」按钮
4. **切换对话**：点击侧边菜单中的对话列表项
5. **删除对话**：点击对话列表项右侧的删除按钮
6. **编辑对话**：点击对话列表项右侧的编辑按钮，可修改对话标题
7. **搜索对话**：点击侧边菜单的搜索按钮，可搜索历史对话
8. **查看设置**：点击侧边菜单的设置按钮，可配置模型参数

### 高级功能

1. **查看推理过程**：助手回复后，点击「查看推理过程」可展开查看模型的思考逻辑
2. **Markdown 支持**：在消息中使用 Markdown 语法，系统会自动渲染
3. **代码高亮**：在消息中使用代码块，系统会自动进行语法高亮

## 配置说明

应用的设置项包括：

- **API 地址**：LLM 模型的 API 端点
- **模型**：选择使用的 LLM 模型
- **温度**：控制模型输出的随机性
- **最大 Token**：限制模型回复的长度
- **流式响应**：开启/关闭流式输出

## 注意事项

- 本项目默认使用 localStorage 存储聊天记录，数据仅保存在本地浏览器中
- 请确保配置了正确的 API 地址，否则无法获取模型回复
- 流式响应功能需要 API 支持 Server-Sent Events (SSE)

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 许可证

MIT License

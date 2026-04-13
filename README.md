# LLM-ChatBot

中文版本｜[English Version](README.en.md)

一个基于 Vue 3 的现代化 LLM 聊天机器人应用，支持多对话管理、Markdown 渲染、流式响应、推理过程展示和多语言切换。

## 功能特点

- **多对话管理**：支持创建、切换和删除对话，方便用户组织不同主题的聊天
- **Markdown 支持**：消息内容支持 Markdown 格式，包括代码高亮、表情符号
- **流式响应**：支持 LLM 的流式输出，提供更流畅的聊天体验
- **推理过程展示**：可展开查看模型的推理过程，了解 AI 思考逻辑
- **数据持久化**：使用 localStorage 存储聊天记录和设置，刷新页面后数据不丢失
- **多语言支持**：支持中文和英文界面切换
- **侧边栏折叠**：可折叠的侧边栏设计，适配不同屏幕尺寸
- **响应式设计**：适配不同屏幕尺寸，提供良好的用户体验

## 技术栈

- **前端框架**：Vue 3
- **状态管理**：Pinia + pinia-plugin-persistedstate（持久化存储）
- **UI 组件库**：Element Plus
- **路由**：Vue Router
- **构建工具**：Vite
- **网络请求**：原生 Fetch API
- **Markdown 渲染**：markdown-it + highlight.js
- **国际化**：vue-i18n

## 快速开始

### 环境要求

- Node.js 16.0 或更高版本
- npm、yarn 或 pnpm 包管理器

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
# 或
pnpm install
```

3. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

4. 构建生产版本

```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

5. 预览生产构建

```bash
npm run preview
# 或
yarn preview
# 或
pnpm preview
```

## 项目结构

```
LLM-ChatBot/
├── public/                  # 静态资源
├── src/
│   ├── assets/             # 静态资源
│   ├── components/          # 组件
│   │   ├── ChatInput.vue       # 聊天输入框组件
│   │   ├── ChatMessage.vue     # 消息显示组件
│   │   ├── SettingDialog.vue   # 设置弹窗组件
│   │   └── SideMenu.vue        # 侧边菜单组件
│   ├── locale/             # 国际化语言文件
│   │   ├── en.js              # 英文语言包
│   │   ├── zh.js              # 中文语言包
│   │   └── index.js           # 国际化配置
│   ├── router/             # 路由配置
│   │   └── index.js          # 路由定义
│   ├── stores/             # Pinia 状态管理
│   │   ├── chat.js           # 聊天相关状态
│   │   ├── setting.js        # 设置相关状态
│   │   └── language.js       # 语言相关状态
│   ├── utils/              # 工具函数
│   │   ├── api.js            # API 请求封装
│   │   ├── markdown.js       # Markdown 处理
│   │   └── messageHandler.js # 消息处理
│   ├── views/              # 页面
│   │   └── ChatView.vue      # 主聊天页面
│   ├── App.vue             # 根组件
│   ├── main.js             # 应用入口
│   └── style.css           # 全局样式
├── index.html              # HTML 模板
├── package.json            # 项目配置
└── vite.config.js         # Vite 配置
```

## 使用方法

### 基本操作

1. **发送消息**：在输入框中输入消息，按 Enter 键发送，Shift + Enter 换行
2. **创建新对话**：点击侧边菜单的「新对话」按钮
3. **切换对话**：点击侧边菜单中的对话列表项
4. **删除对话**：点击对话列表项右侧的删除按钮
5. **编辑对话标题**：点击对话列表项右侧的编辑按钮，可修改对话标题
6. **查看设置**：点击侧边菜单的「设置」按钮，可配置模型参数
7. **切换语言**：点击侧边菜单的「Switch Language / 切换语言」按钮
8. **折叠侧边栏**：点击侧边栏顶部的折叠/展开按钮

### 高级功能

1. **查看推理过程**：助手回复后，点击「查看推理过程」可展开查看模型的思考逻辑
2. **Markdown 支持**：在消息中使用 Markdown 语法，系统会自动渲染
3. **代码高亮**：在消息中使用代码块，系统会自动进行语法高亮，并提供复制按钮
4. **表情符号**：支持使用 `:emoji:` 语法，系统会自动转换为可视化图标

## 配置说明

应用的设置项包括：

| 配置项 | 说明 |
|--------|------|
| **API Key** | Silicon Flow API 密钥（用于调用模型接口） |
| **选择模型** | 可选 DeepSeek-R1、Qwen3-8B、GLM-Z1-9B-0414 |
| **流式响应** | 开启/关闭流式输出 |
| **最大 Token 数** | 限制模型回复的长度（512-4096） |
| **温度参数** | 控制模型输出的随机性（0-1） |
| **核采样参数 (Top P)** | 控制输出确定性（0-1） |
| **前 K 采样参数 (Top K)** | 限制候选词数量（10-100） |

### API 配置

- **API 地址**：https://api.siliconflow.cn/v1
- **聊天接口**：POST /chat/completions

## 注意事项

- 本项目默认使用 localStorage 存储聊天记录和设置，数据仅保存在本地浏览器中
- 请确保配置了正确的 API Key，否则无法获取模型回复
- 流式响应功能需要 API 支持 Server-Sent Events (SSE)
- 本项目使用的模型推理 API 为 Silicon Flow 提供

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 许可证

MIT License

# LLM-ChatBot

中文版本｜[English Version](README.en.md)

基于 Vue 3 + TypeScript 的现代化 LLM 聊天机器人应用。支持多会话管理、Markdown 渲染、流式响应、推理过程展示、暗色/亮色主题切换和国际化。

## 功能特点

- **多会话管理**：创建、切换、重命名、删除会话，支持 localStorage 持久化
- **流式响应**：SSE 流式输出，打字机逐字渲染，支持随时中断
- **Markdown 渲染**：代码高亮（highlight.js）、表格、引用、表情符号、链接
- **推理过程展示**：展开查看模型推理链，理解 AI 思考逻辑
- **暗色/亮色主题**：支持亮色/暗色/跟随系统三种模式，75+ CSS 变量驱动
- **响应式布局**：完美适配移动端（滑入式侧边栏）、平板和 PC 端
- **消息交互**：一键复制消息、消息发送失败重试、清空当前会话
- **国际化**：支持中文 / English 无缝切换，所有文案集中管理
- **配置化**：API Key、模型选择、Temperature、Top P/K 等参数可调，持久化存储

## 技术栈

| 类别 | 技术 |
|------|------|
| 语言 | TypeScript（严格模式） |
| 前端框架 | Vue 3 (Composition API) |
| 构建工具 | Vite 6 |
| 状态管理 | Pinia + pinia-plugin-persistedstate |
| 路由 | Vue Router 4（懒加载） |
| HTTP 请求 | 原生 Fetch API |
| Markdown | markdown-it + highlight.js |
| 国际化 | vue-i18n 11 |
| 样式方案 | CSS 自定义属性（零预处理依赖） |
| UI 组件 | 全部自研，零第三方 UI 库 |

## 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm / yarn / pnpm 包管理器

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/zhianziqiyan/LLM-ChatBot.git
cd LLM-ChatBot

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 类型检查
npm run type-check

# 5. 生产构建
npm run build

# 6. 预览生产构建
npm run preview
```

## 项目结构

```
src/
├── types/                  # 类型定义
│   ├── chat.ts             # ChatMessage, Conversation, StreamUpdate
│   ├── api.ts              # API 请求/响应类型
│   └── settings.ts         # AppSettings, ThemeMode, Language
├── config/                 # 应用配置（零硬编码）
│   ├── index.ts            # API_BASE_URL, DEFAULT_SETTINGS
│   └── models.ts           # MODEL_OPTIONS 模型列表
├── stores/                 # Pinia 状态管理
│   ├── chat.ts             # 会话 & 消息 Store
│   ├── settings.ts         # 配置 Store
│   ├── language.ts         # 语言 Store
│   └── theme.ts            # 主题 Store（暗色/亮色/自动）
├── services/               # API 服务层
│   ├── api.ts              # fetch 封装 + ApiError 类
│   └── stream.ts           # SSE 流式解析器
├── composables/            # Vue Composables
│   ├── useChat.ts          # 发送/停止/重试消息
│   └── useAutoScroll.ts    # 智能滚动（仅底部时自动跟随）
├── components/
│   ├── chat/               # 聊天核心组件
│   │   ├── ChatView.vue         # 聊天主视图
│   │   ├── ChatMessage.vue      # 消息气泡（Markdown/推理/复制/重试）
│   │   ├── ChatInput.vue        # 输入框（Enter 发送 / Shift+Enter 换行）
│   │   ├── TypingIndicator.vue  # 打字动画指示器
│   │   └── EmptyState.vue       # 空状态引导
│   ├── layout/
│   │   └── AppSidebar.vue       # 侧边栏（会话列表 / 主题 / 语言切换）
│   ├── settings/
│   │   └── SettingsModal.vue    # 设置弹窗（原生控件）
│   └── common/
│       ├── AppIcon.vue          # 内联 SVG 图标组件
│       └── Toast.vue            # Toast 通知
├── styles/                 # 样式系统
│   ├── variables.css       # 75+ CSS 变量（light + dark 双主题）
│   ├── base.css            # Reset / 排版 / 滚动条
│   ├── animations.css      # 关键帧动画库
│   └── markdown.css        # Markdown 渲染样式
├── utils/
│   ├── markdown.ts         # MarkdownIt 配置
│   ├── clipboard.ts        # 剪贴板工具
│   ├── format.ts           # 时间格式化 / debounce
│   └── icons.ts            # SVG Path 图标集（24 个图标）
├── locale/
│   ├── zh.ts               # 中文语言包
│   ├── en.ts               # 英文语言包
│   └── index.ts            # vue-i18n 配置
├── router/index.ts         # 路由配置
├── App.vue                 # 根组件
└── main.ts                 # 应用入口
```

## 使用方法

### 基础操作

| 操作 | 方式 |
|------|------|
| 发送消息 | Enter 键或点击发送按钮 |
| 换行输入 | Shift + Enter |
| 中断回复 | 点击输入框右侧红色停止按钮 |
| 新建会话 | 点击侧边栏「新对话」 |
| 切换会话 | 点击侧边栏会话列表项 |
| 重命名会话 | 悬停会话 → 点击编辑图标 |
| 删除会话 | 悬停会话 → 点击删除图标 |
| 清空当前会话 | 点击顶部右侧删除按钮 |
| 复制消息 | 悬停消息气泡 → 点击复制图标 |
| 重试发送 | 消息出错后点击气泡内「重试」按钮 |
| 查看推理过程 | 点击消息气泡内的「推理过程」按钮 |

### 主题切换

点击侧边栏主题按钮，在亮色 → 暗色 → 跟随系统三种模式间循环切换。

### 语言切换

点击侧边栏语言按钮，在中 / English 之间切换。

## 配置说明

| 配置项 | 说明 | 范围 |
|--------|------|------|
| API Key | SiliconFlow API 密钥 | - |
| 模型 | DeepSeek-R1 / Qwen3-8B / GLM-Z1-9B-0414 | - |
| 流式响应 | 开启/关闭 SSE 流式输出 | 开/关 |
| 最大 Token 数 | 限制模型单次输出长度 | 512 - 4096 |
| 温度参数 | 控制输出随机性 | 0 - 1 |
| 核采样参数 (Top P) | 控制输出确定性 | 0 - 1 |
| Top K | 限制候选词数量 | 10 - 100 |

### API 配置

- **API 地址**：`https://api.siliconflow.cn/v1`（可在 `src/config/index.ts` 中修改）
- **聊天端点**：POST `/chat/completions`

## 许可证

MIT License

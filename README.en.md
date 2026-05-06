# LLM-ChatBot

[中文版本](README.md)｜English Version

A modern LLM chatbot application built with Vue 3 + TypeScript. Supports multi-conversation management, Markdown rendering, streaming responses, reasoning process display, dark/light theme, and internationalization.

## Features

- **Multi-conversation**: Create, switch, rename, and delete conversations with localStorage persistence
- **Streaming Response**: SSE-based streaming output with typewriter animation and stop control
- **Markdown Rendering**: Syntax highlighting (highlight.js), tables, blockquotes, emojis, links
- **Reasoning Display**: Expand to view model reasoning chains and understand AI logic
- **Dark/Light Theme**: Three modes — light, dark, and system-follow — powered by 75+ CSS variables
- **Responsive Layout**: Perfectly adapted for mobile (slide-in sidebar), tablet, and desktop
- **Message Actions**: One-click copy, retry on failure, clear current conversation
- **I18n**: Chinese / English seamless switching with centralized translation files
- **Configurable**: API Key, model selection, Temperature, Top P/K — all persisted to localStorage

## Tech Stack

| Category | Technology |
|----------|------------|
| Language | TypeScript (strict mode) |
| Framework | Vue 3 (Composition API) |
| Build Tool | Vite 6 |
| State Management | Pinia + pinia-plugin-persistedstate |
| Routing | Vue Router 4 (lazy loading) |
| HTTP | Native Fetch API |
| Markdown | markdown-it + highlight.js |
| I18n | vue-i18n 11 |
| Styling | CSS custom properties (zero preprocessor deps) |
| UI Components | Fully custom-built, zero third-party UI library |

## Quick Start

### Requirements

- Node.js 18.0+
- npm / yarn / pnpm

### Setup

```bash
# 1. Clone
git clone https://github.com/zhianziqiyan/LLM-ChatBot.git
cd LLM-ChatBot

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Type check
npm run type-check

# 5. Production build
npm run build

# 6. Preview build
npm run preview
```

## Project Structure

```
src/
├── types/                  # Type definitions
│   ├── chat.ts             # ChatMessage, Conversation, StreamUpdate
│   ├── api.ts              # API request/response types
│   └── settings.ts         # AppSettings, ThemeMode, Language
├── config/                 # App configuration (zero hardcoding)
│   ├── index.ts            # API_BASE_URL, DEFAULT_SETTINGS
│   └── models.ts           # MODEL_OPTIONS
├── stores/                 # Pinia stores
│   ├── chat.ts             # Conversations & messages
│   ├── settings.ts         # App settings
│   ├── language.ts         # Language preference
│   └── theme.ts            # Theme (dark/light/auto)
├── services/               # API service layer
│   ├── api.ts              # Fetch wrapper + ApiError
│   └── stream.ts           # SSE stream parser
├── composables/            # Vue Composables
│   ├── useChat.ts          # Send/stop/retry messages
│   └── useAutoScroll.ts    # Smart scroll (follows only when near bottom)
├── components/
│   ├── chat/               # Core chat components
│   │   ├── ChatView.vue         # Main chat view
│   │   ├── ChatMessage.vue      # Message bubble (Markdown/reasoning/copy/retry)
│   │   ├── ChatInput.vue        # Input box (Enter send / Shift+Enter newline)
│   │   ├── TypingIndicator.vue  # Typing animation dots
│   │   └── EmptyState.vue       # Empty state
│   ├── layout/
│   │   └── AppSidebar.vue       # Sidebar (conversations / theme / language)
│   ├── settings/
│   │   └── SettingsModal.vue    # Settings modal (native form controls)
│   └── common/
│       ├── AppIcon.vue          # Inline SVG icon component
│       └── Toast.vue            # Toast notifications
├── styles/                 # Design system
│   ├── variables.css       # 75+ CSS variables (light + dark)
│   ├── base.css            # Reset / typography / scrollbar
│   ├── animations.css      # Keyframe animations
│   └── markdown.css        # Markdown content styles
├── utils/
│   ├── markdown.ts         # MarkdownIt config
│   ├── clipboard.ts        # Clipboard utility
│   ├── format.ts           # Time formatting / debounce
│   └── icons.ts            # SVG path icon set (24 icons)
├── locale/
│   ├── zh.ts               # Chinese translations
│   ├── en.ts               # English translations
│   └── index.ts            # vue-i18n setup
├── router/index.ts         # Router config
├── App.vue                 # Root component
└── main.ts                 # Entry point
```

## Usage

### Basics

| Action | How |
|--------|-----|
| Send message | Enter key or click send button |
| New line | Shift + Enter |
| Stop generation | Click red stop button in input area |
| New conversation | Click "New Chat" in sidebar |
| Switch conversation | Click a conversation in sidebar |
| Rename conversation | Hover → click edit icon |
| Delete conversation | Hover → click delete icon |
| Clear messages | Click trash icon in top bar |
| Copy message | Hover message bubble → click copy icon |
| Retry on error | Click "Retry" inside the error bubble |
| View reasoning | Click "Reasoning" toggle in assistant message |

### Theme

Click the theme button in the sidebar to cycle through light → dark → system.

### Language

Click the language button in the sidebar to toggle between Chinese and English.

## Configuration

| Setting | Description | Range |
|---------|-------------|-------|
| API Key | SiliconFlow API key | - |
| Model | DeepSeek-R1 / Qwen3-8B / GLM-Z1-9B-0414 | - |
| Streaming | Enable/disable SSE streaming | On/Off |
| Max Tokens | Maximum output length | 512 - 4096 |
| Temperature | Output randomness | 0 - 1 |
| Top P | Nucleus sampling | 0 - 1 |
| Top K | Candidate word limit | 10 - 100 |

### API Configuration

- **Base URL**: `https://api.siliconflow.cn/v1` (configurable in `src/config/index.ts`)
- **Chat Endpoint**: POST `/chat/completions`

## License

MIT License

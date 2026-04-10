# LLM-ChatBot

[中文版本](README.md)｜English Version

A modern LLM chatbot application based on Vue 3, supporting multi-conversation management, Markdown rendering, streaming responses, reasoning process display, and multi-language switching.

## Features

- **Multi-conversation Management**: Support creating, switching, and deleting conversations, making it easy to organize chats on different topics
- **Markdown Support**: Message content supports Markdown format, including code highlighting and emoji
- **Streaming Response**: Support LLM streaming output, providing a smoother chat experience
- **Reasoning Process Display**: Expand to view the model's reasoning process and understand AI thinking logic
- **Data Persistence**: Use localStorage to store chat records and settings, data is not lost after page refresh
- **Multi-language Support**: Support Chinese and English interface switching
- **Collapsible Sidebar**: Collapsible sidebar design, adapting to different screen sizes
- **Responsive Design**: Adapt to different screen sizes, providing a good user experience

## Tech Stack

- **Frontend Framework**: Vue 3
- **State Management**: Pinia + pinia-plugin-persistedstate (persistent storage)
- **UI Component Library**: Element Plus
- **Routing**: Vue Router
- **Build Tool**: Vite
- **Network Request**: Native Fetch API
- **Markdown Rendering**: markdown-it + highlight.js
- **Internationalization**: vue-i18n

## Quick Start

### Environment Requirements

- Node.js 16.0 or higher
- npm, yarn, or pnpm package manager

### Installation Steps

1. Clone the project to your local machine

```bash
git clone https://github.com/zhianziqiyan/LLM-ChatBot.git
cd LLM-ChatBot
```

2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Build for production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

5. Preview the production build

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## Project Structure

```
LLM-ChatBot/
├── public/                  # Static resources
├── src/
│   ├── assets/             # Static resources
│   ├── components/          # Components
│   │   ├── ChatInput.vue       # Chat input component
│   │   ├── ChatMessage.vue     # Message display component
│   │   ├── SettingDialog.vue   # Settings dialog component
│   │   └── SideMenu.vue        # Side menu component
│   ├── locale/              # Internationalization files
│   │   ├── en.js               # English language pack
│   │   ├── zh.js               # Chinese language pack
│   │   └── index.js            # Internationalization config
│   ├── router/              # Router configuration
│   │   └── index.js           # Router definition
│   ├── stores/              # Pinia state management
│   │   ├── chat.js            # Chat-related state
│   │   ├── setting.js         # Settings-related state
│   │   └── language.js        # Language-related state
│   ├── utils/               # Utility functions
│   │   ├── api.js             # API request wrapper
│   │   ├── markdown.js        # Markdown processing
│   │   └── messageHandler.js # Message processing
│   ├── views/               # Pages
│   │   └── ChatView.vue       # Main chat page
│   ├── App.vue              # Root component
│   ├── main.js              # Application entry
│   └── style.css            # Global styles
├── index.html               # HTML template
├── package.json             # Project configuration
└── vite.config.js          # Vite configuration
```

## Usage

### Basic Operations

1. **Send Message**: Enter a message in the input box, press Enter to send, Shift + Enter for new line
2. **Create New Conversation**: Click the "New Chat" button in the sidebar
3. **Switch Conversation**: Click on a conversation item in the sidebar
4. **Delete Conversation**: Click the delete button next to a conversation item
5. **Edit Conversation Title**: Click the edit button next to a conversation item to modify the conversation title
6. **View Settings**: Click the "Settings" button in the sidebar to configure model parameters
7. **Switch Language**: Click the "Switch Language / 切换语言" button in the sidebar
8. **Collapse Sidebar**: Click the collapse/expand button at the top of the sidebar

### Advanced Features

1. **View Reasoning Process**: After the assistant replies, click "View Reasoning Process" to expand and view the model's thinking logic
2. **Markdown Support**: Use Markdown syntax in messages, the system will automatically render it
3. **Code Highlighting**: Use code blocks in messages, the system will automatically perform syntax highlighting with a copy button
4. **Emoji**: Support using `:emoji:` syntax, the system will automatically convert to visual icons

## Configuration

Application settings include:

| Setting | Description |
|---------|-------------|
| **API Key** | Silicon Flow API key (for calling the model interface) |
| **Select Model** | Available: DeepSeek-R1, Qwen3-8B, GLM-Z1-9B-0414 |
| **Streaming Response** | Enable/disable streaming output |
| **Max Tokens** | Limit the length of model responses (512-4096) |
| **Temperature** | Control the randomness of model output (0-1) |
| **Top P (Nucleus Sampling)** | Control output determinism (0-1) |
| **Top K (Top K Sampling)** | Limit the number of candidate words (10-100) |

### API Configuration

- **API Address**: https://api.siliconflow.cn/v1
- **Chat Endpoint**: POST /chat/completions

## Notes

- This project uses localStorage to store chat records and settings by default, data is only saved in the local browser
- Please ensure that the correct API Key is configured, otherwise the model response cannot be obtained
- The streaming response feature requires the API to support Server-Sent Events (SSE)
- The model inference API used in this project is provided by Silicon Flow

## Contribution Guide

Welcome to submit Issues and Pull Requests to improve this project!

## License

MIT License

# LLM-ChatBot

English Version｜[中文版本](README.zh-CN.md)

A modern LLM chatbot application based on Vue 3, supporting multi-conversation management, Markdown rendering, streaming responses, and reasoning process display.

## Features

- **Multi-conversation Management**: Support creating, switching, and deleting conversations, making it easy for users to organize chats on different topics
- **Markdown Support**: Message content supports Markdown format, including code highlighting
- **Streaming Response**: Support streaming output from LLM, providing a smoother chat experience
- **Reasoning Process Display**: Expand to view the model's reasoning process and understand AI thinking logic
- **Data Persistence**: Use localStorage to store chat records, data is not lost after page refresh
- **Responsive Design**: Adapt to different screen sizes and provide a good user experience

## Tech Stack

- **Frontend Framework**: Vue 3
- **State Management**: Pinia
- **UI Component Library**: Element Plus
- **Routing**: Vue Router
- **Build Tool**: Vite
- **Network Request**: Axios
- **Markdown Rendering**: markdown-it
- **Code Highlighting**: highlight.js

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
├── public/             # Static resources
├── src/
│   ├── assets/        # Static resources
│   ├── components/    # Components
│   │   ├── ChatInput.vue        # Chat input component
│   │   ├── ChatMessage.vue      # Message display component
│   │   ├── DialogEdit.vue       # Conversation edit dialog
│   │   ├── PopupMenu.vue        # Side menu component
│   │   ├── SearchDialog.vue     # Search dialog component
│   │   └── SettingsPanel.vue    # Settings panel component
│   ├── stores/        # Pinia state management
│   │   ├── chat.js              # Chat-related state
│   │   └── setting.js           # Settings-related state
│   ├── utils/         # Utility functions
│   │   ├── request.js           # Network request encapsulation
│   │   ├── api.js               # Specific API definitions
│   │   ├── markdown.js          # Markdown processing
│   │   └── messageHandler.js    # Message processing
│   ├── views/         # Pages
│   │   └── ChatView.vue         # Main chat page
│   ├── App.vue        # Root component
│   ├── main.js        # Application entry
│   └── style.css      # Global styles
├── .gitignore         # Git ignore file
├── index.html         # HTML template
├── package.json       # Project configuration
├── package-lock.json  # Dependency lock
└── vite.config.js     # Vite configuration
```

## Usage

### Basic Operations

1. **Send Message**: Enter a message in the input box and press Enter or click the send button
2. **Line Break**: Press Shift + Enter to create a line break in the input box
3. **Create New Conversation**: Click the "New Conversation" button in the side menu
4. **Switch Conversation**: Click on a conversation item in the side menu
5. **Delete Conversation**: Click the delete button next to a conversation item
6. **Edit Conversation**: Click the edit button next to a conversation item to modify the conversation title
7. **Search Conversation**: Click the search button in the side menu to search for historical conversations
8. **View Settings**: Click the settings button in the side menu to configure model parameters

### Advanced Features

1. **View Reasoning Process**: After the assistant replies, click "View Reasoning Process" to expand and view the model's thinking logic
2. **Markdown Support**: Use Markdown syntax in messages, the system will automatically render it
3. **Code Highlighting**: Use code blocks in messages, the system will automatically perform syntax highlighting

## Configuration Instructions

The application settings include:

- **API Address**: LLM model's API endpoint
- **Model**: Select the LLM model to use
- **Temperature**: Control the randomness of model output
- **Max Tokens**: Limit the length of model responses
- **Streaming Response**: Enable/disable streaming output

## Notes

- This project uses localStorage to store chat records by default, and data is only saved in the local browser
- Please ensure that the correct API address is configured, otherwise the model response cannot be obtained
- The streaming response feature requires the API to support Server-Sent Events (SSE)

## Contribution Guide

Welcome to submit Issues and Pull Requests to improve this project!

## License

MIT License
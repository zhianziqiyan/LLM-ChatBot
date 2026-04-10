import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { i18n } from "../locale";

export const useChatStore = defineStore(
  "llm-chat",
  () => {
    /**
     * 所有聊天对话列表（初始包含一个默认对话）
     * @type {Ref<Array<object>>}
     * @property {string} id - 对话唯一 ID（时间戳生成）
     * @property {string} title - 对话标题（默认 "日常问候"）
     * @property {Array<object>} messages - 对话中的消息列表
     * @property {number} createdAt - 对话创建时间戳
     */
    const conversations = ref([
      {
        id: "1",
        title: i18n.global.locale.value === 'zh' ? "新对话" : "New Chat",
        messages: [],
        createdAt: Date.now(),
      },
    ]);

    /**
     * 聊天加载状态（用于控制加载动画）
     * @type {Ref<boolean>}
     */
    const isLoading = ref(false);

    /**
       * 设置加载状态（控制加载动画显示/隐藏）
       * @param {boolean} value - 加载状态（true: 加载中，false: 加载完成）
       */
    const setIsLoading = (value) => {
      isLoading.value = value
    }

    /**
     * 当前选中的对话 ID（用于定位当前操作的对话）
     * @type {Ref<string>}
     */
    const currentConversationId = ref("1");

    /**
     * 计算属性：获取当前选中的对话对象
     * @type {ComputedRef<object | undefined>}
     */
    const currentConversation = computed(() => {
      return conversations.value.find(
        (conv) => conv.id === currentConversationId.value
      );
    });

    /**
     * 计算属性：获取当前对话的消息列表（避免直接操作原始数据）
     * @type {ComputedRef<Array<object>>}
     */
    const currentMessages = computed(() => {
      return currentConversation.value?.messages || [];
    });

    /**
     * 创建新对话（添加到对话列表头部，并切换为当前对话）
     */
    const createConversation = () => {
      const newConversation = {
        id: Date.now().toString(),
        title: i18n.global.locale.value === 'zh' ? "新对话" : "New Chat",
        messages: [],
        createdAt: Date.now(),
      };
      conversations.value.unshift(newConversation);
      currentConversationId.value = newConversation.id;
    };

    /**
     * 切换当前对话（通过对话 ID 定位）
     * @param {string} conversationId - 目标对话 ID
     */
    const switchConversation = (conversationId) => {
      currentConversationId.value = conversationId
    }

    /**
       * 删除指定对话，如果当前对话被删除，则切换到默认对话
       * @param {string} conversationId - 要删除的对话 ID
       */
    const deleteConversation = (conversationId) => {
      const index = conversations.value.findIndex(
        (conv) => conv.id === conversationId
      )
      if (index !== -1) {
        conversations.value.splice(index, 1);
        if (currentConversationId.value === conversationId) {
          currentConversationId.value = conversations.value[0].id;
        }//如果当前对话被删除，则切换到默认对话
      }
    }
    /**
       * 更新对话标题（修改指定对话的标题）
       * @param {string} conversationId - 目标对话 ID
       * @param {string} newTitle - 新标题
       */
    const updateConversationTitle = (conversationId, newTitle) => {
      const conversation = conversations.value.find(
        (conv) => conv.id === conversationId
      )
      if (conversation) {
        conversation.title = newTitle
      }
    }

    /**
       * 向当前对话添加消息（自动生成消息 ID 和时间戳）
       * @param {object} message - 消息内容（包含 role、content 等字段）
       */
    const addMessage = (message) => {
      if (currentConversation.value) {
        currentConversation.value.messages.push({
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...message,
        })
      }
    }

    /**
       * 更新当前对话的最后一条消息（用于流式响应或补充信息）
       * @param {string} content - 消息正文
       * @param {string} reasoning_content - 推理过程（可选）
       * @param {number} completion_tokens - 消耗的 Token 数（可选）
       * @param {string} speed - 响应速度（Token/秒，可选）
       */
    const updateLastMessage = (content, reasoning_content, completion_tokens, speed) => {
      if (currentConversation.value?.messages.length > 0) {
        const lastMessage = currentConversation.value.messages[currentConversation.value.messages.length - 1]
        lastMessage.content = content
        lastMessage.reasoning_content = reasoning_content
        lastMessage.completion_tokens = completion_tokens
        lastMessage.speed = speed
      }
    }

    /**
       * 获取当前对话的最后一条消息（用于操作最新消息）
       * @returns {object | null} 最后一条消息对象，无消息时返回 null
       */
    const getLastMessage = () => {
      if (currentConversation.value?.messages.length > 0) {
        return currentConversation.value.messages[currentConversation.value.messages.length - 1]
      }
      return null
    }

    return {
      conversations,
      isLoading,
      setIsLoading,
      currentConversationId,
      currentConversation,
      currentMessages,
      createConversation,
      switchConversation,
      deleteConversation,
      updateConversationTitle,
      addMessage,
      updateLastMessage,
      getLastMessage,
    }
  },
  {
    persist: true, //持久化存储
    storage: localStorage, //存储方式
  }
)

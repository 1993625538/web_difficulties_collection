<template>
    <div class="app-container">
        <ChatBar :conversations="conversations" @select-conversation="selectConversation"
            @new-conversation="createNewConversation" />

        <div class="main-content">
            <ChatArea v-if="currentConversation" :messages="currentConversation.messages" />

            <ChatInput @send-message="handleSendMessage" :loading="isLoading" />
        </div>
    </div>
</template>

<script>
import ChatBar from './ChatBar.vue'
import ChatArea from './ChatArea.vue'
import ChatInput from './ChatInput.vue'
import { ref, computed } from 'vue'

export default {
    name: 'App',
    components: {
        ChatBar,
        ChatArea,
        ChatInput
    },
    setup() {
        // 对话数据
        const conversations = ref([
            {
                id: '1',
                title: '如何学习Vue3?',
                messages: [
                    { id: '1-1', content: '如何学习Vue3?', sender: 'user', timestamp: new Date() },
                    { id: '1-2', content: '学习Vue3可以从官方文档开始，然后尝试构建一些小项目。', sender: 'assistant', timestamp: new Date() }
                ],
                createdAt: new Date()
            },
            {
                id: '2',
                title: 'JavaScript最佳实践',
                messages: [
                    { id: '2-1', content: 'JavaScript有哪些最佳实践?', sender: 'user', timestamp: new Date() },
                    { id: '2-2', content: '使用const/let代替var，模块化代码，避免全局变量等。', sender: 'assistant', timestamp: new Date() }
                ],
                createdAt: new Date()
            }
        ])

        const currentConversationId = ref('1')
        const isLoading = ref(false)

        // 当前选中的对话
        const currentConversation = computed(() => {
            return conversations.value.find(c => c.id === currentConversationId.value)
        })

        // 选择对话
        const selectConversation = (id) => {
            currentConversationId.value = id
        }

        // 创建新对话
        const createNewConversation = () => {
            const newId = Date.now().toString()
            const newConversation = {
                id: newId,
                title: '新对话',
                messages: [],
                createdAt: new Date()
            }
            conversations.value.unshift(newConversation)
            currentConversationId.value = newId
        }

        // 发送消息
        const handleSendMessage = async (message) => {
            if (!currentConversationId.value) return

            // 添加用户消息
            const userMessage = {
                id: Date.now().toString(),
                content: message,
                sender: 'user',
                timestamp: new Date()
            }

            const conversation = conversations.value.find(c => c.id === currentConversationId.value)
            conversation.messages.push(userMessage)

            // 更新对话标题（如果是第一条消息）
            if (conversation.messages.length === 1) {
                conversation.title = message.length > 20 ? message.substring(0, 20) + '...' : message
            }

            // 模拟AI回复
            isLoading.value = true
            try {
                // 这里应该是调用API的代码
                // const response = await chatAPI.send(message)
                await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟延迟

                const aiMessage = {
                    id: (Date.now() + 1).toString(),
                    content: `这是对"${message}"的模拟回复。在实际应用中，这里应该是AI的回复。`,
                    sender: 'assistant',
                    timestamp: new Date()
                }

                conversation.messages.push(aiMessage)
            } finally {
                isLoading.value = false
            }
        }

        return {
            conversations,
            currentConversationId,
            currentConversation,
            isLoading,
            selectConversation,
            createNewConversation,
            handleSendMessage
        }
    }
}
</script>

<style scoped>
/* 全局样式 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.5;
    color: #333;
}

/* 滚动条样式 */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

.app-container {
    display: flex;
    height: 100vh;
    background-color: #f7f7f8;
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
</style>
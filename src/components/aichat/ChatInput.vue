<template>
    <div class="chat-input-container">
        <form @submit.prevent="handleSubmit">
            <div class="input-wrapper">
                <textarea ref="textarea" v-model="message" placeholder="输入消息..."
                    @keydown.enter.exact.prevent="handleSubmit" @keydown.shift.enter="handleNewLine"
                    :disabled="loading"></textarea>
                <button type="submit" :disabled="!message || loading">
                    <svg v-if="loading" class="spinner" viewBox="0 0 50 50">
                        <circle cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
                    </svg>
                    <span v-else>发送</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
    props: {
        loading: {
            type: Boolean,
            default: false
        }
    },
    emits: ['send-message'],
    setup(props, { emit }) {
        const message = ref('')
        const textarea = ref(null)

        const handleSubmit = () => {
            if (!message.value.trim() || props.loading) return
            emit('send-message', message.value.trim())
            message.value = ''
            // 保持焦点在输入框
            textarea.value.focus()
        }

        const handleNewLine = () => {
            message.value += '\n'
        }

        // 自动调整输入框高度
        watch(message, () => {
            if (textarea.value) {
                textarea.value.style.height = 'auto'
                textarea.value.style.height = Math.min(textarea.value.scrollHeight, 200) + 'px'
            }
        })

        return {
            message,
            textarea,
            handleSubmit,
            handleNewLine
        }
    }
}
</script>

<style scoped>
.chat-input-container {
    padding: 16px;
    background-color: #fff;
    border-top: 1px solid #e5e7eb;
}

.input-wrapper {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    align-items: flex-end;
    gap: 8px;
}

textarea {
    flex: 1;
    min-height: 44px;
    max-height: 200px;
    padding: 10px 14px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    resize: none;
    font-size: 15px;
    line-height: 1.5;
    outline: none;
    transition: border-color 0.2s;
}

textarea:focus {
    border-color: #1a73e8;
}

button {
    height: 44px;
    padding: 0 16px;
    background-color: #1a73e8;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
}

button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.spinner {
    width: 20px;
    height: 20px;
    animation: rotate 2s linear infinite;
}

.spinner circle {
    stroke: white;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes dash {
    0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
    }

    50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -35;
    }

    100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -124;
    }
}
</style>
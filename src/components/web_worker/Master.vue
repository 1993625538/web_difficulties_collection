<script setup>
import { reactive, ref } from 'vue'

// 正确创建 Worker
const worker = new Worker(new URL('./slave.js', import.meta.url))
const messages = reactive([])
const inputText = ref('')

// 处理 Worker 消息
worker.onmessage = ({ data }) => {
    messages.push(data) // 现在应该能触发响应式更新
}

// 发送消息到 Worker
const handleClick = () => {
    worker.postMessage(inputText.value)
    inputText.value = '' // 清空输入
}
</script>

<template>
    <div>
        <input v-model="inputText" placeholder="输入消息">
        <button @click="handleClick">发送</button>
        <ul>
            <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
        </ul>
    </div>
</template>
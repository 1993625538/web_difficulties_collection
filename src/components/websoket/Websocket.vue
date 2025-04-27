<template>
    <div>
        <button @click="sendHeartBit">发送心跳</button>
    </div>
</template>

<script setup>
import { WebSocketServer } from '@/utils/ws';
import { onUnmounted, reactive } from 'vue';

const msgs = reactive([])
const server = new WebSocketServer('ws://localhost:8080', 1000, 1000, 20,15000)
server.connect()
const sendHeartBit = () => {
    server.sendHeartBit()
}
// const server = new WebSocket('ws://localhost:8080')
// server.onopen = () => {
//     console.log('onopen');
// }
// server.onerror = () => {
//     console.log('error');
//     this.reConnect()
// }
// server.onmessage = () => {
//     console.log('onmessage');
// }
// server.onclose = () => {
//     console.log('onclose');
//     this.reConnect()
// }
onUnmounted(() => {
    server = null
})
</script>

<style lang="scss" scoped></style>
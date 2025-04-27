<template>
    <div class="flex-1 bg-red-300">
        主页面
        <p>当前计数: {{ counter.count }}</p>
        <button @click="counter.increment()">+</button>
        <p>myCounter: {{ myCounter }}</p>
        <button @click="myCounter++">+</button>
    </div>
</template>

<script setup>
import { useCounterStore } from '@/store';
import { ref } from 'vue';
const counter = useCounterStore()

const myCounter = ref(0)
</script>

<style lang="scss" scoped></style>
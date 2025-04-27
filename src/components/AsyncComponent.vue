<template>
    <Suspense>
        <TestAsync />
        <template #fallback>
            Loading...
        </template>
    </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const TestAsync = defineAsyncComponent(() => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(import('@/components/AsyncOne.vue'))
        }, 1000)
    })
})
</script>

<style lang="scss" scoped></style>
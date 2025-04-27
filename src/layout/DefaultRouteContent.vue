<template>
    <div class="default-content">
        <span v-if="route.meta?.icon" class="icon" aria-hidden="true">
            <component :is="route.meta.icon" />
        </span>

        <span class="title">
            {{ route.meta?.title || route.name }}
        </span>

        <span v-if="route.children?.length" class="expand-indicator" :aria-expanded="false">
            {{ isExpanded ? '−' : '+' }}
        </span>
    </div>
</template>

<script setup>
defineProps({
    route: {
        type: Object,
        required: true
    },
    isExpanded: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped>
.default-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
}

.icon {
    display: inline-flex;
    width: 1.25rem;
    height: 1.25rem;
    color: var(--color-icon, #6c757d);
}

.title {
    flex: 1;
    color: var(--color-text, #212529);
}

.expand-indicator {
    width: 1rem;
    text-align: center;
    color: var(--color-expand, #adb5bd);
}
</style>
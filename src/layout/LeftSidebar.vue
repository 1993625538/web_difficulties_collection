<template>
    <div class="route-nav-tree bg-gray-50 p-4 w-48 rounded-lg">
        <ul class="space-y-1">
            <RouteNavItem v-for="route in routes.filter(r => r.meta.showInTree)" :key="route.path" :route="route" :current-route="useRoute().path"
                @navigate="handleNavigate" />
        </ul>
    </div>
</template>

<script setup>
import { routes } from "@/router/routes";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import RouteNavItem from "./RouteNavItem.vue";

const router = useRouter();


const handleNavigate = (path) => {
    router.push(path); // 手动跳转路由
};
</script>
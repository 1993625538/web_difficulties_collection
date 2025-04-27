<template>
  <li class="relative">
    <!-- 主按钮 -->
    <button
      @click="handleClick"
      class="flex items-center w-full px-3 py-2.5 rounded-lg transition-all duration-200 group"
      :class="{
        'bg-blue-50/80 text-blue-600 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)]': isActive,
        'text-gray-700 hover:bg-gray-100/80': !isActive && !hasChildren,
        'text-gray-600 hover:bg-gray-100/60': !isActive && hasChildren,
      }"
    >
      <!-- 图标 -->
      <span
        v-if="route.meta?.icon"
        class="mr-3 flex-shrink-0"
        :class="{
          'text-blue-500': isActive,
          'text-gray-400 group-hover:text-gray-600': !isActive
        }"
      >
        <i :class="route.meta.icon" class="text-lg"></i>
      </span>

      <!-- 路由名称 -->
      <span class="text-left font-medium text-sm truncate">
        {{ route.meta?.title || route.name }}
      </span>

      <!-- 徽章 -->
      <span
        v-if="route.meta?.badge"
        class="ml-2 px-1.5 py-0.5 text-xs rounded-full"
        :class="{
          'bg-blue-100 text-blue-800': isActive,
          'bg-gray-100 text-gray-600 group-hover:bg-gray-200': !isActive
        }"
      >
        {{ route.meta.badge }}
      </span>

      <!-- 子路由箭头指示器 -->
      <span
        v-if="hasChildren"
        class="ml-auto transition-transform duration-200 flex-shrink-0"
        :class="{
          'rotate-90 text-blue-500': isExpanded,
          'text-gray-400 group-hover:text-gray-600': !isExpanded
        }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </button>

    <!-- 活动状态指示器 -->
    <div
      v-if="isActive"
      class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full"
    ></div>

    <!-- 递归渲染子路由 -->
    <transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-screen"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 max-h-screen"
      leave-to-class="opacity-0 max-h-0"
    >
      <ul
        v-if="hasChildren && isExpanded"
        class="ml-5 mt-1 space-y-1 pl-4 border-l-2 border-gray-200/50"
      >
        <RouteNavItem
          v-for="child in route.children?.filter(child => child.meta?.showInTree)"
          :key="child.path"
          :route="child"
          :current-route="currentRoute"
          @navigate="handleNavigate"
        />
      </ul>
    </transition>
  </li>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  route: {
    type: Object,
    required: true,
  },
  currentRoute: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["navigate"]);

const isExpanded = ref(false);
const hasChildren = computed(() => props.route.children?.length > 0);
const isActive = computed(() => props.currentRoute.startsWith(props.route.path));

const handleClick = () => {
  if (hasChildren.value) {
    isExpanded.value = !isExpanded.value;
  } else {
    emit("navigate", props.route.path);
  }
};
</script>
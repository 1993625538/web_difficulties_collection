<template>
  <div class="app">
    <aside>
      <LeftSidebar></LeftSidebar>
    </aside>
    <main class="flex-1 bg-sky-200">
      <router-view v-slot="{ Component, route }">
        <!-- 通过 meta.keep 判断是否缓存 -->
        <keep-alive>
          <component :is="Component" v-if="route.meta.keep" :key="route.name" />
        </keep-alive>
        <!-- 不缓存的组件 -->
        <component :is="Component" v-if="!route.meta.keep" :key="route.name" />
      </router-view>

    </main>
  </div>
</template>
<script setup>
import { RouterView } from 'vue-router';
import LeftSidebar from './layout/LeftSidebar.vue';
</script>
<style>
.app {
  display: flex;
  width: 100vw;
  height: 100vh;
}
</style>
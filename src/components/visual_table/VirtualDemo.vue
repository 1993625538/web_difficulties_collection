<template>
    <div class="demo-container">
        <h1>虚拟列表演示</h1>

        <div class="list-container">
            <!-- 固定高度示例 -->
            <VirtualList :list-data="fixedHeightData" :item-height="60" item-key="id">
                <template #default="{ item }">
                    <div class="list-item">
                        <span class="item-id">{{ item.id }}</span>
                        <span class="item-content">{{ item.text }}</span>
                    </div>
                </template>
            </VirtualList>
        </div>

        <div class="list-container">
            <!-- 动态高度示例 -->
            <VirtualList :list-data="dynamicHeightData" :item-height="getItemHeight" item-key="id">
                <template #default="{ item }">
                    <div class="list-item dynamic">
                        <span class="item-id">{{ item.id }}</span>
                        <p class="item-content">{{ item.text }}</p>
                        <div class="item-footer">
                            <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
                        </div>
                    </div>
                </template>
            </VirtualList>
        </div>
    </div>
</template>

<script>
import VirtualList from './VirtualList.vue'

export default {
    components: { VirtualList },
    data() {
        return {
            fixedHeightData: this.generateFixedHeightData(1000),
            dynamicHeightData: this.generateDynamicHeightData(1000)
        }
    },
    methods: {
        generateFixedHeightData(count) {
            return Array.from({ length: count }, (_, i) => ({
                id: i + 1,
                text: `列表项 ${i + 1} - 固定高度内容`
            }))
        },
        generateDynamicHeightData(count) {
            const texts = [
                '短文本',
                '中等长度文本：虚拟列表是一种优化长列表性能的技术，它只渲染可视区域内的项目',
                '很长很长的文本：虚拟列表（Virtual List）是一种用于优化长列表性能的前端技术。它的核心思想是只渲染当前可视区域内的列表项，而不是渲染整个列表的所有项目。通过这种方式，可以大大减少DOM节点的数量，从而提高渲染性能和滚动流畅度。虚拟列表特别适合用于移动端或数据量很大的场景。',
                '超长文本配多标签：' +
                '虚拟列表的实现原理主要包括以下几个方面：\n' +
                '1. 计算可见区域\n' +
                '2. 计算可见项目的起始和结束索引\n' +
                '3. 使用占位元素撑开滚动容器\n' +
                '4. 动态计算和更新项目位置\n\n' +
                '实现时需要注意处理动态高度、快速滚动、数据更新等情况。'
            ]

            const tagsOptions = [
                [],
                ['标签1'],
                ['标签1', '标签2'],
                ['标签1', '标签2', '标签3'],
                ['标签1', '标签2', '标签3', '标签4']
            ]

            return Array.from({ length: count }, (_, i) => ({
                id: i + 1,
                text: texts[i % texts.length],
                tags: tagsOptions[i % tagsOptions.length]
            }))
        },
        getItemHeight(item) {
            // 基础高度
            let height = 40
            // 文本行数影响高度
            height += Math.ceil(item.text.length / 50) * 20
            // 标签影响高度
            height += item.tags.length * 24
            return height
        }
    }
}
</script>

<style scoped>
.demo-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.list-container {
    height: 400px;
    border: 1px solid #eee;
    margin-bottom: 30px;
    border-radius: 4px;
}

.list-item {
    padding: 10px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    flex-direction: column;
}

.list-item.dynamic {
    padding: 15px;
}

.item-id {
    font-weight: bold;
    margin-bottom: 5px;
    color: #666;
}

.item-content {
    margin: 5px 0;
    white-space: pre-wrap;
}

.item-footer {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 8px;
}

.tag {
    background: #e1f5fe;
    color: #0288d1;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 12px;
}
</style>
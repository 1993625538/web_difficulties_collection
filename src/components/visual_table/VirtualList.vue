<template>
    <div class="virtual-list-container" ref="container" @scroll="handleScroll">
        <!-- 撑开滚动区域的占位元素 -->
        <div class="virtual-list-phantom" :style="{ height: totalHeight + 'px' }"></div>

        <!-- 实际渲染的可视区域内容 -->
        <div class="virtual-list-content" :style="{ transform: `translateY(${offset}px)` }">
            <div v-for="item in visibleData" :key="item.id || item._vid" :style="{ height: itemHeight + 'px' }"
                class="virtual-list-item">
                <!-- 使用插槽让开发者自定义渲染内容 -->
                <slot :item="item" :index="item._index"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'VirtualList',
    props: {
        // 数据列表
        listData: {
            type: Array,
            required: true
        },
        // 每项高度（固定高度）或高度计算函数（动态高度）
        itemHeight: {
            type: [Number, Function],
            default: 60
        },
        // 缓冲区额外渲染的项目数
        bufferSize: {
            type: Number,
            default: 5
        },
        // 唯一键字段名
        itemKey: {
            type: String,
            default: 'id'
        }
    },
    data() {
        return {
            // 当前滚动位置
            scrollTop: 0,
            // 可视区域高度
            visibleHeight: 0,
            // 记录动态高度项的位置信息
            positions: []
        }
    },
    computed: {
        // 列表总高度（动态计算）
        totalHeight() {
            if (typeof this.itemHeight === 'number') {
                return this.listData.length * this.itemHeight;
            } else {
                return this.positions[this.positions.length - 1]?.bottom || 0;
            }
        },
        // 当前可见的数据项
        visibleData() {
            if (typeof this.itemHeight === 'number') {
                return this.getFixedVisibleData();
            } else {
                return this.getDynamicVisibleData();
            }
        },
        // 内容偏移量
        offset() {
            if (typeof this.itemHeight === 'number') {
                return Math.max(0, this.startIndex * this.itemHeight);
            } else {
                return this.positions[this.startIndex]?.top || 0;
            }
        },
        // 起始索引（固定高度）
        startIndex() {
            if (typeof this.itemHeight === 'number') {
                return Math.floor(this.scrollTop / this.itemHeight);
            } else {
                return this.binarySearch(this.scrollTop);
            }
        },
        // 结束索引（固定高度）
        endIndex() {
            if (typeof this.itemHeight === 'number') {
                return Math.min(
                    this.startIndex + this.visibleCount + this.bufferSize,
                    this.listData.length - 1
                );
            } else {
                let endIdx = this.startIndex;
                const startPos = this.positions[this.startIndex]?.top || 0;

                while (
                    endIdx < this.listData.length - 1 &&
                    this.positions[endIdx]?.bottom < startPos + this.visibleHeight
                ) {
                    endIdx++;
                }

                return Math.min(
                    endIdx + this.bufferSize,
                    this.listData.length - 1
                );
            }
        },
        // 可视区域能容纳的项目数（固定高度）
        visibleCount() {
            return Math.ceil(this.visibleHeight / this.itemHeight);
        }
    },
    watch: {
        listData: {
            immediate: true,
            handler() {
                this.initPositions();
            }
        }
    },
    mounted() {
        this.visibleHeight = this.$refs.container.clientHeight;
        window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        // 初始化动态高度项的位置信息
        initPositions() {
            if (typeof this.itemHeight === 'function') {
                this.positions = this.listData.map((item, index) => {
                    const height = this.itemHeight(item);
                    return {
                        index,
                        height,
                        top: index === 0 ? 0 : this.positions[index - 1].bottom,
                        bottom: index === 0 ? height : this.positions[index - 1].bottom + height
                    };
                });
            }
        },
        // 获取固定高度时的可见数据
        getFixedVisibleData() {
            const start = Math.max(0, this.startIndex - this.bufferSize);
            const end = Math.min(this.listData.length - 1, this.endIndex + this.bufferSize);

            return this.listData.slice(start, end + 1).map((item, i) => ({
                ...item,
                _index: start + i,
                _vid: item[this.itemKey] || start + i
            }));
        },
        // 获取动态高度时的可见数据
        getDynamicVisibleData() {
            const start = Math.max(0, this.startIndex - this.bufferSize);
            const end = Math.min(this.listData.length - 1, this.endIndex + this.bufferSize);

            return this.listData.slice(start, end + 1).map((item, i) => ({
                ...item,
                _index: start + i,
                _vid: item[this.itemKey] || start + i
            }));
        },
        // 二分查找当前滚动位置对应的项（动态高度）
        binarySearch(scrollTop) {
            let start = 0;
            let end = this.positions.length - 1;
            let tempIndex = -1;

            while (start <= end) {
                const mid = Math.floor((start + end) / 2);
                const midBottom = this.positions[mid].bottom;

                if (midBottom === scrollTop) {
                    return mid + 1;
                } else if (midBottom < scrollTop) {
                    start = mid + 1;
                } else if (midBottom > scrollTop) {
                    if (tempIndex === -1 || tempIndex > mid) {
                        tempIndex = mid;
                    }
                    end = mid - 1;
                }
            }

            return tempIndex;
        },
        // 处理滚动事件
        handleScroll() {
            this.scrollTop = this.$refs.container.scrollTop;

            // 动态高度时更新位置信息
            if (typeof this.itemHeight === 'function') {
                this.updatePositions();
            }
        },
        // 更新动态项的位置信息
        updatePositions() {
            const visibleItems = this.$el.querySelectorAll('.virtual-list-item');

            visibleItems.forEach(itemEl => {
                const index = parseInt(itemEl.dataset.index);
                const height = itemEl.clientHeight;

                if (this.positions[index].height !== height) {
                    const diff = height - this.positions[index].height;
                    this.positions[index].height = height;
                    this.positions[index].bottom += diff;

                    // 更新后续项的位置
                    for (let i = index + 1; i < this.positions.length; i++) {
                        this.positions[i].top = this.positions[i - 1].bottom;
                        this.positions[i].bottom += diff;
                    }
                }
            });
        },
        // 处理窗口大小变化
        handleResize() {
            this.visibleHeight = this.$refs.container.clientHeight;
        }
    }
}
</script>

<style scoped>
.virtual-list-container {
    position: relative;
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.virtual-list-phantom {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    z-index: -1;
}

.virtual-list-content {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
}

.virtual-list-item {
    box-sizing: border-box;
    overflow: hidden;
}
</style>
<template>
    <div class="flex h-screen bg-gray-50">
      <!-- 左侧设计区 -->
      <div 
        class="w-3/5 p-6 border-r border-gray-200 overflow-y-auto"
        @dragover.prevent="handleDragOver"
        @drop="handleDrop"
      >
        <h3 class="text-lg font-semibold text-gray-800 mb-4">表单设计区</h3>
        <div 
          class="min-h-[500px] border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white"
          :class="{ 'border-blue-500': isDraggingOver }"
        >
          <div 
            v-for="(item, index) in formItems" 
            :key="item.id"
            class="relative p-3 mb-3 rounded-md border border-transparent hover:border-gray-300"
            :class="{ 'border-blue-500 bg-blue-50': selectedItemId === item.id }"
            draggable="true"
            @dragstart="(e) => startDrag(e, index)"
            @click="selectItem(item.id)"
          >
            <component 
              :is="getComponent(item.type)" 
              v-bind="item.props"
            />
            <div v-if="selectedItemId === item.id" class="absolute top-0 right-0 mt-1 mr-1 flex space-x-1">
              <button 
                @click.stop="removeItem(index)"
                class="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                ×
              </button>
            </div>
          </div>
          <div v-if="formItems.length === 0" class="text-center text-gray-400 py-10">
            从右侧拖拽组件到此处
          </div>
        </div>
      </div>
  
      <!-- 右侧组件区 -->
      <div class="w-2/5 p-6 bg-white overflow-y-auto">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">组件列表</h3>
        <div class="space-y-3">
          <div 
            v-for="component in componentTemplates" 
            :key="component.type"
            class="p-3 bg-gray-100 rounded-md cursor-move hover:bg-gray-200"
            draggable="true"
            @dragstart="(e) => startDrag(e, component)"
          >
            {{ component.name }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  // 基础组件定义
  const BaseInput = {
    template: `
      <input 
        :type="type" 
        :placeholder="placeholder"
        class="w-full px-3 py-2 border border-gray-300 rounded-md"
      />
    `,
    props: ['type', 'placeholder']
  };
  
  const BaseSelect = {
    template: `
      <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
        <option v-for="(option, idx) in options" :key="idx" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    `,
    props: ['options']
  };
  
  const BaseButton = {
    template: `
      <button class="px-4 py-2 bg-blue-500 text-white rounded-md">
        {{ text }}
      </button>
    `,
    props: ['text']
  };
  
  export default {
    components: {
      BaseInput,
      BaseSelect,
      BaseButton
    },
    setup() {
      // 组件模板
      const componentTemplates = [
        {
          type: 'input',
          name: '输入框',
          props: {
            type: 'text',
            placeholder: '请输入内容'
          }
        },
        {
          type: 'select',
          name: '下拉框',
          props: {
            options: [
              { label: '选项1', value: '1' },
              { label: '选项2', value: '2' }
            ]
          }
        },
        {
          type: 'button',
          name: '按钮',
          props: {
            text: '提交'
          }
        }
      ];
  
      // 表单项目
      const formItems = ref([]);
      const selectedItemId = ref(null);
      const draggedItem = ref(null);
      const isDraggingOver = ref(false);
  
      // 获取组件
      const getComponent = (type) => {
        const components = {
          input: BaseInput,
          select: BaseSelect,
          button: BaseButton
        };
        return components[type];
      };
  
      // 选择项目
      const selectItem = (id) => {
        selectedItemId.value = id;
      };
  
      // 删除项目
      const removeItem = (index) => {
        formItems.value.splice(index, 1);
        if (selectedItemId.value === formItems.value[index]?.id) {
          selectedItemId.value = null;
        }
      };
  
      // 开始拖拽
      const startDrag = (e, item) => {
        if (typeof item === 'number') {
          // 拖拽已有项目（用于排序）
          draggedItem.value = {
            type: 'existing',
            index: item,
            data: formItems.value[item]
          };
        } else {
          // 拖拽新组件
          draggedItem.value = {
            type: 'new',
            data: {
              ...item,
              id: Date.now().toString() // 为每个新项目生成唯一ID
            }
          };
        }
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', ''); // 必须设置数据才能拖拽
      };
  
      // 处理拖拽经过
      const handleDragOver = (e) => {
        e.preventDefault();
        isDraggingOver.value = true;
      };
  
      // 处理放置
      const handleDrop = (e) => {
        e.preventDefault();
        isDraggingOver.value = false;
        
        if (!draggedItem.value) return;
  
        if (draggedItem.value.type === 'new') {
          // 添加新组件
          formItems.value.push(draggedItem.value.data);
          selectedItemId.value = draggedItem.value.data.id;
        } else if (draggedItem.value.type === 'existing') {
          // 重新排序（这里简化处理，实际可以计算放置位置）
          const item = formItems.value[draggedItem.value.index];
          formItems.value.splice(draggedItem.value.index, 1);
          formItems.value.push(item);
        }
        
        draggedItem.value = null;
      };
  
      return {
        componentTemplates,
        formItems,
        selectedItemId,
        isDraggingOver,
        getComponent,
        selectItem,
        removeItem,
        startDrag,
        handleDragOver,
        handleDrop
      };
    }
  };
  </script>
<template>
    <div class="sidebar">
      <div class="sidebar-header">
        <button class="new-chat-btn" @click="$emit('new-conversation')">
          <span>+</span> 新对话
        </button>
      </div>
      
      <div class="conversation-list">
        <div 
          v-for="conv in conversations" 
          :key="conv.id"
          class="conversation-item"
          :class="{ active: conv.id === currentConversationId }"
          @click="$emit('select-conversation', conv.id)"
        >
          <div class="conversation-title">{{ conv.title }}</div>
          <div class="conversation-time">{{ formatTime(conv.createdAt) }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue'
  
  export default {
    props: {
      conversations: {
        type: Array,
        required: true
      },
      currentConversationId: {
        type: String
      }
    },
    setup() {
      const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
  
      return {
        formatTime
      }
    }
  }
  </script>
  
  <style scoped>
  .sidebar {
    width: 260px;
    height: 100%;
    background-color: #f0f4f9;
    border-right: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
  }
  
  .sidebar-header {
    padding: 16px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .new-chat-btn {
    width: 100%;
    padding: 10px 16px;
    background-color: #e6f0ff;
    border: 1px solid #d1e0ff;
    border-radius: 8px;
    color: #1a73e8;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  
  .new-chat-btn:hover {
    background-color: #d1e0ff;
  }
  
  .new-chat-btn span {
    font-size: 18px;
    margin-right: 8px;
  }
  
  .conversation-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
  }
  
  .conversation-item {
    padding: 12px 16px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .conversation-item:hover {
    background-color: #e6eaf0;
  }
  
  .conversation-item.active {
    background-color: #dbe6f5;
  }
  
  .conversation-title {
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .conversation-time {
    font-size: 12px;
    color: #666;
    margin-top: 4px;
  }
  </style>
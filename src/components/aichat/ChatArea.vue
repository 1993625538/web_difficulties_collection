<template>
    <div class="message-area">
      <div class="messages-container">
        <div 
          v-for="message in messages" 
          :key="message.id"
          class="message"
          :class="message.sender"
        >
          <div class="message-content">
            <div class="message-text">{{ message.content }}</div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      messages: {
        type: Array,
        required: true
      }
    },
    methods: {
      formatTime(date) {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    }
  }
  </script>
  
  <style scoped>
  .message-area {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background-color: #f7f7f8;
  }
  
  .messages-container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .message {
    display: flex;
    margin-bottom: 20px;
  }
  
  .message.user {
    justify-content: flex-end;
  }
  
  .message.assistant {
    justify-content: flex-start;
  }
  
  .message-content {
    max-width: 80%;
    padding: 12px 16px;
    border-radius: 8px;
    position: relative;
  }
  
  .message.user .message-content {
    background-color: #e6f0ff;
    border-top-right-radius: 0;
  }
  
  .message.assistant .message-content {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-top-left-radius: 0;
  }
  
  .message-text {
    font-size: 15px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
  }
  
  .message-time {
    font-size: 11px;
    color: #666;
    margin-top: 4px;
    text-align: right;
  }
  </style>
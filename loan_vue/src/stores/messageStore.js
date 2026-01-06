import { reactive, computed } from 'vue'

// 创建消息存储
const messageStore = reactive({
  messages: [],
  unreadCount: 0,
  
  // 添加新消息
  addMessage(message) {
    this.messages.unshift(message)
    if (!message.isRead) {
      this.unreadCount++
    }
  },
  
  // 标记消息为已读
  markAsRead(messageId) {
    const message = this.messages.find(msg => msg.id === messageId)
    if (message && !message.isRead) {
      message.isRead = true
      this.unreadCount = Math.max(0, this.unreadCount - 1)
    }
  },
  
  // 标记所有消息为已读
  markAllAsRead() {
    this.messages.forEach(message => {
      message.isRead = true
    })
    this.unreadCount = 0
  },
  
  // 清空消息
  clearMessages() {
    this.messages = []
    this.unreadCount = 0
  },
  
  // 获取未读消息数量
  get unreadCountValue() {
    return this.unreadCount
  }
})

// 创建计算属性
export const unreadCount = computed(() => messageStore.unreadCount)

export default messageStore
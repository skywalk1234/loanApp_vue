<template>
  <div class="message">
    <div class="page-header">
      <h1 class="page-title">消息中心</h1>
    </div>
    
    <!-- 消息分类标签 -->
    <div class="message-tabs">
      <button 
        class="tab-btn"
        :class="{ active: activeTab === 'all' }"
        @click="activeTab = 'all'"
      >
        全部
        <span class="badge">{{ messageCount.all }}</span>
      </button>
      <button 
        class="tab-btn"
        :class="{ active: activeTab === 'system' }"
        @click="activeTab = 'system'"
      >
        系统通知
        <span class="badge">{{ messageCount.system }}</span>
      </button>
      <button 
        class="tab-btn"
        :class="{ active: activeTab === 'loan' }"
        @click="activeTab = 'loan'"
      >
        贷款通知
        <span class="badge">{{ messageCount.loan }}</span>
      </button>
      <button 
        class="tab-btn"
        :class="{ active: activeTab === 'repayment' }"
        @click="activeTab = 'repayment'"
      >
        还款提醒
        <span class="badge">{{ messageCount.repayment }}</span>
      </button>
    </div>
    
    <!-- 消息列表 -->
    <div class="message-list">
      <div 
        class="message-item" 
        v-for="message in filteredMessages" 
        :key="message.id"
        :class="{ unread: !message.isRead }"
        @click="readMessage(message)"
      >
        <div class="message-icon">
          <span class="icon">{{ getMessageIcon(message.type) }}</span>
        </div>
        <div class="message-content">
          <div class="message-header">
            <h4 class="message-title">{{ message.title }}</h4>
            <span class="message-time">{{ formatTime(message.createTime) }}</span>
          </div>
          <p class="message-text">{{ message.content }}</p>
          <div class="message-footer">
            <span class="message-type">{{ getMessageTypeText(message.type) }}</span>
            <span v-if="!message.isRead" class="unread-dot"></span>
          </div>
        </div>
      </div>
      
      <div v-if="filteredMessages.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p class="empty-text">暂无消息</p>
      </div>
    </div>
    
    <!-- 消息详情弹窗 -->
    <div class="modal" v-if="showMessageDetail">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ currentMessage.title }}</h3>
          <button class="close-btn" @click="showMessageDetail = false">×</button>
        </div>
        <div class="modal-body">
          <div class="message-detail">
            <div class="detail-meta">
              <span class="detail-type">{{ getMessageTypeText(currentMessage.type) }}</span>
              <span class="detail-time">{{ formatTime(currentMessage.createTime) }}</span>
            </div>
            <div class="detail-content">
              <p>{{ currentMessage.content }}</p>
              <div v-if="currentMessage.extraInfo" class="extra-info">
                <h4>相关信息</h4>
                <div v-for="(value, key) in currentMessage.extraInfo" :key="key">
                  <strong>{{ key }}：</strong>{{ value }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Message',
  data() {
    return {
      activeTab: 'all',
      messages: [],
      showMessageDetail: false,
      currentMessage: {},
      messageCount: {
        all: 0,
        system: 0,
        loan: 0,
        repayment: 0
      }
    }
  },
  computed: {
    filteredMessages() {
      if (this.activeTab === 'all') {
        return this.messages
      }
      return this.messages.filter(msg => msg.type === this.activeTab)
    }
  },
  created() {
    this.loadMessages()
  },
  methods: {
    async loadMessages() {
      try {
        // 预留接口：获取消息列表
        console.log('调用API获取消息列表')
        
        // 模拟数据
        this.messages = [
          {
            id: 1,
            title: '借款申请已通过',
            content: '恭喜您！您的借款申请已通过审核，款项将在30分钟内到账，请注意查收。',
            type: 'loan',
            isRead: false,
            createTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            extraInfo: {
              '申请金额': '¥5000',
              '到账金额': '¥4950',
              '手续费': '¥50'
            }
          },
          {
            id: 2,
            title: '还款提醒',
            content: '您的借款将于明天到期，请及时还款，避免产生逾期费用。应还金额：¥5100',
            type: 'repayment',
            isRead: false,
            createTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            extraInfo: {
              '应还金额': '¥5100',
              '到期日期': '2024-01-20',
              '借款编号': 'LOAN202401001'
            }
          },
          {
            id: 3,
            title: '系统维护通知',
            content: '系统将于今晚23:00-01:00进行维护，期间可能影响部分功能使用，请提前做好准备。',
            type: 'system',
            isRead: true,
            createTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
          },
          {
            id: 4,
            title: '信用评分更新',
            content: '您的信用评分已更新，当前评分为：750分，信用等级：优秀。',
            type: 'system',
            isRead: true,
            createTime: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
            extraInfo: {
              '当前评分': '750分',
              '信用等级': '优秀',
              '提升建议': '保持良好的还款记录'
            }
          }
        ]
        
        this.updateMessageCount()
      } catch (error) {
        console.error('获取消息失败:', error)
      }
    },
    
    updateMessageCount() {
      this.messageCount.all = this.messages.length
      this.messageCount.system = this.messages.filter(msg => msg.type === 'system').length
      this.messageCount.loan = this.messages.filter(msg => msg.type === 'loan').length
      this.messageCount.repayment = this.messages.filter(msg => msg.type === 'repayment').length
    },
    
    getMessageIcon(type) {
      const icons = {
        system: '⚙️',
        loan: '💰',
        repayment: '💳'
      }
      return icons[type] || '📢'
    },
    
    getMessageTypeText(type) {
      const types = {
        system: '系统通知',
        loan: '贷款通知',
        repayment: '还款提醒'
      }
      return types[type] || '其他'
    },
    
    formatTime(timeString) {
      const date = new Date(timeString)
      const now = new Date()
      const diff = now - date
      
      if (diff < 1000 * 60) {
        return '刚刚'
      } else if (diff < 1000 * 60 * 60) {
        return Math.floor(diff / (1000 * 60)) + '分钟前'
      } else if (diff < 1000 * 60 * 60 * 24) {
        return Math.floor(diff / (1000 * 60 * 60)) + '小时前'
      } else if (diff < 1000 * 60 * 60 * 24 * 7) {
        return Math.floor(diff / (1000 * 60 * 60 * 24)) + '天前'
      } else {
        return date.toLocaleDateString()
      }
    },
    
    readMessage(message) {
      this.currentMessage = message
      this.showMessageDetail = true
      
      if (!message.isRead) {
        message.isRead = true
        this.updateMessageCount()
        
        // 预留接口：标记消息为已读
        console.log('标记消息为已读:', message.id)
      }
    }
  }
}
</script>

<style scoped>
.message {
  padding: 16px;
  padding-bottom: 96px;
}

.page-header {
  text-align: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #212121;
  margin-bottom: 8px;
}

.message-tabs {
  display: flex;
  background: white;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.tab-btn {
  flex: 1;
  background: none;
  border: none;
  padding: 12px 8px;
  font-size: 14px;
  color: #757575;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;
  position: relative;
}

.tab-btn.active {
  background: #1e88e5;
  color: white;
}

.badge {
  background: #ff6b35;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 4px;
  min-width: 16px;
  text-align: center;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message-item:hover {
  background: #f5f5f5;
}

.message-item.unread {
  background: #e3f2fd;
}

.message-icon {
  width: 40px;
  height: 40px;
  background: #1e88e5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-icon .icon {
  font-size: 20px;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.message-title {
  font-size: 16px;
  font-weight: 600;
  color: #212121;
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-time {
  font-size: 12px;
  color: #757575;
  margin-left: 8px;
  white-space: nowrap;
}

.message-text {
  font-size: 14px;
  color: #757575;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-type {
  font-size: 12px;
  color: #1e88e5;
  background: #e3f2fd;
  padding: 2px 8px;
  border-radius: 4px;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background: #ff6b35;
  border-radius: 50%;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  color: #757575;
}

/* 弹窗样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #212121;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #757575;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 20px;
}

.message-detail {
  max-height: 60vh;
  overflow-y: auto;
}

.detail-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
}

.detail-type {
  font-size: 12px;
  color: #1e88e5;
  background: #e3f2fd;
  padding: 2px 8px;
  border-radius: 4px;
}

.detail-time {
  font-size: 12px;
  color: #757575;
}

.detail-content {
  font-size: 14px;
  line-height: 1.6;
  color: #212121;
}

.detail-content p {
  margin: 0 0 16px 0;
}

.extra-info {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 12px;
  margin-top: 16px;
}

.extra-info h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #212121;
}

.extra-info div {
  font-size: 13px;
  color: #757575;
  margin-bottom: 4px;
}

.extra-info div:last-child {
  margin-bottom: 0;
}

@media (max-width: 480px) {
  .message {
    padding: 12px;
    padding-bottom: 92px;
  }
  
  .message-tabs {
    padding: 2px;
  }
  
  .tab-btn {
    padding: 10px 6px;
    font-size: 12px;
  }
  
  .message-item {
    padding: 12px;
  }
  
  .message-icon {
    width: 36px;
    height: 36px;
  }
  
  .message-icon .icon {
    font-size: 18px;
  }
}
</style>
import messageStore from '@/stores/messageStore'

class WebSocketService {
  constructor() {
    this.ws = null
    this.isConnected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000
    this.messageHandlers = new Map()
    this.connectionPromise = null
  }

  // 获取WebSocket票据
  async getWebSocketTicket() {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        throw new Error('No access token found')
      }

      const myHeaders = new Headers()
      myHeaders.append("Authorization", accessToken)

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      }

      const response = await fetch("http://115.190.40.44:45444/ws-ticket", requestOptions)
      const result = await response.json()
      
      if (result.code === 200 && result.success) {
        return result.ticket
      } else {
        throw new Error('Failed to get WebSocket ticket')
      }
    } catch (error) {
      console.error('获取WebSocket票据失败:', error)
      throw error
    }
  }

  // 建立WebSocket连接
  async connect() {
    if (this.isConnected && this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket已连接，无需重复连接')
      return Promise.resolve()
    }

    if (this.connectionPromise) {
      return this.connectionPromise
    }

    this.connectionPromise = this._doConnect()
    return this.connectionPromise
  }

  async _doConnect() {
    try {
      const ticket = await this.getWebSocketTicket()
      console.log('获取到的WebSocket票据:', ticket)
      const wsUrl = 'ws://115.190.40.44:45444/ws'
      // const wsUrl = 'ws://localhost:8080/ws/'

      const fullUrl = `${wsUrl}?ticket=${encodeURIComponent(ticket)}`;
      
      this.ws = new WebSocket(fullUrl)
      
      return new Promise((resolve, reject) => {
        this.ws.onopen = () => {
          console.log('WebSocket连接成功')
          this.isConnected = true
          this.reconnectAttempts = 0
          this.connectionPromise = null
          resolve()
        }

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data)
        }

        this.ws.onclose = () => {
          console.log('WebSocket连接关闭')
          this.isConnected = false
          this.connectionPromise = null
          this.attemptReconnect()
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket错误:', error)
          this.connectionPromise = null
          reject(error)
        }

        // 设置连接超时
        setTimeout(() => {
          if (!this.isConnected) {
            reject(new Error('WebSocket连接超时'))
          }
        }, 10000)
      })
    } catch (error) {
      console.error('建立WebSocket连接失败:', error)
      this.connectionPromise = null
      throw error
    }
  }

  // 处理接收到的消息
  handleMessage(data) {
    try {
      const message = JSON.parse(data)
      console.log('收到WebSocket消息:', message)
      
      // 将WebSocket消息转换为消息列表格式并添加到全局存储
      const messageForStore = {
        id: Date.now(),
        title: this.getMessageTypeText(message.type),
        content: message.msg,
        type: this.getWebSocketMessageType(message.type),
        isRead: false,
        createTime: new Date().toISOString()
      }
      
      // 添加到消息存储
      messageStore.addMessage(messageForStore)
      
      // 触发对应类型的消息处理器
      if (this.messageHandlers.has(message.type)) {
        const handlers = this.messageHandlers.get(message.type)
        handlers.forEach(handler => handler(message))
      }

      // 触发所有类型的消息处理器
      if (this.messageHandlers.has('all')) {
        const handlers = this.messageHandlers.get('all')
        handlers.forEach(handler => handler(message))
      }

      // 显示通知
      this.showNotification(message)
    } catch (error) {
      console.error('处理WebSocket消息失败:', error)
    }
  }

  // 显示通知
  showNotification(message) {
    // 使用浏览器的通知API或自定义通知组件
    if (Notification.permission === 'granted') {
      const notification = new Notification('新消息通知', {
        body: message.msg,
        icon: '/favicon.ico'
      })
      
      notification.onclick = () => {
        // 点击通知时跳转到消息页面
        window.location.hash = '#/message'
        notification.close()
      }
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.showNotification(message)
        }
      })
    }

    // 同时触发全局事件，供Vue组件监听
    window.dispatchEvent(new CustomEvent('websocket-message', {
      detail: message
    }))
  }

  // 注册消息处理器
  onMessage(type, handler) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, [])
    }
    this.messageHandlers.get(type).push(handler)
  }

  // 移除消息处理器
  offMessage(type, handler) {
    if (this.messageHandlers.has(type)) {
      const handlers = this.messageHandlers.get(type)
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  // 发送消息
  send(message) {
    if (this.isConnected && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.error('WebSocket未连接，无法发送消息')
    }
  }

  // 断开连接
  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.isConnected = false
    this.reconnectAttempts = 0
  }

  // 尝试重连
  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`尝试重连WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      
      setTimeout(() => {
        this.connect().catch(error => {
          console.error('WebSocket重连失败:', error)
        })
      }, this.reconnectDelay)
    } else {
      console.error('WebSocket重连次数已达上限')
    }
  }

  // 获取连接状态
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: this.ws ? this.ws.readyState : WebSocket.CLOSED
    }
  }
  
  // 获取消息类型文本
  getMessageTypeText(type) {
    const types = {
      0: '系统通知',
      1: '贷款通知',
      2: '还款通知'
    }
    return types[type] || '消息通知'
  }
  
  // 将WebSocket消息类型转换为本地消息类型
  getWebSocketMessageType(type) {
    const typeMap = {
      0: 'system',    // 系统通知
      1: 'loan',      // 贷款通知
      2: 'repayment'  // 还款通知
    }
    return typeMap[type] || 'system'
  }
}

// 创建全局单例实例
const websocketService = new WebSocketService()

export default websocketService
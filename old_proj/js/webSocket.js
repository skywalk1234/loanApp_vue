// websocket-service.js
class WebSocketService {
    constructor(options = {}) {
        this.options = {
            url: 'ws://localhost:8080',
            reconnect: true,
            maxReconnectAttempts: 5,
            reconnectInterval: 3000,
            heartbeatInterval: 30000,
            ...options
        };

        this.ws = null;
        this.reconnectAttempts = 0;
        this.heartbeatTimer = null;
        this.messageHandlers = new Map();
        this.isConnected = false;
    }

    // 连接WebSocket
    connect() {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(this.options.url);

                this.ws.onopen = (event) => {
                    this.onOpen(event);
                    resolve(event);
                };

                this.ws.onmessage = (event) => this.onMessage(event);
                this.ws.onclose = (event) => this.onClose(event);
                this.ws.onerror = (error) => {
                    reject(error);
                    this.onError(error);
                };

            } catch (error) {
                reject(error);
            }
        });
    }

    onOpen(event) {
        this.isConnected = true;
        this.reconnectAttempts = 0;

        // 开始心跳检测
        this.startHeartbeat();

        // 触发连接成功事件
        this.triggerEvent('connected', event);

        console.log('WebSocket连接成功');
    }

    onMessage(event) {
        try {
            const data = JSON.parse(event.data);

            // 处理心跳响应
            if (data.type === 'pong') {
                this.handlePong();
                return;
            }

            // 触发消息事件
            this.triggerEvent('message', data);

            // 特定类型消息的处理
            if (data.type && this.messageHandlers.has(data.type)) {
                this.messageHandlers.get(data.type)(data);
            }

        } catch (error) {
            console.error('消息解析错误:', error);
            this.triggerEvent('error', error);
        }
    }

    onClose(event) {
        this.isConnected = false;
        this.stopHeartbeat();

        this.triggerEvent('disconnected', event);

        // 自动重连
        if (this.options.reconnect && this.reconnectAttempts < this.options.maxReconnectAttempts) {
            setTimeout(() => {
                this.reconnectAttempts++;
                this.connect();
            }, this.options.reconnectInterval);
        }
    }

    onError(error) {
        this.triggerEvent('error', error);
    }

    // 发送消息
    send(type, data = {}) {
        if (this.isConnected && this.ws) {
            const message = JSON.stringify({ type, ...data, timestamp: Date.now() });
            this.ws.send(message);
            return true;
        }
        return false;
    }

    // 发送心跳
    startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {
            if (this.isConnected) {
                this.send('ping');
            }
        }, this.options.heartbeatInterval);
    }

    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }

    handlePong() {
        // 心跳响应处理
        this.triggerEvent('heartbeat');
    }

    // 注册消息处理器
    onMessageType(type, handler) {
        this.messageHandlers.set(type, handler);
    }

    // 事件系统
    triggerEvent(eventName, data) {
        if (this.eventHandlers && this.eventHandlers[eventName]) {
            this.eventHandlers[eventName].forEach(handler => handler(data));
        }
    }

    on(eventName, handler) {
        if (!this.eventHandlers) {
            this.eventHandlers = {};
        }
        if (!this.eventHandlers[eventName]) {
            this.eventHandlers[eventName] = [];
        }
        this.eventHandlers[eventName].push(handler);
    }

    // 断开连接
    disconnect() {
        this.options.reconnect = false;
        if (this.ws) {
            this.ws.close(1000, '正常关闭');
        }
    }
}

// 使用示例
const wsService = new WebSocketService({
    url: 'ws://localhost:8080/ws/n12pgdie1s',
    reconnect: true,
    heartbeatInterval: 25000
});


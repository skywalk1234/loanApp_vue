<template>
  <div class="home">
    <section class="topbar">
      <div class="identity">
        <div class="user-avatar">👤</div>
        <div class="user-info">
          <p class="welcome-text">欢迎回来</p>
          <h3 class="user-name">{{ userName }}</h3>
          <p class="user-phone">{{ userPhone }}</p>
        </div>
      </div>
      <button class="auth-button" @click="goToRealNameAuth" :class="{ 'authenticated': isAuthenticated }">
        <span class="auth-icon">{{ isAuthenticated ? '✓' : '!' }}</span>
        <span class="auth-text">{{ isAuthenticated ? '已实名' : '去实名' }}</span>
      </button>
    </section>

    <section class="hero-panel">
      <div class="hero-main">
        <div>
          <p class="eyebrow">可用借款额度</p>
          <div class="limit-value">¥{{ creditLimit.toLocaleString() }}</div>
          <p class="limit-desc">当前信用等级：{{ creditLevel }}</p>
        </div>
        <div class="score-badge" :class="creditClass">
          <span class="score-label">信用分</span>
          <strong>{{ creditScore }}</strong>
        </div>
      </div>

      <div class="hero-actions">
        <button class="primary-action" @click="goToLoan">立即借款</button>
        <button class="secondary-action" @click="goToRecords">查看记录</button>
      </div>

      <div class="hero-metrics">
        <div class="metric-item">
          <span class="metric-value">3分钟</span>
          <span class="metric-label">极速审核</span>
        </div>
        <div class="metric-item">
          <span class="metric-value">24期</span>
          <span class="metric-label">灵活周期</span>
        </div>
        <div class="metric-item">
          <span class="metric-value">在线</span>
          <span class="metric-label">消息提醒</span>
        </div>
      </div>
    </section>
    
    <section class="quick-actions">
      <div class="section-heading">
        <h3 class="section-title">常用服务</h3>
        <span class="section-note">一站式处理</span>
      </div>
      <div class="action-grid">
        <button class="action-item action-loan" @click="goToLoan">
          <span class="action-icon">¥</span>
          <span class="action-text">立即借款</span>
        </button>
        <button class="action-item action-repay" @click="goToRepayment">
          <span class="action-icon">↻</span>
          <span class="action-text">立即还款</span>
        </button>
        <button class="action-item action-record" @click="goToRecords">
          <span class="action-icon">▦</span>
          <span class="action-text">借款记录</span>
        </button>
        <button class="action-item action-profile" @click="goToProfile">
          <span class="action-icon">◉</span>
          <span class="action-text">个人中心</span>
        </button>
      </div>
    </section>
    
    <section class="insight-strip">
      <div class="insight-item">
        <span class="insight-icon insight-speed">⚡</span>
        <div class="insight-copy">
          <h4>极速放贷</h4>
          <p>审批状态实时同步</p>
        </div>
      </div>
      <div class="insight-item">
        <span class="insight-icon insight-risk">盾</span>
        <div class="insight-copy">
          <h4>风险管控</h4>
          <p>额度策略动态评估</p>
        </div>
      </div>
    </section>

    <section class="advantages">
      <div class="section-heading">
        <h3 class="section-title">服务优势</h3>
        <span class="section-note">更适合移动端</span>
      </div>
      <div class="advantage-list">
        <div class="advantage-item">
          <div class="advantage-icon advantage-blue">快</div>
          <div class="advantage-content">
            <h4>极速放贷</h4>
          </div>
        </div>
        <div class="advantage-item">
          <div class="advantage-icon advantage-green">稳</div>
          <div class="advantage-content">
            <h4>风险管控</h4>
          </div>
        </div>
        <div class="advantage-item">
          <div class="advantage-icon advantage-orange">简</div>
          <div class="advantage-content">
            <h4>操作便捷</h4>
          </div>
        </div>
        <div class="advantage-item">
          <div class="advantage-icon advantage-purple">活</div>
          <div class="advantage-content">
            <h4>额度灵活</h4>
          </div>
        </div>
      </div>
    </section>
    
    <section class="announcement">
      <div class="section-heading">
        <h3 class="section-title">平台公告</h3>
        <span class="section-note">最新动态</span>
      </div>
      <div class="announcement-list">
        <div class="announcement-item" v-for="item in announcements" :key="item.id">
          <span class="announcement-tag">公告</span>
          <div class="announcement-main">
            <span class="announcement-text">{{ item.title }}</span>
            <span class="announcement-date">{{ item.date }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import websocketService from '@/services/websocket'

export default {
  name: 'Home',
  data() {
    return {
      userName: '',
      userPhone: '',
      creditScore: 200,
      creditLimit: 30000,
      announcements: [
        { id: 1, title: '关于调整借款利率的公告', date: '2024-01-15' },
        { id: 2, title: '春节期间服务时间安排', date: '2024-01-10' },
        { id: 3, title: '新用户专享优惠活动', date: '2024-01-05' }
      ],
      websocketConnected: false
    }
  },
  created() {
    this.loadUserInfo()
    this.initWebSocket()
  },
  beforeDestroy() {
    // 页面销毁时移除WebSocket消息监听器
    window.removeEventListener('websocket-message', this.handleWebSocketMessage)
  },
  computed: {
    isAuthenticated() {
      return localStorage.getItem('faced') === 'true'
    },
    creditLevel() {
      if (this.creditScore >= 700) {
        return '信用优秀'
      } else if (this.creditScore >= 600) {
        return '信用良好'
      } else {
        return '信用较差'
      }
    },
    creditClass() {
      if (this.creditScore >= 700) {
        return 'credit-excellent'
      } else if (this.creditScore >= 600) {
        return 'credit-good'
      } else {
        return 'credit-poor'
      }
    }
  },
  methods: {
    loadUserInfo() {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      this.userName = user.name || '用户'
      this.userPhone = user.phone || '138****8888'
      
      // 模拟获取用户信用信息
      this.getCreditInfo()
    },
    
    async getCreditInfo() {
      try {
        // 预留接口：获取用户信用信息
        console.log('调用API获取用户信用信息')
        // const response = await this.$api.getCreditInfo()
        // this.creditScore = response.data.creditScore
        // this.creditLimit = response.data.creditLimit
      } catch (error) {
        console.error('获取信用信息失败:', error)
      }
    },

    // 初始化WebSocket连接
    async initWebSocket() {
      try {
        await websocketService.connect()
        this.websocketConnected = true
        console.log('WebSocket连接成功')
        
        // 监听WebSocket消息
        window.addEventListener('websocket-message', this.handleWebSocketMessage)
        
        // 注册消息处理器 - 现在由全局服务处理，这里只需要显示通知
        websocketService.onMessage('all', this.handleWebSocketNotification)
      } catch (error) {
        console.error('WebSocket连接失败:', error)
        this.websocketConnected = false
      }
    },

    // 处理WebSocket消息
    handleWebSocketMessage(event) {
      const message = event.detail
      // console.log('收到WebSocket消息:', message)
    },

    // 处理WebSocket通知
    handleWebSocketNotification(message) {
      // 显示消息通知
      this.showMessageNotification(message)
    },

    // 显示消息通知
    showMessageNotification(message) {
      // 获取消息类型文本
      let typeText = ''
      switch (message.type) {
        case 0:
          typeText = '系统通知'
          break
        case 1:
          typeText = '贷款通知'
          break
        case 2:
          typeText = '还款通知'
          break
        default:
          typeText = '消息通知'
      }

      // 使用浏览器的通知API或简单的alert
      if (Notification.permission === 'granted') {
        new Notification(typeText, {
          body: message.msg,
          icon: '/favicon.ico'
        })
      } else {
        // 如果通知权限未授予，使用简单的提示
        alert(`${typeText}: ${message.msg}`)
      }
    },
    
    goToLoan() {
      this.$router.push('/loan')
    },
    
    goToRepayment() {
      this.$router.push('/loan-records')
    },
    
    goToRecords() {
      this.$router.push('/loan-records')
    },
    
    goToProfile() {
      this.$router.push('/profile')
    },
    
    goToRealNameAuth() {
      if (this.isAuthenticated) {
        // 如果已经认证，提醒用户无需重复认证
        alert('您已完成实名认证，无需重复认证')
      } else {
        this.$router.push('/real-name-auth')
      }
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  padding: 16px 14px 98px;
  background:
    radial-gradient(circle at 18% 4%, rgba(50, 179, 151, 0.22), transparent 30%),
    radial-gradient(circle at 86% 10%, rgba(255, 148, 94, 0.22), transparent 28%),
    linear-gradient(180deg, #edf7f5 0%, #f7f3ec 42%, #f4f6fb 100%);
  color: #18212c;
}

.topbar,
.hero-panel,
.quick-actions,
.insight-strip,
.advantages,
.announcement {
  position: relative;
  z-index: 1;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
}

.identity {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 12px;
}

.user-info {
  min-width: 0;
  flex: 1;
}

.user-avatar {
  width: 52px;
  height: 52px;
  border-radius: 18px;
  background: linear-gradient(135deg, #132d46 0%, #1f8b7a 100%);
  box-shadow: 0 12px 26px rgba(31, 139, 122, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 25px;
  flex-shrink: 0;
}

.welcome-text {
  margin: 0 0 3px;
  color: #75808d;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.1;
}

.user-name {
  margin: 0;
  color: #17202b;
  font-size: 22px;
  font-weight: 800;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-phone {
  margin: 4px 0 0;
  color: #667280;
  font-size: 13px;
  line-height: 1.3;
}

.auth-button {
  height: 38px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px;
  background: #ffefd7;
  color: #9b4d12;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 0 10px 24px rgba(194, 111, 32, 0.18);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.auth-button.authenticated {
  background: #dff8eb;
  color: #096143;
  box-shadow: 0 10px 24px rgba(35, 151, 102, 0.18);
}

.auth-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 30px rgba(35, 80, 100, 0.18);
}

.auth-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.72);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 1;
}

.auth-text {
  font-size: 13px;
}

.hero-panel {
  overflow: hidden;
  padding: 22px;
  margin-bottom: 14px;
  border-radius: 28px;
  background:
    linear-gradient(135deg, rgba(20, 39, 68, 0.96), rgba(23, 115, 108, 0.92) 52%, rgba(255, 136, 87, 0.9));
  box-shadow: 0 20px 45px rgba(28, 88, 103, 0.28);
  color: #ffffff;
}

.hero-panel::before {
  content: "";
  position: absolute;
  top: -58px;
  right: -44px;
  width: 154px;
  height: 154px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
}

.hero-panel::after {
  content: "";
  position: absolute;
  right: 26px;
  bottom: 74px;
  width: 58px;
  height: 58px;
  border: 12px solid rgba(255, 255, 255, 0.11);
  border-radius: 50%;
}

.hero-main {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.eyebrow {
  margin: 0 0 8px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 13px;
  font-weight: 700;
}

.limit-value {
  color: #ffffff;
  font-size: 40px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0;
}

.limit-desc {
  margin: 10px 0 0;
  color: rgba(255, 255, 255, 0.75);
  font-size: 13px;
  line-height: 1.4;
}

.score-badge {
  min-width: 82px;
  padding: 10px 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.28);
  text-align: center;
  backdrop-filter: blur(12px);
}

.score-badge strong {
  display: block;
  margin-top: 4px;
  color: #ffffff;
  font-size: 25px;
  line-height: 1;
}

.score-label {
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
  font-weight: 700;
}

.hero-actions {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 22px;
}

.primary-action,
.secondary-action {
  height: 46px;
  border: 0;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.primary-action {
  background: #ffffff;
  color: #19314a;
  box-shadow: 0 12px 24px rgba(8, 31, 50, 0.18);
}

.secondary-action {
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.26);
}

.primary-action:hover,
.secondary-action:hover {
  transform: translateY(-1px);
}

.hero-metrics {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 16px;
}

.metric-item {
  min-height: 58px;
  padding: 10px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.13);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.metric-value {
  color: #ffffff;
  font-size: 15px;
  font-weight: 900;
  line-height: 1.2;
}

.metric-label {
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.68);
  font-size: 11px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.section-note {
  color: #8a5a22;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}

.section-title {
  margin: 0;
  color: #1a2430;
  font-size: 18px;
  font-weight: 900;
  line-height: 1.25;
}

.quick-actions,
.insight-strip,
.advantages,
.announcement {
  padding: 18px;
  margin-bottom: 14px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(255, 255, 255, 0.74);
  box-shadow: 0 16px 36px rgba(32, 55, 76, 0.1);
  backdrop-filter: blur(18px);
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.action-item {
  min-height: 92px;
  padding: 13px 6px;
  border: 0;
  border-radius: 22px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.action-item:hover {
  transform: translateY(-1px);
}

.action-loan {
  background: #eaf6ff;
  color: #1467a8;
}

.action-repay {
  background: #fff0e6;
  color: #b5521b;
}

.action-record {
  background: #eef8ee;
  color: #24733d;
}

.action-profile {
  background: #f3edff;
  color: #6851bb;
}

.action-icon {
  width: 38px;
  height: 38px;
  margin: 0 auto 9px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.72);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 900;
  line-height: 1;
}

.action-text {
  display: block;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.25;
}

.insight-strip {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.insight-item {
  min-height: 86px;
  padding: 14px;
  border-radius: 20px;
  background: #ffffff;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: inset 0 0 0 1px rgba(231, 235, 241, 0.9);
}

.insight-icon {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 17px;
  font-weight: 900;
  flex-shrink: 0;
}

.insight-speed {
  background: linear-gradient(135deg, #ff8a3d, #ef4056);
}

.insight-risk {
  background: linear-gradient(135deg, #2cb59c, #1976a3);
  font-size: 13px;
}

.insight-copy {
  min-width: 0;
}

.insight-copy h4 {
  margin: 0 0 4px;
  color: #1d2936;
  font-size: 14px;
  font-weight: 900;
}

.insight-copy p {
  margin: 0;
  color: #75808d;
  font-size: 12px;
  line-height: 1.35;
}

.advantage-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.advantage-item {
  min-height: 82px;
  padding: 12px 4px;
  border-radius: 20px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: inset 0 0 0 1px rgba(231, 235, 241, 0.9);
}

.advantage-icon {
  width: 34px;
  height: 34px;
  border-radius: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 900;
  line-height: 1;
}

.advantage-blue {
  background: linear-gradient(135deg, #3788ff, #20bdd2);
}

.advantage-green {
  background: linear-gradient(135deg, #20b883, #75c045);
}

.advantage-orange {
  background: linear-gradient(135deg, #ff9a35, #f05c53);
}

.advantage-purple {
  background: linear-gradient(135deg, #8b6cff, #c156bb);
}

.advantage-content h4 {
  margin: 0;
  color: #26313d;
  font-size: 12px;
  font-weight: 900;
  line-height: 1.25;
}

.announcement-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.announcement-item {
  min-height: 56px;
  padding: 12px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(231, 235, 241, 0.9);
}

.announcement-tag {
  padding: 5px 8px;
  border-radius: 999px;
  background: #fff2d9;
  color: #9a5b10;
  font-size: 12px;
  font-weight: 900;
  line-height: 1.2;
  white-space: nowrap;
}

.announcement-main {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.announcement-text {
  color: #25303d;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.announcement-date {
  color: #8a96a3;
  font-size: 12px;
  line-height: 1.2;
  white-space: nowrap;
}

@media (max-width: 480px) {
  .home {
    padding: 14px 12px 92px;
  }

  .user-avatar {
    width: 48px;
    height: 48px;
    border-radius: 16px;
  }

  .user-name {
    font-size: 20px;
  }

  .auth-button {
    height: 36px;
    padding: 0 12px;
  }

  .hero-panel {
    padding: 18px;
    border-radius: 24px;
  }

  .limit-value {
    font-size: 34px;
  }

  .hero-actions {
    grid-template-columns: 1.1fr 0.9fr;
  }

  .hero-metrics {
    gap: 7px;
  }

  .metric-item {
    padding: 9px 5px;
  }

  .quick-actions,
  .insight-strip,
  .advantages,
  .announcement {
    padding: 15px;
    border-radius: 22px;
  }

  .action-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .insight-strip {
    grid-template-columns: 1fr;
  }

  .advantage-list {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 6px;
  }

  .advantage-item {
    min-height: 74px;
    border-radius: 18px;
  }

  .advantage-icon {
    width: 30px;
    height: 30px;
    border-radius: 12px;
  }

  .advantage-content h4 {
    font-size: 11px;
  }
}
</style>

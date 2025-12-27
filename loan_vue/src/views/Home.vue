<template>
  <div class="home">
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <div class="user-header">
        <div class="user-avatar">👤</div>
        <div class="user-info">
          <h3 class="user-name">{{ userName }}</h3>
          <p class="user-phone">{{ userPhone }}</p>
        </div>
        <button class="auth-button" @click="goToRealNameAuth" :class="{ 'authenticated': isAuthenticated }">
          <span class="auth-icon">{{ isAuthenticated ? '✓' : '⚠' }}</span>
          <span class="auth-text">{{ isAuthenticated ? '已实名' : '未实名' }}</span>
        </button>
      </div>
      
      <div class="credit-info">
        <div class="credit-score-card">
          <div class="score-header">
            <span class="score-icon">⭐</span>
            <span class="score-label">信用评分</span>
          </div>
          <div class="score-value">{{ creditScore }}</div>
          <div class="score-desc">信用优秀</div>
        </div>
        <div class="credit-limit-card">
          <div class="limit-header">
            <span class="limit-icon">💰</span>
            <span class="limit-label">可借额度</span>
          </div>
          <div class="limit-value">¥{{ creditLimit.toLocaleString() }}</div>
          <div class="limit-desc">总额度</div>
        </div>
      </div>
    </div>
    
    <!-- 快捷入口 -->
    <div class="quick-actions">
      <h3 class="section-title">快捷服务</h3>
      <div class="action-grid">
        <div class="action-item" @click="goToLoan">
          <div class="action-icon loan-icon">💰</div>
          <span class="action-text">立即借款</span>
        </div>
        <div class="action-item" @click="goToRepayment">
          <div class="action-icon repayment-icon">💳</div>
          <span class="action-text">立即还款</span>
        </div>
        <div class="action-item" @click="goToRecords">
          <div class="action-icon record-icon">📋</div>
          <span class="action-text">借款记录</span>
        </div>
        <div class="action-item" @click="goToProfile">
          <div class="action-icon profile-icon">⚙️</div>
          <span class="action-text">个人中心</span>
        </div>
      </div>
    </div>
    
    <!-- 产品优势 -->
    <div class="advantages">
      <h3 class="section-title">我们的优势</h3>
      <div class="advantage-list">
        <div class="advantage-item">
          <div class="advantage-icon">⚡</div>
          <div class="advantage-content">
            <h4>极速放贷</h4>
          </div>
        </div>
        <div class="advantage-item">
          <div class="advantage-icon">🛡️</div>
          <div class="advantage-content">
            <h4>风险管控</h4>
          </div>
        </div>
        <div class="advantage-item">
          <div class="advantage-icon">📱</div>
          <div class="advantage-content">
            <h4>操作便捷</h4>
          </div>
        </div>
        <div class="advantage-item">
          <div class="advantage-icon">💎</div>
          <div class="advantage-content">
            <h4>额度灵活</h4>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 公告栏 -->
    <div class="announcement">
      <h3 class="section-title">平台公告</h3>
      <div class="announcement-list">
        <div class="announcement-item" v-for="item in announcements" :key="item.id">
          <span class="announcement-tag">公告</span>
          <span class="announcement-text">{{ item.title }}</span>
          <span class="announcement-date">{{ item.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      userName: '',
      userPhone: '',
      creditScore: 750,
      creditLimit: 50000,
      announcements: [
        { id: 1, title: '关于调整借款利率的公告', date: '2024-01-15' },
        { id: 2, title: '春节期间服务时间安排', date: '2024-01-10' },
        { id: 3, title: '新用户专享优惠活动', date: '2024-01-05' }
      ]
    }
  },
  created() {
    this.loadUserInfo()
  },
  computed: {
    isAuthenticated() {
      return localStorage.getItem('faced') === 'true'
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
  padding: 16px;
  padding-bottom: 96px;
}

.user-card {
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(30, 136, 229, 0.1);
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.auth-button {
  margin-left: auto;
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  white-space: nowrap;
  flex-shrink: 0;
}

.auth-button.authenticated {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.auth-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.auth-button.authenticated:hover {
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.auth-icon {
  font-size: 16px;
  font-weight: bold;
}

.auth-text {
  font-size: 14px;
}

.user-avatar {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 16px;
  color: #1976d2;
  border: 2px solid rgba(25, 118, 210, 0.2);
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #1a1a1a;
}

.user-phone {
  font-size: 14px;
  color: #666;
}

.credit-info {
  display: flex;
  gap: 16px;
  margin-top: 20px;
}

.credit-score-card {
  flex: 1;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 16px;
  padding: 20px;
  color: #1976d2;
  text-align: center;
  box-shadow: 0 4px 15px rgba(25, 118, 210, 0.15);
  border: 1px solid rgba(25, 118, 210, 0.1);
}

.credit-limit-card {
  flex: 1;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border-radius: 16px;
  padding: 20px;
  color: #388e3c;
  text-align: center;
  box-shadow: 0 4px 15px rgba(56, 142, 60, 0.15);
  border: 1px solid rgba(56, 142, 60, 0.1);
}

.score-header, .limit-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 12px;
}

.score-icon, .limit-icon {
  font-size: 16px;
}

.score-label, .limit-label {
  font-size: 14px;
  opacity: 0.9;
}

.score-value, .limit-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 4px;
}

.score-desc, .limit-desc {
  font-size: 12px;
  opacity: 0.8;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #212121;
}

.quick-actions {
  margin-bottom: 20px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.action-item {
  background: white;
  border-radius: 12px;
  padding: 20px 12px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-item:hover {
  transform: translateY(-2px);
}

.action-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.action-text {
  font-size: 14px;
  color: #212121;
  display: block;
}

.advantages {
  margin-bottom: 16px;
}

.advantages .section-title {
  margin-bottom: 6px;
  font-size: 14px;
}

.advantage-list {
  display: flex;
  justify-content: space-between;
  gap: 4px;
}

.advantage-item {
  background: white;
  border-radius: 6px;
  padding: 8px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex: 1;
  min-width: 0;
}

.advantage-icon {
  font-size: 28px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.advantage-content h4 {
  font-size: 12px;
  font-weight: normal;
  margin-bottom: 2px;
  color: #212121;
}

.advantage-content p {
  font-size: 12px;
  color: #757575;
  margin: 0;
  line-height: 1.4;
}

.advantage-content p {
  font-size: 14px;
  color: #757575;
  margin: 0;
}

.announcement {
  margin-bottom: 20px;
}

.announcement-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.announcement-item {
  background: white;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.announcement-tag {
  background: #1e88e5;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

.announcement-text {
  flex: 1;
  font-size: 14px;
  color: #212121;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.announcement-date {
  font-size: 12px;
  color: #757575;
  white-space: nowrap;
}

@media (max-width: 480px) {
  .home {
    padding: 12px;
    padding-bottom: 92px;
  }
  
  .action-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .user-card {
    padding: 20px;
  }
  
  .credit-info {
    flex-direction: column;
    gap: 12px;
  }
  
  .credit-score-card,
  .credit-limit-card {
    padding: 16px;
  }
  
  .score-value,
  .limit-value {
    font-size: 24px;
  }
  
  /* 田字形布局在小屏幕下的调整 */
  .advantage-list {
    gap: 8px;
  }
  
  .auth-button {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .auth-icon {
    font-size: 14px;
  }
  
  .auth-text {
    font-size: 12px;
  }
  
  .advantage-item {
    padding: 16px 12px;
  }
  
  .advantage-icon {
    font-size: 32px;
    margin-bottom: 8px;
  }
  
  .advantage-content h4 {
    font-size: 12px;
    margin-bottom: 4px;
  }
}
</style>
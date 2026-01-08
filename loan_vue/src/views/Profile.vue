<template>
  <div class="profile">
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <div class="user-header">
        <div class="user-avatar">👤</div>
        <div class="user-info">
          <h3 class="user-name">{{ userInfo.name }}</h3>
          <p class="user-phone">{{ userInfo.phone }}</p>
        </div>
      </div>
      
      <div class="credit-score-section" :class="getCreditScoreClass()">
        <div class="score-left">
          <div class="score-label">信用评分</div>
          <div class="score-circle">
            <div class="score-value">{{ userInfo.creditScore }}</div>
          </div>
        </div>
        <div class="score-right">
          <div class="credit-levels">
            <div class="level-item" :class="{ active: userInfo.creditScore >= 700 }">
              <div class="level-dot"></div>
              <span class="level-text">优秀</span>
            </div>
            <div class="level-item" :class="{ active: userInfo.creditScore >= 600 && userInfo.creditScore < 700 }">
              <div class="level-dot"></div>
              <span class="level-text">良好</span>
            </div>
            <div class="level-item" :class="{ active: userInfo.creditScore < 600 }">
              <div class="level-dot"></div>
              <span class="level-text">较差</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 功能菜单 -->
    <div class="menu-section">
      <h3 class="section-title">账户管理</h3>
      <div class="menu-list">
        <div class="menu-item" @click="goToLoanRecords">
          <div class="menu-icon">📋</div>
          <div class="menu-content">
            <span class="menu-title">借款记录</span>
            <span class="menu-desc">查看历史借款</span>
          </div>
          <div class="menu-arrow">›</div>
        </div>
        
        <div class="menu-item" @click="goToRepaymentRecords">
          <div class="menu-icon">💳</div>
          <div class="menu-content">
            <span class="menu-title">还款记录</span>
            <span class="menu-desc">查看还款历史</span>
          </div>
          <div class="menu-arrow">›</div>
        </div>
        
        <div class="menu-item" @click="goToRealNameAuth">
          <div class="menu-icon">🆔</div>
          <div class="menu-content">
            <span class="menu-title">实名认证</span>
            <span class="menu-desc" :class="{ completed: userInfo.isRealNameAuth }">
              {{ userInfo.isRealNameAuth ? '已认证' : '未认证' }}
            </span>
          </div>
          <div class="menu-arrow">›</div>
        </div>
        
        <div class="menu-item" @click="goToBankCard">
          <div class="menu-icon">🏦</div>
          <div class="menu-content">
            <span class="menu-title">绑定银行卡</span>
            <span class="menu-desc" :class="{ completed: userInfo.hasBankCard }">
              {{ userInfo.hasBankCard ? '已绑定' : '未绑定' }}
            </span>
          </div>
          <div class="menu-arrow">›</div>
        </div>
      </div>
    </div>
    
    <!-- 设置和帮助 -->
    <div class="menu-section">
      <h3 class="section-title">设置与帮助</h3>
      <div class="menu-list">
        <div class="menu-item" @click="goToSettings">
          <div class="menu-icon">⚙️</div>
          <div class="menu-content">
            <span class="menu-title">设置</span>
            <span class="menu-desc">账户设置</span>
          </div>
          <div class="menu-arrow">›</div>
        </div>
        
        <div class="menu-item" @click="goToCustomerService">
          <div class="menu-icon">🎧</div>
          <div class="menu-content">
            <span class="menu-title">客服</span>
            <span class="menu-desc">联系客服</span>
          </div>
          <div class="menu-arrow">›</div>
        </div>
        
        <div class="menu-item" @click="goToHelpCenter">
          <div class="menu-icon">❓</div>
          <div class="menu-content">
            <span class="menu-title">帮助中心</span>
            <span class="menu-desc">常见问题</span>
          </div>
          <div class="menu-arrow">›</div>
        </div>
      </div>
    </div>
    
    <!-- 退出登录 -->
    <div class="logout-section">
      <button class="btn btn-secondary btn-block logout-btn" @click="handleLogout">
        退出登录
      </button>
    </div>
  </div>
</template>

<script>
import { tokenService } from '@/services/api'
import tokenRefreshMixin from '@/mixins/tokenRefresh'

export default {
  name: 'Profile',
  mixins: [tokenRefreshMixin],
  data() {
    return {
      userInfo: {
        name: '',
        phone: '',
        creditLevel: '优秀',
        creditScore: 600,
        loanCount: 3,
        totalLoan: 15000,
        isRealNameAuth: false,
        hasBankCard: false
      }
    }
  },
  created() {
    this.loadUserInfo()
  },
  methods: {
    getCreditScoreClass() {
      if (this.userInfo.creditScore >= 700) {
        return 'credit-excellent'
      } else if (this.userInfo.creditScore >= 600) {
        return 'credit-good'
      } else {
        return 'credit-poor'
      }
    },
    
    async loadUserInfo() {
      try {
        // 预留接口：获取用户信息
        console.log('调用API获取用户信息')
        
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        this.userInfo.name = user.name || '用户'
        this.userInfo.phone = user.phone || '138****8888'
        
        // 检查实名认证状态
        this.userInfo.isRealNameAuth = localStorage.getItem('faced') === 'true'
        
        // 模拟获取用户统计信息
        // const response = await this.$api.getUserInfo()
        // this.userInfo = response.data
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    },
    
    goToLoanRecords() {
      this.$router.push('/loan-records')
    },
    
    goToRepaymentRecords() {
      this.$router.push('/repayment-records')
    },
    
    goToRealNameAuth() {
      // 检查是否已经完成实名认证
      if (localStorage.getItem('faced') === 'true') {
        alert('您已完成实名认证，无需重复认证')
        return
      }
      
      // 跳转到实名认证页面
      this.$router.push('/real-name-auth')
    },
    
    goToBankCard() {
      // 检查是否已经完成实名认证
      if (localStorage.getItem('faced') !== 'true') {
        alert('请先完成实名认证后再绑定银行卡')
        return
      }
      
      // 跳转到绑定银行卡页面
      this.$router.push('/bank-card')
    },
    
    goToSettings() {
      // 预留接口：设置页面
      alert('设置功能开发中...')
    },
    
    goToCustomerService() {
      // 预留接口：客服
      alert('客服功能开发中...')
    },
    
    goToHelpCenter() {
      // 预留接口：帮助中心
      alert('帮助中心功能开发中...')
    },
    
    handleLogout() {
      if (confirm('确定要退出登录吗？')) {
        // 清除本地存储
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        
        // 跳转到登录页
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style scoped>
.profile {
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
  margin-bottom: 24px;
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
  margin-bottom: 4px;
}

.credit-score-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 20px;
  padding: 24px;
  border-radius: 16px;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border: 1px solid rgba(76, 175, 80, 0.2);
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.15);
}

.score-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.score-circle {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.25);
  border: 4px solid #4caf50;
}

.score-value {
  font-size: 32px;
  font-weight: bold;
  color: #2e7d32;
  margin-bottom: 4px;
}

.score-label {
  font-size: 18px;
  color: #2e7d32;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
}

.score-right {
  display: flex;
  align-items: flex-start;
  padding-top: 8px;
}

.credit-levels {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.level-item {
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0.4;
  transition: all 0.3s ease;
}

.level-item.active {
  opacity: 1;
}

.level-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #4caf50;
  transition: all 0.3s ease;
}

.level-item.active .level-dot {
  width: 16px;
  height: 16px;
  background: #2e7d32;
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.3);
}

.level-text {
  font-size: 16px;
  font-weight: 500;
  color: #388e3c;
  transition: all 0.3s ease;
}

.level-item.active .level-text {
  font-weight: 600;
  color: #2e7d32;
  font-size: 18px;
}

.stat-card {
  flex: 1;
  border-radius: 16px;
  padding: 12px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.stat-score {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #1976d2;
}

.stat-loan {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  color: #7b1fa2;
}

.stat-total {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: #388e3c;
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-bottom: 6px;
}

.stat-icon {
  font-size: 12px;
}

.stat-label {
  font-size: 11px;
  opacity: 0.8;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 2px;
}

.stat-value.large {
  font-size: 24px;
  font-weight: 700;
}

.stat-desc {
  font-size: 10px;
  opacity: 0.7;
}

.menu-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #212121;
  margin-bottom: 12px;
  padding-left: 4px;
}

.menu-list {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-bottom: 1px solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: #f5f5f5;
}

.menu-icon {
  font-size: 24px;
  margin-right: 16px;
  width: 24px;
  text-align: center;
}

.menu-content {
  flex: 1;
}

.menu-title {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #212121;
  margin-bottom: 2px;
}

.menu-desc {
  font-size: 12px;
  color: #757575;
}

.menu-desc.completed {
  color: #4caf50;
}

.menu-arrow {
  font-size: 20px;
  color: #bdbdbd;
  margin-left: 8px;
}

.logout-section {
  padding: 20px 0;
}

.logout-btn {
  background: #ffebee;
  color: #f44336;
  border: 1px solid #ffcdd2;
}

.logout-btn:hover {
  background: #ffcdd2;
}

@media (max-width: 480px) {
  .profile {
    padding: 12px;
    padding-bottom: 92px;
  }
  
  .user-card {
    padding: 20px;
  }
  
  .credit-score-section {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    padding: 20px;
  }
  
  .score-circle {
    width: 70px;
    height: 70px;
  }
  
  .score-value {
    font-size: 24px;
  }
  
  .score-label {
    font-size: 14px;
    margin-bottom: 6px;
  }
  
  .credit-levels {
    gap: 12px;
  }
  
  .level-text {
    font-size: 14px;
  }
  
  .level-dot {
    width: 10px;
    height: 10px;
  }
  
  .level-item.active .level-dot {
    width: 14px;
    height: 14px;
  }
  
  .menu-item {
    padding: 12px;
  }
  
  .menu-icon {
    font-size: 20px;
    margin-right: 12px;
  }
}

/* 超小屏幕适配 */
@media (max-width: 360px) {
  .credit-score-section {
    gap: 12px;
    padding: 16px;
  }
  
  .score-circle {
    width: 65px;
    height: 65px;
  }
  
  .score-value {
    font-size: 22px;
  }
  
  .score-label {
    font-size: 15px;
    margin-bottom: 4px;
  }
  
  .credit-levels {
    gap: 10px;
  }
  
  .level-text {
    font-size: 13px;
  }
  
  .level-dot {
    width: 8px;
    height: 8px;
  }
  
  .level-item.active .level-dot {
    width: 12px;
    height: 12px;
  }
}

/* 信用评分颜色主题 */

/* 优秀 (绿色主题) */
.credit-excellent {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border: 1px solid rgba(76, 175, 80, 0.2);
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.15);
}

.credit-excellent .score-circle {
  background: linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%);
  border: 4px solid #4caf50;
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.25);
}

.credit-excellent .score-value {
  color: #2e7d32;
}

.credit-excellent .score-label {
  color: #2e7d32;
}

.credit-excellent .level-dot {
  background: #4caf50;
}

.credit-excellent .level-item.active .level-dot {
  background: #2e7d32;
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.3);
}

.credit-excellent .level-text {
  color: #388e3c;
}

.credit-excellent .level-item.active .level-text {
  color: #2e7d32;
}

/* 良好 (黄色主题) */
.credit-good {
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
  border: 1px solid rgba(255, 193, 7, 0.2);
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.15);
}

.credit-good .score-circle {
  background: linear-gradient(135deg, #ffffff 0%, #fffde7 100%);
  border: 4px solid #ffc107;
  box-shadow: 0 8px 25px rgba(255, 193, 7, 0.25);
}

.credit-good .score-value {
  color: #f57c00;
}

.credit-good .score-label {
  color: #f57c00;
}

.credit-good .level-dot {
  background: #ffc107;
}

.credit-good .level-item.active .level-dot {
  background: #f57c00;
  box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.3);
}

.credit-good .level-text {
  color: #f57c00;
}

.credit-good .level-item.active .level-text {
  color: #f57c00;
}

/* 较差 (红色主题) */
.credit-poor {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  border: 1px solid rgba(244, 67, 54, 0.2);
  box-shadow: 0 4px 15px rgba(244, 67, 54, 0.15);
}

.credit-poor .score-circle {
  background: linear-gradient(135deg, #ffffff 0%, #ffebee 100%);
  border: 4px solid #f44336;
  box-shadow: 0 8px 25px rgba(244, 67, 54, 0.25);
}

.credit-poor .score-value {
  color: #d32f2f;
}

.credit-poor .score-label {
  color: #d32f2f;
}

.credit-poor .level-dot {
  background: #f44336;
}

.credit-poor .level-item.active .level-dot {
  background: #d32f2f;
  box-shadow: 0 0 0 4px rgba(244, 67, 54, 0.3);
}

.credit-poor .level-text {
  color: #d32f2f;
}

.credit-poor .level-item.active .level-text {
  color: #d32f2f;
}
</style>
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
      
      <div class="credit-score-section">
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
        creditScore: 750,
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
  min-height: 100vh;
  padding: 16px 14px 98px;
  background:
    radial-gradient(circle at 18% 4%, rgba(50, 179, 151, 0.2), transparent 30%),
    radial-gradient(circle at 86% 8%, rgba(255, 148, 94, 0.2), transparent 28%),
    linear-gradient(180deg, #eef8f6 0%, #f8f3ec 42%, #f5f7fb 100%);
  color: #18212c;
}

.user-card {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #142744, #17736c 56%, #ff8857);
  border-radius: 28px;
  padding: 22px;
  margin-bottom: 14px;
  box-shadow: 0 18px 42px rgba(28, 88, 103, 0.24);
  color: #fff;
}

.user-card::after {
  content: "";
  position: absolute;
  right: -34px;
  top: -44px;
  width: 132px;
  height: 132px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
}

.user-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  margin-bottom: 18px;
}

.user-avatar {
  width: 54px;
  height: 54px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 14px;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.user-name {
  font-size: 22px;
  font-weight: 900;
  margin-bottom: 4px;
  color: #fff;
}

.user-phone {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.72);
  margin-bottom: 4px;
}

.credit-score-section {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 18px;
  padding: 16px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.26);
  backdrop-filter: blur(12px);
}

.score-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.score-circle {
  width: 100px;
  height: 100px;
  border-radius: 28px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 14px 28px rgba(8, 31, 50, 0.18);
}

.score-value {
  font-size: 32px;
  font-weight: 900;
  color: #17736c;
  margin-bottom: 4px;
}

.score-label {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.82);
  font-weight: 900;
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
  background: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.level-item.active .level-dot {
  width: 16px;
  height: 16px;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.22);
}

.level-text {
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.62);
  transition: all 0.3s ease;
}

.level-item.active .level-text {
  font-weight: 900;
  color: #fff;
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
  margin-bottom: 14px;
  padding: 18px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(255, 255, 255, 0.74);
  box-shadow: 0 16px 36px rgba(32, 55, 76, 0.1);
  backdrop-filter: blur(18px);
}

.section-title {
  font-size: 18px;
  font-weight: 900;
  color: #1a2430;
  margin: 0 0 14px;
  padding-left: 0;
}

.menu-list {
  background: transparent;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 14px;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  border-radius: 18px;
  background: #fff;
  box-shadow: inset 0 0 0 1px rgba(231, 235, 241, 0.9);
}

.menu-item:hover {
  transform: translateY(-1px);
  box-shadow: inset 0 0 0 1px rgba(50, 179, 151, 0.25), 0 12px 24px rgba(32, 55, 76, 0.08);
}

.menu-icon {
  width: 42px;
  height: 42px;
  margin-right: 12px;
  border-radius: 15px;
  background: linear-gradient(135deg, #eaf6ff, #fff2e6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 21px;
}

.menu-content {
  flex: 1;
}

.menu-title {
  display: block;
  font-size: 16px;
  font-weight: 900;
  color: #25303d;
  margin-bottom: 2px;
}

.menu-desc {
  font-size: 12px;
  color: #7b8794;
  font-weight: 700;
}

.menu-desc.completed {
  color: #17736c;
}

.menu-arrow {
  font-size: 20px;
  color: #b7c0cb;
  margin-left: 8px;
}

.logout-section {
  padding: 8px 0 20px;
}

.logout-btn {
  height: 46px;
  border: 0;
  border-radius: 18px;
  background: #fff0e6;
  color: #b5521b;
  font-weight: 900;
  box-shadow: 0 12px 24px rgba(181, 82, 27, 0.12);
}

.logout-btn:hover {
  background: #ffe5d2;
}

@media (max-width: 480px) {
  .profile {
    padding: 14px 12px 92px;
  }
  
  .user-card {
    padding: 18px;
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
</style>

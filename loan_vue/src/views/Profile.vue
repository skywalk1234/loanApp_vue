<template>
  <div class="profile">
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <div class="user-header">
        <div class="user-avatar">👤</div>
        <div class="user-info">
          <h3 class="user-name">{{ userInfo.name }}</h3>
          <p class="user-phone">{{ userInfo.phone }}</p>
          <p class="user-level">信用等级：{{ userInfo.creditLevel }}</p>
        </div>
      </div>
      
      <div class="user-stats">
        <div class="stat-item">
          <span class="stat-value">{{ userInfo.loanCount }}</span>
          <span class="stat-label">借款次数</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">¥{{ userInfo.totalLoan }}</span>
          <span class="stat-label">累计借款</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ userInfo.creditScore }}</span>
          <span class="stat-label">信用评分</span>
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
export default {
  name: 'Profile',
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
      // 预留接口：实名认证
      alert('实名认证功能开发中...')
    },
    
    goToBankCard() {
      // 预留接口：绑定银行卡
      alert('绑定银行卡功能开发中...')
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
  background: linear-gradient(135deg, #1e88e5 0%, #42a5f5 100%);
  border-radius: 16px;
  padding: 24px;
  color: white;
  margin-bottom: 20px;
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.user-avatar {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 16px;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
}

.user-phone {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 4px;
}

.user-level {
  font-size: 12px;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 12px;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
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
  
  .user-stats {
    flex-direction: column;
    gap: 16px;
  }
  
  .menu-item {
    padding: 12px;
  }
  
  .menu-icon {
    font-size: 20px;
    margin-right: 12px;
  }
}
</style>
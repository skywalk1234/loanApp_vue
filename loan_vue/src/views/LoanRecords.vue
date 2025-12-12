<template>
  <div class="loan-records">
    <div class="page-header">
      <button class="btn-back" @click="goBack">‹</button>
      <h1 class="page-title">借款记录</h1>
    </div>
    
    <!-- 筛选标签 -->
    <div class="filter-tabs">
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'all' }"
        @click="changeTab('all')"
      >
        全部
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'repaying' }"
        @click="changeTab('repaying')"
      >
        还款中
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'completed' }"
        @click="changeTab('completed')"
      >
        已结清
      </div>
    </div>
    
    <!-- 记录列表 -->
    <div class="records-list">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="filteredRecords.length === 0" class="empty">
        <div class="empty-icon">📋</div>
        <p class="empty-text">暂无借款记录</p>
      </div>
      <div 
        v-else 
        v-for="record in filteredRecords" 
        :key="record.id"
        class="record-item"
        @click="goToRepayment(record)"
      >
        <div class="record-header">
          <div class="loan-amount">
            <span class="amount-label">借款金额</span>
            <span class="amount-value">¥{{ record.amount }}</span>
          </div>
          <div class="status" :class="getStatusClass(record.status)">
            {{ getStatusText(record.status) }}
          </div>
        </div>
        
        <div class="record-info">
          <div class="info-item">
            <span class="info-label">借款日期</span>
            <span class="info-value">{{ formatDate(record.loanDate) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">到期日期</span>
            <span class="info-value">{{ formatDate(record.dueDate) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">剩余应还</span>
            <span class="info-value">¥{{ record.remainingAmount }}</span>
          </div>
        </div>
        
        <div class="record-progress" v-if="record.status === 'repaying'">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: record.progress + '%' }"
            ></div>
          </div>
          <span class="progress-text">{{ record.progress }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tokenService } from '@/services/api'
import tokenRefreshMixin from '@/mixins/tokenRefresh'

export default {
  name: 'LoanRecords',
  mixins: [tokenRefreshMixin],
  data() {
    return {
      activeTab: 'all',
      loading: false,
      records: []
    }
  },
  computed: {
    filteredRecords() {
      if (this.activeTab === 'all') {
        return this.records
      }
      return this.records.filter(record => {
        if (this.activeTab === 'repaying') {
          return record.status === 'repaying'
        }
        if (this.activeTab === 'completed') {
          return record.status === 'completed'
        }
        return true
      })
    }
  },
  created() {
    this.loadLoanRecords()
  },
  methods: {
    async loadLoanRecords() {
      this.loading = true
      try {
        // 预留接口：获取借款记录
        console.log('调用API获取借款记录')
        
        // 模拟数据
        setTimeout(() => {
          this.records = [
            {
              id: 1,
              amount: 5000,
              loanDate: '2024-01-15',
              dueDate: '2024-02-15',
              remainingAmount: 2500,
              status: 'repaying',
              progress: 50,
              productName: '极速贷',
              term: 30,
              interestRate: 0.05
            },
            {
              id: 2,
              amount: 3000,
              loanDate: '2023-12-10',
              dueDate: '2024-01-10',
              remainingAmount: 0,
              status: 'completed',
              progress: 100,
              productName: '信用贷',
              term: 30,
              interestRate: 0.04
            },
            {
              id: 3,
              amount: 8000,
              loanDate: '2024-01-20',
              dueDate: '2024-02-20',
              remainingAmount: 6000,
              status: 'repaying',
              progress: 25,
              productName: '大额贷',
              term: 30,
              interestRate: 0.06
            }
          ]
          this.loading = false
        }, 1000)
        
        // const response = await this.$api.getLoanRecords()
        // this.records = response.data
      } catch (error) {
        console.error('获取借款记录失败:', error)
        this.loading = false
      }
    },
    
    changeTab(tab) {
      this.activeTab = tab
    },
    
    getStatusClass(status) {
      const statusMap = {
        'repaying': 'status-repaying',
        'completed': 'status-completed',
        'overdue': 'status-overdue'
      }
      return statusMap[status] || 'status-repaying'
    },
    
    getStatusText(status) {
      const statusMap = {
        'repaying': '还款中',
        'completed': '已结清',
        'overdue': '已逾期'
      }
      return statusMap[status] || '还款中'
    },
    
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return `${date.getMonth() + 1}月${date.getDate()}日`
    },
    
    goToRepayment(record) {
      this.$router.push({
        path: '/repayment',
        query: { 
          loanId: record.id,
          amount: record.amount,
          remainingAmount: record.remainingAmount,
          dueDate: record.dueDate,
          status: record.status
        }
      })
    },
    
    goBack() {
      this.$router.push('/profile')
    }
  }
}
</script>

<style scoped>
.loan-records {
  min-height: 100vh;
  background: #f5f5f5;
}

.page-header {
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.btn-back {
  font-size: 24px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  margin-right: 16px;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #212121;
  margin: 0;
}

.filter-tabs {
  display: flex;
  background: white;
  padding: 16px;
  gap: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.tab-item.active {
  background: #1e88e5;
  color: white;
  border-color: #1e88e5;
}

.records-list {
  padding: 16px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 14px;
}

.empty {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  color: #999;
  font-size: 14px;
}

.record-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.record-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.loan-amount {
  display: flex;
  flex-direction: column;
}

.amount-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 2px;
}

.amount-value {
  font-size: 18px;
  font-weight: bold;
  color: #212121;
}

.status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-repaying {
  background: #e3f2fd;
  color: #1976d2;
}

.status-completed {
  background: #e8f5e8;
  color: #388e3c;
}

.status-overdue {
  background: #ffebee;
  color: #d32f2f;
}

.record-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-item {
  display: flex;
  flex-direction: column;
  text-align: center;
}

.info-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 2px;
}

.info-value {
  font-size: 14px;
  color: #212121;
  font-weight: 500;
}

.record-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1e88e5, #42a5f5);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

@media (max-width: 480px) {
  .loan-records {
    padding-bottom: 92px;
  }
  
  .page-header {
    padding: 12px;
  }
  
  .filter-tabs {
    padding: 12px;
    gap: 12px;
  }
  
  .tab-item {
    padding: 10px;
    font-size: 13px;
  }
  
  .records-list {
    padding: 12px;
  }
  
  .record-item {
    padding: 12px;
    margin-bottom: 8px;
  }
  
  .record-info {
    flex-direction: column;
    gap: 8px;
  }
  
  .info-item {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}
</style>
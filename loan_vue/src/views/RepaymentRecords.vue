<template>
  <div class="repayment-records">
    <div class="page-header">
      <button class="btn-back" @click="goBack">‹</button>
      <h1 class="page-title">还款记录</h1>
    </div>
    
    <!-- 统计信息 -->
    <div class="stats-card">
      <div class="stat-item">
        <div class="stat-label">总还款金额</div>
        <div class="stat-value">¥{{ totalRepayment }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">还款次数</div>
        <div class="stat-value">{{ repaymentCount }}</div>
      </div>
    </div>
    
    <!-- 记录列表 -->
    <div class="records-list">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="records.length === 0" class="empty">
        <div class="empty-icon">💳</div>
        <p class="empty-text">暂无还款记录</p>
      </div>
      <div 
        v-else 
        v-for="record in records" 
        :key="record.id"
        class="record-item"
      >
        <div class="record-header">
          <div class="repayment-amount">
            <span class="amount-label">还款金额</span>
            <span class="amount-value">¥{{ record.amount }}</span>
          </div>
          <div class="status" :class="getStatusClass(record.status)">
            {{ getStatusText(record.status) }}
          </div>
        </div>
        
        <div class="record-info">
          <div class="info-item">
            <span class="info-label">还款日期</span>
            <span class="info-value">{{ formatDate(record.repaymentDate) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">借款编号</span>
            <span class="info-value">{{ record.loanId }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">还款方式</span>
            <span class="info-value">{{ getRepaymentMethodText(record.method) }}</span>
          </div>
        </div>
        
        <div class="record-details" v-if="record.details">
          <div class="detail-item">
            <span class="detail-label">本金</span>
            <span class="detail-value">¥{{ record.details.principal }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">利息</span>
            <span class="detail-value">¥{{ record.details.interest }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">服务费</span>
            <span class="detail-value">¥{{ record.details.serviceFee }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RepaymentRecords',
  data() {
    return {
      loading: false,
      records: [],
      totalRepayment: 0,
      repaymentCount: 0
    }
  },
  created() {
    this.loadRepaymentRecords()
  },
  methods: {
    async loadRepaymentRecords() {
      this.loading = true
      try {
        // 预留接口：获取还款记录
        console.log('调用API获取还款记录')
        
        // 模拟数据
        setTimeout(() => {
          this.records = [
            {
              id: 1,
              amount: 1250,
              repaymentDate: '2024-01-20',
              loanId: 'L20240115001',
              status: 'success',
              method: 'auto',
              details: {
                principal: 1000,
                interest: 200,
                serviceFee: 50
              }
            },
            {
              id: 2,
              amount: 1250,
              repaymentDate: '2024-01-15',
              loanId: 'L20240110002',
              status: 'success',
              method: 'manual',
              details: {
                principal: 1000,
                interest: 200,
                serviceFee: 50
              }
            },
            {
              id: 3,
              amount: 2500,
              repaymentDate: '2024-01-10',
              loanId: 'L20240110002',
              status: 'success',
              method: 'early',
              details: {
                principal: 2000,
                interest: 400,
                serviceFee: 100
              }
            }
          ]
          
          // 计算统计信息
          this.totalRepayment = this.records.reduce((sum, record) => sum + record.amount, 0)
          this.repaymentCount = this.records.length
          this.loading = false
        }, 1000)
        
        // const response = await this.$api.getRepaymentRecords()
        // this.records = response.data
        // this.totalRepayment = response.totalRepayment
        // this.repaymentCount = response.repaymentCount
      } catch (error) {
        console.error('获取还款记录失败:', error)
        this.loading = false
      }
    },
    
    getStatusClass(status) {
      const statusMap = {
        'success': 'status-success',
        'processing': 'status-processing',
        'failed': 'status-failed'
      }
      return statusMap[status] || 'status-success'
    },
    
    getStatusText(status) {
      const statusMap = {
        'success': '还款成功',
        'processing': '处理中',
        'failed': '还款失败'
      }
      return statusMap[status] || '还款成功'
    },
    
    getRepaymentMethodText(method) {
      const methodMap = {
        'auto': '自动扣款',
        'manual': '主动还款',
        'early': '提前还款'
      }
      return methodMap[method] || '其他'
    },
    
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    },
    
    goBack() {
      this.$router.push('/profile')
    }
  }
}
</script>

<style scoped>
.repayment-records {
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

.stats-card {
  display: flex;
  background: white;
  padding: 20px;
  margin: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-item:first-child {
  border-right: 1px solid #e0e0e0;
}

.stat-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
  display: block;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #1e88e5;
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

.repayment-amount {
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

.status-success {
  background: #e8f5e8;
  color: #388e3c;
}

.status-processing {
  background: #fff3e0;
  color: #f57c00;
}

.status-failed {
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

.record-details {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 8px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  text-align: center;
  flex: 1;
}

.detail-label {
  font-size: 11px;
  color: #999;
  margin-bottom: 2px;
}

.detail-value {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

@media (max-width: 480px) {
  .repayment-records {
    padding-bottom: 92px;
  }
  
  .page-header {
    padding: 12px;
  }
  
  .stats-card {
    margin: 12px;
    padding: 16px;
  }
  
  .stat-value {
    font-size: 18px;
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
  
  .record-details {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
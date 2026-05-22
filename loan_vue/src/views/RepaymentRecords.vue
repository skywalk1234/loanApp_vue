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
          <div class="info-item" v-if="record.refundAmount && parseFloat(record.refundAmount) > 0">
            <span class="info-label">退还金额</span>
            <span class="info-value refund-amount">¥{{ record.refundAmount }}</span>
          </div>
        </div>
        
        <div class="record-refund" v-if="record.refundAmount && parseFloat(record.refundAmount) > 0">
          <span class="refund-label">系统退还</span>
          <span class="refund-value">¥{{ record.refundAmount }}</span>
        </div>
        
        <div class="record-actions">
          <button class="btn-view-details" @click="viewRepaymentDetails(record.loanId)">
            查看对应借款
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { API_BASE_URL } from '@/config'
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
        // 从localStorage获取accessToken
        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken) {
          throw new Error('未找到访问令牌')
        }
        
        // 设置请求头
        const myHeaders = new Headers()
        myHeaders.append('Authorization', accessToken)
        myHeaders.append('Content-Type', 'application/json')
        
        const requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        }
        
        // 调用API获取还款记录
        const response = await fetch(`${API_BASE_URL}/loan/getRepayment`, requestOptions)
        const result = await response.text()
        
        const jsonString = result;
        const fixedJsonString = jsonString.replace(
          /"loan_id":\s*(\d{15,})/g,  // 匹配15位以上的数字id
          '"loan_id":"$1"'  // 添加双引号使其变为字符串
        )
        const data = JSON.parse(fixedJsonString)

        if (data.errCode === 200 && data.success) {
          // 处理还款记录数据
          this.processRepaymentRecords(data.repayments || [])
        } else {
          console.error('获取还款记录失败:', data.message)
          this.useMockData()
        }
      } catch (error) {
        console.error('获取还款记录失败:', error)
        this.useMockData()
      } finally {
        this.loading = false
      }
    },
    
    processRepaymentRecords(repayments) {
      if (!repayments || repayments.length === 0) {
        this.records = []
        this.totalRepayment = 0
        this.repaymentCount = 0
        return
      }
      
      // 转换API数据格式到组件格式
      this.records = repayments.map(repayment => ({
        id: repayment.id,
        amount: Number(repayment.total_amount).toFixed(2),
        repaymentDate: repayment.repay_at,
        loanId: String(repayment.loan_id),
        status: repayment.status,
        refundAmount: Number(repayment.refund_amount || 0).toFixed(2),
        extra: repayment.extra
      }))
      
      // 计算统计信息
      this.totalRepayment = this.records.reduce((sum, record) => sum + parseFloat(record.amount), 0).toFixed(2)
      this.repaymentCount = this.records.length
    },
    
    useMockData() {
      // 模拟数据作为后备
      this.records = [
        {
          id: 1,
          amount: '1250.00',
          repaymentDate: '2024-01-20T10:30:00Z',
          loanId: '786915251432996852',
          status: 'SUCCESS',
          refundAmount: '0.00'
        },
        {
          id: 2,
          amount: '1250.00',
          repaymentDate: '2024-01-15T14:20:00Z',
          loanId: '786915251432996852',
          status: 'PROCESSING',
          refundAmount: '0.00'
        }
      ]
      
      this.totalRepayment = '2500.00'
      this.repaymentCount = 2
    },
    
    getStatusClass(status) {
      const statusMap = {
        'SUCCESS': 'status-success',
        'PROCESSING': 'status-processing',
        'FAILED': 'status-failed'
      }
      return statusMap[status] || 'status-success'
    },
    
    getStatusText(status) {
      const statusMap = {
        'SUCCESS': '还款成功',
        'PROCESSING': '处理中',
        'FAILED': '还款失败'
      }
      return statusMap[status] || '还款成功'
    },
    
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },
    
    goBack() {
      this.$router.push('/profile')
    },
    
    viewRepaymentDetails(loanId) {
      // 跳转到借款记录页面，传递借款编号作为参数，用于置顶显示对应记录
      this.$router.push({
        path: '/loan-records',
        query: { highlightLoanId: loanId }
      })
    }
  }
}
</script>

<style scoped>
.repayment-records {
  min-height: 100vh;
  padding-bottom: 96px;
  background:
    radial-gradient(circle at 18% 4%, rgba(50, 179, 151, 0.18), transparent 30%),
    radial-gradient(circle at 86% 8%, rgba(255, 148, 94, 0.18), transparent 28%),
    linear-gradient(180deg, #eef8f6 0%, #f8f3ec 42%, #f5f7fb 100%);
  color: #18212c;
}

.page-header {
  display: flex;
  align-items: center;
  padding: 16px 14px;
  background: rgba(255, 255, 255, 0.72);
  border-bottom: 1px solid rgba(255, 255, 255, 0.72);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(18px);
}

.btn-back {
  font-size: 24px;
  background: #fff;
  border: none;
  color: #17736c;
  cursor: pointer;
  margin-right: 16px;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: 0 8px 18px rgba(32, 55, 76, 0.08);
}

.page-title {
  font-size: 18px;
  font-weight: 900;
  color: #1b2734;
  margin: 0;
}

.stats-card {
  display: flex;
  background: linear-gradient(135deg, #142744, #17736c 56%, #ff8857);
  color: #fff;
  padding: 22px 18px;
  margin: 14px;
  border-radius: 28px;
  box-shadow: 0 18px 42px rgba(28, 88, 103, 0.24);
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-item:first-child {
  border-right: 1px solid rgba(255, 255, 255, 0.22);
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 800;
  margin-bottom: 8px;
  display: block;
}

.stat-value {
  font-size: 20px;
  font-weight: 900;
  color: #fff;
}

.records-list {
  padding: 0 14px 14px;
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
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 16px 36px rgba(32, 55, 76, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(18px);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.record-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 20px 44px rgba(32, 55, 76, 0.14);
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
  color: #8a96a3;
  margin-bottom: 2px;
}

.amount-value {
  font-size: 18px;
  font-weight: 900;
  color: #1b2734;
}

.status {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
}

.status-success {
  background: #e9f7f3;
  color: #17736c;
}

.status-processing {
  background: #fff2d9;
  color: #9a5b10;
}

.status-failed {
  background: #fff0e6;
  color: #b5521b;
}

.record-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 10px;
  gap: 8px;
  border-radius: 18px;
  background: #f8fafb;
}

.info-item {
  display: flex;
  flex-direction: column;
  text-align: center;
}

.info-label {
  font-size: 12px;
  color: #8a96a3;
  margin-bottom: 2px;
}

.info-value {
  font-size: 14px;
  color: #25303d;
  font-weight: 900;
}

.refund-amount {
  color: #ff4d4f;
  font-weight: 600;
}

.record-refund {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #fff4e8;
  border-radius: 16px;
  margin-top: 8px;
  border-left: 3px solid #ff8857;
}

.refund-label {
  font-size: 13px;
  color: #666;
}

.refund-value {
  font-size: 14px;
  color: #ff4d4f;
  font-weight: 600;
}

.record-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eef1f5;
}

.btn-view-details {
  background: linear-gradient(135deg, #142744, #17736c 58%, #ff8857);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(23, 115, 108, 0.16);
}

.btn-view-details:hover {
  box-shadow: 0 14px 26px rgba(23, 115, 108, 0.2);
  transform: translateY(-1px);
}

.btn-view-details:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(30, 136, 229, 0.3);
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
    padding: 18px 14px;
  }
  
  .stat-value {
    font-size: 18px;
  }
  
  .records-list {
    padding: 0 12px 12px;
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

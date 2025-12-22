<template>
  <div class="repayment">
    <div class="page-header">
      <button class="btn-back" @click="goBack">‹</button>
      <h1 class="page-title">还款详情</h1>
    </div>
    
    <!-- 借款信息 -->
    <div class="loan-info-card">
      <h3 class="card-title">借款信息</h3>
      <div class="loan-info-rows">
        <!-- 第一行：借款金额和剩余应还 -->
        <div class="info-row">
          <div class="info-pair">
            <span class="info-label">借款金额</span>
            <span class="info-value">¥{{ formatCurrency(loanInfo.amount) }}</span>
          </div>
          <div class="info-pair">
            <span class="info-label">剩余应还</span>
            <span class="info-value remaining-amount">¥{{ formatCurrency(loanInfo.remainingAmount) }}</span>
          </div>
        </div>
        <!-- 第二行：到期日期和借款状态 -->
        <div class="info-row">
          <div class="info-pair">
            <span class="info-label">到期日期</span>
            <span class="info-value">{{ loanInfo.dueDate }}</span>
          </div>
          <div class="info-pair">
            <span class="info-label">借款状态</span>
            <span class="info-value loan-status">{{ getStatusText(loanInfo.status) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 提前还款 -->
    <div class="early-repayment-card">
      <h3 class="card-title">提前还款</h3>
      <div class="early-repayment-form">
        <div class="form-group">
          <label class="form-label">还款金额</label>
          <input 
            type="number" 
            class="form-input" 
            v-model="earlyRepayment.amount"
            placeholder="请输入还款金额"
          >
        </div>
        <div class="form-group">
          <label class="form-label">还款方式</label>
          <div class="repayment-type-buttons">
            <button 
              type="button"
              class="type-btn"
              :class="{ active: earlyRepayment.type === 'reducePeriods' }"
              @click="earlyRepayment.type = 'reducePeriods'"
            >
              减少期数
            </button>
            <button 
              type="button"
              class="type-btn"
              :class="{ active: earlyRepayment.type === 'reduceMonthly' }"
              @click="earlyRepayment.type = 'reduceMonthly'"
            >
              减少月供
            </button>
          </div>
        </div>

        <button 
          class="btn btn-primary btn-block" 
          @click="handleEarlyRepayment"
          :disabled="!earlyRepayment.amount || earlyRepayment.amount <= 0"
        >
          确认提前还款
        </button>
      </div>
    </div>
    
    <!-- 还款计划 -->
    <div class="repayment-plan-card">
      <h3 class="card-title">还款计划</h3>
      <div class="plan-list">
        <div 
          v-for="plan in repaymentPlans" 
          :key="plan.id"
          class="plan-item"
          :class="{ completed: plan.status === 'completed', current: plan.status === 'current' }"
        >
          <div class="plan-header">
            <div class="plan-period">
              <span class="period-label">第{{ plan.period }}期</span>
              <span class="period-date">{{ plan.dueDate }}</span>
            </div>
            <div class="plan-amount">
              <span class="amount-label">应还金额</span>
              <span class="amount-value">¥{{ formatCurrency(plan.amount) }}</span>
            </div>
          </div>
          <div class="plan-principal-interest">
            <div class="principal-box">
              <div class="principal-amount">{{ formatCurrency(plan.principal) }}¥</div>
              <div class="principal-label">本金</div>
            </div>
            <div class="interest-box">
              <div class="interest-amount">{{ formatCurrency(plan.interest) }}¥</div>
              <div class="interest-label">利息</div>
            </div>
          </div>
          <div class="plan-status">
            <span class="status-label">状态</span>
            <span class="status-value" :class="getPlanStatusClass(plan.status)">
              {{ getPlanStatusText(plan.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'Repayment',
  data() {
    return {
      loanInfo: {
        amount: 0,
        remainingAmount: 0,
        dueDate: '',
        status: 'repaying'
      },
      repaymentPlans: [],
      earlyRepayment: {
        amount: '',
        type: 'reducePeriods'
      },
      loading: false
    }
  },
  created() {
    this.loadRepaymentInfo()
  },
  methods: {
    async loadRepaymentInfo() {
      this.loading = true
      try {
        // 获取路由参数
        const query = this.$route.query
        this.loanInfo = {
          amount: Number(query.amount) || 5000,
          remainingAmount: Number(query.remainingAmount) || 2500,
          dueDate: query.dueDate || '2024-02-15',
          status: query.status || 'repaying'
        }
        
        // 获取还款计划数据
        await this.fetchRepaymentSchedules()
        
      } catch (error) {
        console.error('获取还款信息失败:', error)
        this.loading = false
      }
    },
    
    async fetchRepaymentSchedules() {
      try {
        // 从localStorage获取accessToken
        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken) {
          throw new Error('未找到访问令牌')
        }
        
        // 获取路由参数中的loan_id
        const loanId = this.$route.query.loanId || this.$route.query.id
        console.log('loanId:', loanId)
        if (!loanId) {
          throw new Error('未找到借款ID')
        }
        
        // 设置请求头
        const myHeaders = new Headers()
        myHeaders.append('Authorization', accessToken)
        myHeaders.append('Content-Type', 'application/json')
        
        // 设置请求体
        // const raw = JSON.stringify({
        //   id: Number(loanId)
        // })
        var raw = `{"id":${loanId}}`
        console.log('请求体:', raw)
        
        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        }
        
        // 调用API获取还款计划
        const response = await fetch('http://115.190.40.44:45444/loan/getSchedules', requestOptions)
        const result = await response.text()
        const data = JSON.parse(result)
        
        if (data.errCode === 200 && data.success) {
          // 处理还款计划数据
          this.processRepaymentSchedules(data.schedules)
        } else {
          throw new Error(data.errMsg || '获取还款计划失败')
        }
        
      } catch (error) {
        console.error('获取还款计划失败:', error)
        // 如果API调用失败，使用模拟数据作为后备
        this.useMockData()
      } finally {
        this.loading = false
      }
    },
    
    processRepaymentSchedules(schedules) {
      if (!schedules || schedules.length === 0) {
        this.useMockData()
        return
      }
      
      // 首先按Period从小到大排序
      const sortedSchedules = [...schedules].sort((a, b) => a.Period - b.Period)
      
      // 转换API数据格式到组件格式
      this.repaymentPlans = sortedSchedules.map(schedule => ({
        id: schedule.ID,
        period: schedule.Period,
        dueDate: this.formatDate(schedule.DueDate),
        amount: Number(schedule.TotalPayment),
        principal: Number(schedule.Principal),
        interest: Number(schedule.Interest),
        serviceFee: schedule.ServiceFee && schedule.ServiceFee.length > 0 ? 
          Number(schedule.ServiceFee[0].Fix) : 0,
        status: this.convertStatus(schedule.Status, schedule.Overdue),
        totalPaymentPaid: Number(schedule.TotalPaymentPaid),
        overdue: schedule.Overdue
      }))
      
      // 设置第一个未还款的计划为当前计划
      this.setCurrentPlan()
      
      // 设置到期日期为最后一期的截止时间
      if (sortedSchedules.length > 0) {
        const lastSchedule = sortedSchedules[sortedSchedules.length - 1]
        this.loanInfo.dueDate = this.formatDate(lastSchedule.DueDate)
      }
      
      // 计算剩余应还金额
      const remainingAmount = this.repaymentPlans
        .filter(plan => plan.status !== 'completed')
        .reduce((sum, plan) => sum + plan.amount, 0)
      this.loanInfo.remainingAmount = remainingAmount
    },
    
    setCurrentPlan() {
      // 找到第一个未还款的计划，设置为当前计划
      const firstUnpaidPlan = this.repaymentPlans.find(plan => plan.status === 'pending')
      if (firstUnpaidPlan) {
        firstUnpaidPlan.status = 'current'
      }
    },
    
    convertStatus(apiStatus, overdue) {
      // 根据API状态转换为组件状态
      if (apiStatus === 'PAID' || apiStatus === 'COMPLETED') {
        return 'completed'
      } else if (overdue) {
        return 'overdue'
      } else {
        // 对于未支付的款项，根据日期判断是否为当前期
        return 'pending'
      }
    },
    
    formatDate(dateString) {
      // 将ISO日期格式转换为本地日期格式
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN')
    },
    
    useMockData() {
      // 后备的模拟数据
      this.repaymentPlans = [
        {
          id: 1,
          period: 1,
          dueDate: '2024-01-15',
          amount: 1250,
          principal: 1000,
          interest: 200,
          serviceFee: 50,
          status: 'completed'
        },
        {
          id: 2,
          period: 2,
          dueDate: '2024-02-15',
          amount: 1250,
          principal: 1000,
          interest: 200,
          serviceFee: 50,
          status: 'current'
        },
        {
          id: 3,
          period: 3,
          dueDate: '2024-03-15',
          amount: 1250,
          principal: 1000,
          interest: 200,
          serviceFee: 50,
          status: 'pending'
        },
        {
          id: 4,
          period: 4,
          dueDate: '2024-04-15',
          amount: 1250,
          principal: 1000,
          interest: 200,
          serviceFee: 50,
          status: 'pending'
        }
      ]
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
    
    getPlanStatusClass(status) {
      const statusMap = {
        'completed': 'status-completed',
        'current': 'status-current',
        'pending': 'status-pending',
        'overdue': 'status-overdue'
      }
      return statusMap[status] || 'status-pending'
    },
    
    getPlanStatusText(status) {
      const statusMap = {
        'completed': '已还',
        'current': '当前',
        'pending': '待还',
        'overdue': '逾期'
      }
      return statusMap[status] || '待还'
    },
    
    calculateInterestSaved() {
      // 简单的利息节省计算
      const amount = Number(this.earlyRepayment.amount) || 0
      return Math.round(amount * 0.02) // 假设节省2%
    },
    
    calculateNewPeriods() {
      // 简单的期数计算
      const amount = Number(this.earlyRepayment.amount) || 0
      const currentPeriods = this.repaymentPlans.filter(p => p.status !== 'completed').length
      if (this.earlyRepayment.type === 'reducePeriods') {
        return Math.max(1, currentPeriods - Math.floor(amount / 1000))
      }
      return currentPeriods
    },
    
    async handleEarlyRepayment() {
      if (!this.earlyRepayment.amount || this.earlyRepayment.amount <= 0) {
        alert('请输入有效的还款金额')
        return
      }
      
      if (confirm(`确认提前还款 ¥${this.formatCurrency(this.earlyRepayment.amount)} 吗？`)) {
        try {
          // 从localStorage获取accessToken
          const accessToken = localStorage.getItem('accessToken')
          if (!accessToken) {
            throw new Error('未找到访问令牌')
          }
          
          // 获取路由参数中的loan_id
          const loanId = this.$route.query.loanId || this.$route.query.id
          if (!loanId) {
            throw new Error('未找到借款ID')
          }
          
          // 设置请求头
          const myHeaders = new Headers()
          myHeaders.append('Authorization', accessToken)
          myHeaders.append('Content-Type', 'application/json')
          
          // 转换还款方式
          const path = this.earlyRepayment.type === 'reducePeriods' ? 'TERM_REDUCTION' : 'PAYMENT_REDUCTION'
          
          // 设置请求体
          // const raw = JSON.stringify({
          //   loanId: Number(loanId),
          //   amount: String(this.earlyRepayment.amount),
          //   path: path
          // })
          var raw = `{"loanId":${loanId},` +
                    `"amount":${String(this.earlyRepayment.amount)},` +
                    `"path":"${path}"}`

          console.log("还款的请求体：", raw)
          const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          }
          
          // 调用API进行提前还款
          const response = await fetch('http://115.190.40.44:45444/loan/repay', requestOptions)
          const result = await response.text()
          const data = JSON.parse(result)
          
          if (data.success && data.errCode === 200) {
            // 成功处理
            alert('提前还款成功')
            
            // 重置表单
            this.earlyRepayment.amount = ''
            this.earlyRepayment.type = 'reducePeriods'
            
            // 跳转到还款记录页面
            this.$router.push('/loan-records')
          } else {
            throw new Error(data.errMsg || '提前还款失败')
          }
          
        } catch (error) {
          console.error('提前还款失败:', error)
          alert('提前还款失败: ' + error.message)
        }
      }
    },
    

    
    formatCurrency(amount) {
      // 格式化金额为两位小数
      return Number(amount).toFixed(2)
    },
    
    goBack() {
      this.$router.push('/loan-records')
    }
  }
}
</script>

<style scoped>
.repayment {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
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

.loan-info-card,
.repayment-plan-card,
.early-repayment-card {
  background: white;
  margin: 16px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #212121;
  margin-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.info-value {
  font-size: 14px;
  color: #212121;
  font-weight: 500;
}

.info-value.highlight {
  color: #f44336;
  font-weight: bold;
}

/* 新借款信息布局样式 */
.loan-info-rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #fafafa;
  padding: 12px;
  border-radius: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  gap: 40px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-row:first-child {
  padding-top: 0;
}

.info-pair {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.info-label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.info-value {
  font-size: 16px;
  color: #212121;
  font-weight: 500;
}

.remaining-amount {
  color: #f44336;
  font-weight: bold;
  font-size: 18px;
}

.loan-status {
  color: #1976d2;
  font-weight: bold;
  font-size: 16px;
}

.status-repaying {
  color: #1976d2;
}

.status-completed {
  color: #388e3c;
}

.status-overdue {
  color: #d32f2f;
}

.plan-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.plan-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s ease;
}

.plan-item.completed {
  background: #f1f8e9;
  border-color: #a5d6a7;
}

.plan-item.current {
  background: #e3f2fd;
  border-color: #90caf9;
  box-shadow: 0 2px 8px rgba(30, 136, 229, 0.2);
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.plan-period {
  display: flex;
  flex-direction: column;
}

.period-label {
  font-size: 16px;
  font-weight: 600;
  color: #212121;
  margin-bottom: 2px;
}

.period-date {
  font-size: 13px;
  color: #999;
}

.plan-amount {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.amount-label {
  font-size: 13px;
  color: #999;
  margin-bottom: 2px;
}

.amount-value {
  font-size: 18px;
  font-weight: bold;
  color: #212121;
}

.plan-details {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #f5f5f5;
}

.plan-principal-interest {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-top: 8px;
}

.principal-box,
.interest-box {
  flex: 1;
  text-align: center;
  padding: 8px;
  background: rgb(229 228 228 / 66%);
  border-radius: 6px;
}

.principal-amount,
.interest-amount {
  font-size: 18px;
  font-weight: bold;
  color: #212121;
  margin-bottom: 4px;
}

.principal-label,
.interest-label {
  font-size: 12px;
  color: #666;
}

.plan-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  margin-top: 8px;
  border-top: 1px solid #f5f5f5;
}

.status-label {
  font-size: 11px;
  color: #999;
}

.status-value {
  font-size: 13px;
  font-weight: 500;
}

.detail-item {
  display: flex;
  flex-direction: column;
  text-align: center;
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

.status-completed {
  color: #388e3c;
}

.status-current {
  color: #1976d2;
  font-weight: bold;
}

.status-pending {
  color: #999;
}

.early-repayment-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 14px;
  color: #212121;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-input {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #1e88e5;
}

/* 还款方式按钮样式 */
.repayment-type-buttons {
  display: flex;
  gap: 10px;
}

.type-btn {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  color: #666;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.type-btn:hover {
  border-color: #1e88e5;
  color: #1e88e5;
}

.type-btn.active {
  border-color: #1e88e5;
  background: #1e88e5;
  color: white;
}



.btn-block {
  width: 100%;
}

@media (max-width: 480px) {
  .loan-info-card,
  .repayment-plan-card,
  .early-repayment-card {
    margin: 12px;
    padding: 16px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .plan-principal-interest {
    gap: 12px;
    padding-top: 6px;
  }
  
  .principal-box,
  .interest-box {
    padding: 6px;
  }
  
  .principal-amount,
  .interest-amount {
    font-size: 16px;
    margin-bottom: 2px;
  }
  
  .principal-label,
  .interest-label {
    font-size: 11px;
  }
  
  .plan-status {
    padding-top: 6px;
    margin-top: 6px;
  }
  
  .repayment-type-buttons {
    flex-direction: row;
    gap: 8px;
  }
  
  .type-btn {
    padding: 8px 10px;
    font-size: 12px;
    min-width: 80px;
  }
  
  /* 移动端借款信息布局优化 */
  .loan-info-rows {
    gap: 8px;
  }
  
  .info-row {
    flex-direction: row;
    gap: 20px;
    padding: 6px 0;
  }
  
  .info-pair {
    justify-content: space-between;
    gap: 6px;
  }
  
  .info-label {
    font-size: 13px;
  }
  
  .info-value {
    font-size: 15px;
  }
  
  .remaining-amount {
    font-size: 16px;
  }
  
  .loan-status {
    font-size: 15px;
  }
  
  /* 移动端期数和应还金额字体大小调整 */
  .period-label {
    font-size: 15px;
  }
  
  .period-date {
    font-size: 12px;
  }
  
  .amount-label {
    font-size: 12px;
  }
  
  .amount-value {
    font-size: 17px;
  }

}
</style>
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
        :class="{ 'highlight-record': record.isHighlight && isHighlighting }"
        @click="handleRecordClick(record)"
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
            <span class="info-label">总期数</span>
            <span class="info-value">{{ record.totalPeriods }}期</span>
          </div>
          <div class="info-item">
            <span class="info-label">已还期数</span>
            <span class="info-value">{{ record.paidPeriods }}期</span>
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
        
        <!-- 产品信息按钮 -->
        <div class="product-info">
          <button 
            class="btn-product" 
            @click.stop="showProductDetails(record.productId)"
          >
            {{ record.productName }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 产品详情弹窗 -->
    <div v-if="showProductModal" class="modal-overlay" @click="closeProductModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">产品详情</h3>
          <button class="modal-close" @click="closeProductModal">×</button>
        </div>
        <div class="modal-body">
          <div v-if="productLoading" class="modal-loading">加载中...</div>
          <div v-else-if="productError" class="modal-error">{{ productError }}</div>
          <div v-else class="product-details">
            <div class="detail-item">
              <span class="detail-label">产品名称</span>
              <span class="detail-value">{{ productInfo.name }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">利率</span>
              <span class="detail-value">{{ (parseFloat(productInfo.interest) * 100).toFixed(2) }}%</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">借款范围</span>
              <span class="detail-value">¥{{ productInfo.min_principle }} - ¥{{ productInfo.max_principle }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">期限范围</span>
              <span class="detail-value">{{ productInfo.min_periods }} - {{ productInfo.max_periods }} 天</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">还款方式</span>
              <span class="detail-value">{{ getRepayTypeText(productInfo.repay_type) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">罚息利率</span>
              <span class="detail-value">{{ (parseFloat(productInfo.penalty) * 100).toFixed(2) }}%</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">宽限期</span>
              <span class="detail-value">{{ productInfo.grace_term }} 天</span>
            </div>
            <div class="detail-item full-width">
              <span class="detail-label">产品说明</span>
              <span class="detail-value">{{ productInfo.info }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="closeProductModal">关闭</button>
        </div>
      </div>
    </div>
    
    <!-- 审核中弹窗 -->
    <div v-if="showCheckingModal" class="modal-overlay" @click="showCheckingModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">贷款记录审核中</h3>
          <button class="modal-close" @click="showCheckingModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="checking-content">
            <div class="checking-icon">⏳</div>
            <p class="checking-text">您的贷款申请正在审核中，请耐心等待</p>
            <p class="checking-subtext">审核完成后即可查看还款详情</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="showCheckingModal = false">知道了</button>
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
      records: [],
      showProductModal: false,
      productLoading: false,
      productError: '',
      productInfo: {},
      highlightLoanId: null, // 需要高亮显示的借款编号
      isHighlighting: false, // 是否正在高亮显示
      showCheckingModal: false // 审核中弹窗显示状态
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
    // 检查是否有需要高亮显示的借款编号
    const query = this.$route.query
    if (query.highlightLoanId) {
      this.highlightLoanId = query.highlightLoanId
      this.isHighlighting = true
    }
    this.loadLoanRecords()
  },
  methods: {
    async loadLoanRecords() {
      this.loading = true
      try {
        // 直接调用后端接口获取借款记录
        const myHeaders = new Headers()
        const token = localStorage.getItem('accessToken')
        if (token) {
          myHeaders.append('Authorization', `Bearer ${token}`)
        }

        const requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        }

        const response = await fetch('http://115.190.40.44:45444/loan/orderList', requestOptions)
        const result = await response.text()
        const jsonString = result;
        const fixedJsonString = jsonString.replace(
          /"product_id":\s*(\d{15,})/g,  // 匹配15位以上的数字id
          '"product_id":"$1"'  // 添加双引号使其变为字符串
        ).replace(
          /"loan_id":\s*(\d{15,})/g,  // 匹配15位以上的数字id
          '"loan_id":"$1"'  // 添加双引号使其变为字符串
        )
        const data = JSON.parse(fixedJsonString)
        
        if (data.errCode === 200 && data.success) {
          // 将后端数据格式转换为前端需要的格式
          let records = data.list.map(item => ({
            id: item.loan_id,
            amount: parseFloat(item.Principal),
            totalPeriods: item.TotalPeriods,
            paidPeriods: item.PaidPeriods,
            remainingAmount: parseFloat(item.Principal) - parseFloat(item.PaidAmount),
            status: this.mapStatus(item.Status),
            _rawStatus: item.Status, // 保存原始状态值用于调试
            progress: item.TotalPeriods > 0 ? Math.round((item.PaidPeriods / item.TotalPeriods) * 100) : 0,
            productName: `产品${item.product_id}`,
            productId: item.product_id,
            term: item.TotalPeriods,
            interestRate: 0.05,
            isHighlight: item.loan_id === this.highlightLoanId // 标记是否需要高亮
          }))
          
          // 如果需要高亮显示特定记录，将其置顶
          if (this.highlightLoanId) {
            const highlightRecord = records.find(record => record.id === this.highlightLoanId)
            if (highlightRecord) {
              records = [highlightRecord, ...records.filter(record => record.id !== this.highlightLoanId)]
            }
          }
          
          this.records = records
          console.log(this.records)
           // 👇 新增：为每条记录获取真实产品名
          await this.loadProductNames()
          
          // 如果正在高亮显示，滚动到顶部并添加动画效果
          if (this.isHighlighting && this.highlightLoanId) {
            this.$nextTick(() => {
              this.scrollToHighlightedRecord()
            })
          }

        } else {
          console.error('获取借款记录失败:', data)
          this.records = []
        }
      } catch (error) {
        console.error('获取借款记录失败:', error)
        this.records = []
      } finally {
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
        'checking': '审核中',
        'repaying': '还款中',
        'completed': '已结清',
        'overdue': '已逾期'
      }
      return statusMap[status] || '还款中'
    },
    
    handleRecordClick(record) {
      // 调试：输出实际状态值
      console.log('点击记录状态:', record.status, '原始数据状态:', record._rawStatus)
      
      // 如果状态是checking（审核中）或者原始状态是PENDING，显示审核中弹窗
      if (record.status === 'checking' || record._rawStatus === 'PENDING') {
        console.log('显示审核中弹窗')
        this.showCheckingModal = true
        return
      }
      
      // 其他状态正常跳转到还款页面
      this.goToRepayment(record)
    },
    
    goToRepayment(record) {
      this.$router.push({
        path: '/repayment',
        query: { 
          loanId: record.id,
          amount: record.amount,
          remainingAmount: record.remainingAmount,
          status: record.status
        }
      })
    },
    //只是获取产品名字
    async loadProductNames() {
      const promises = this.records.map(async (record) => {
        try {
          const myHeaders = new Headers()
          const token = localStorage.getItem('accessToken')
          if (token) {
            myHeaders.append('Authorization', `Bearer ${token}`)
          }
          myHeaders.append('Content-Type', 'application/json')

          const raw = `{"id":${record.productId}}`
          const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          }

          const response = await fetch('http://115.190.40.44:45444/loan/getProduct', requestOptions)
          const result = await response.text()
          const data = JSON.parse(result)

          if (data.errCode === 200 && data.success) {
            // 找到对应的 record，更新 productName
            const index = this.records.findIndex(r => r.id === record.id)
            if (index !== -1) {
              this.records[index].productName = data.product.name || `产品${record.productId}`;
            }
          }
        } catch (error) {
          console.warn('获取产品名失败，productId:', record.productId, error)
          // 失败就保留临时名字，不报错
        }
      })
      // 等所有请求完成（即使有失败也不中断）
      await Promise.allSettled(promises)
    },
    
    // 产品详情相关方法
    async showProductDetails(productId) {
      this.showProductModal = true
      this.productLoading = true
      this.productError = ''
      
      try {
        // 直接调用后端接口获取产品详情
        try {
          const myHeaders = new Headers()
          const token = localStorage.getItem('accessToken')
          if (token) {
            myHeaders.append('Authorization', `Bearer ${token}`)
          }
          myHeaders.append('Content-Type', 'application/json')

          // const raw = JSON.stringify({
          //   id: productId
          // })
          var raw = `{"id":${productId}}`

          console.log("请求产品详情：", raw)
          const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          }

          const response = await fetch('http://115.190.40.44:45444/loan/getProduct', requestOptions)
          const result = await response.text()
          const data = JSON.parse(result)
          
          if (data.errCode === 200 && data.success) {
            this.productInfo = data.product
          } else {
            this.productError = '获取产品信息失败'
            console.error('获取产品信息失败:', data)
          }
        } catch (error) {
          this.productError = '获取产品信息失败'
          console.error('获取产品信息失败:', error)
        }
      } catch (error) {
        this.productError = '获取产品信息失败'
        console.error('获取产品信息失败:', error)
      } finally {
        this.productLoading = false
      }
    },
    
    closeProductModal() {
      this.showProductModal = false
      this.productInfo = {}
      this.productError = ''
    },
    
    getRepayTypeText(repayType) {
      const typeMap = {
        'EQUAL_PRINCIPAL': '等额本金',
        'EQUAL_INSTALLMENT': '等额本息',
        'INTEREST_ONLY': '先息后本',
        'BULLET': '一次性还本付息'
      }
      return typeMap[repayType] || repayType
    },
    
    
    mapStatus(status) {
      const statusMap = {
        'UNPAID': 'repaying',
        'PENDING': 'checking',
        'APPROVED': 'repaying',
        'REJECTED': 'overdue',
        'DISBURSED': 'repaying',
        'PAID': 'completed',
        'OVERDUE': 'overdue',
        'DEFAULTED': 'overdue'
      }
      return statusMap[status] || 'repaying'
    },
    
    goBack() {
      this.$router.push('/profile')
    },
    
    scrollToHighlightedRecord() {
      // 滚动到页面顶部，因为高亮记录已经被置顶
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      
      // 3秒后移除高亮效果
      setTimeout(() => {
        this.isHighlighting = false
      }, 3000)
    }
  }
}
</script>

<style scoped>
.loan-records {
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
  font-size: 20px;
  font-weight: 900;
  color: #1b2734;
  margin: 0;
}

.filter-tabs {
  display: flex;
  margin: 14px;
  padding: 8px;
  gap: 8px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(255, 255, 255, 0.74);
  box-shadow: 0 16px 36px rgba(32, 55, 76, 0.08);
  backdrop-filter: blur(18px);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 10px;
  border-radius: 16px;
  font-size: 14px;
  color: #687584;
  cursor: pointer;
  transition: all 0.18s ease;
  border: 0;
  font-weight: 900;
}

.tab-item.active {
  background: linear-gradient(135deg, #142744, #17736c 58%, #ff8857);
  color: white;
  box-shadow: 0 10px 20px rgba(23, 115, 108, 0.18);
}

.records-list {
  padding: 0 14px 14px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #687584;
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

.loan-amount {
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

.status-repaying {
  background: #eaf6ff;
  color: #1467a8;
}

.status-completed {
  background: #e9f7f3;
  color: #17736c;
}

.status-overdue {
  background: #fff0e6;
  color: #b5521b;
}

.record-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 8px 0;
  gap: 8px;
  padding: 10px;
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

.record-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: #e8edf2;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #17736c, #ff8857);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #687584;
  font-weight: 900;
}

/* 高亮记录样式 - 简洁闪烁效果 */
.highlight-record {
  border: 2px solid #ff8857 !important;
  animation: borderFlash 1.5s ease-in-out 3;
  background: #fff4e8;
}

@keyframes borderFlash {
  0%, 100% {
    border-color: #ff8857;
    box-shadow: 0 0 0 rgba(255, 136, 87, 0);
  }
  50% {
    border-color: #17736c;
    box-shadow: 0 0 16px rgba(23, 115, 108, 0.24);
  }
}

/* 审核中弹窗样式 */
.checking-content {
  text-align: center;
  padding: 40px 20px;
}

.checking-icon {
  font-size: 64px;
  margin-bottom: 20px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.checking-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.checking-subtext {
  font-size: 14px;
  color: #666;
  margin-bottom: 0;
}

@media (max-width: 480px) {
  .loan-records {
    padding-bottom: 92px;
  }
  
  .page-header {
    padding: 12px;
  }
  
  .filter-tabs {
    margin: 12px;
    padding: 8px;
    gap: 8px;
  }
  
  .tab-item {
    padding: 10px;
    font-size: 13px;
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
}

/* 产品信息按钮样式 */
.product-info {
  margin-top: 12px;
  text-align: right;
}

.btn-product {
  background: linear-gradient(135deg, #142744, #17736c 58%, #ff8857);
  color: white;
  border: none;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 12px;
  cursor: pointer;
  font-weight: 900;
  transition: all 0.18s ease;
}

.btn-product:hover {
  transform: translateY(-1px);
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(16, 29, 43, 0.58);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 24px 58px rgba(13, 31, 46, 0.28);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eef1f5;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #1b2734;
  font-weight: 900;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #7b8794;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.modal-loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.modal-error {
  text-align: center;
  padding: 20px;
  color: #d32f2f;
  background: #fff0e6;
  border-radius: 18px;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #eef1f5;
}

.detail-item.full-width {
  flex-direction: column;
  gap: 8px;
}

.detail-label {
  font-size: 14px;
  color: #7b8794;
  font-weight: 800;
  min-width: 80px;
}

.detail-value {
  font-size: 14px;
  color: #25303d;
  font-weight: 900;
  text-align: right;
  flex: 1;
}

.detail-item.full-width .detail-value {
  text-align: left;
  font-weight: 400;
  line-height: 1.5;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eef1f5;
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #142744, #17736c 58%, #ff8857);
  color: white;
  font-weight: 900;
}

.btn-primary:hover {
  transform: translateY(-1px);
}
</style>

<template>
  <div class="loan">
    <div class="page-header">
      <h1 class="page-title">贷款产品</h1>
      <p class="page-subtitle">选择适合您的贷款产品</p>
    </div>
    
    <!-- 贷款产品列表 -->
    <div class="loan-products">
      <div 
        class="product-card" 
        v-for="product in loanProducts" 
        :key="product.id"
        @click="selectProduct(product)"
      >
        <div class="product-header">
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-desc">{{ product.description }}</p>
          </div>
          <div class="product-amount">
            <span class="amount-range">{{ product.amountRange }}</span>
          </div>
        </div>
        
        <div class="product-details">
          <div class="detail-item">
            <span class="detail-label">日利率</span>
            <span class="detail-value">{{ product.dailyRate }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">期限</span>
            <span class="detail-value">{{ product.term }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">放款时间</span>
            <span class="detail-value">{{ product.loanTime }}</span>
          </div>
        </div>
        
        <div class="product-features">
          <span 
            class="feature-tag" 
            v-for="feature in product.features" 
            :key="feature"
          >
            {{ feature }}
          </span>
        </div>
        
        <button class="btn btn-primary btn-block apply-btn">
          立即申请
        </button>
      </div>
    </div>
    
    <!-- 申请弹窗 -->
    <div class="modal" v-if="showApplyModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>申请贷款</h3>
          <button class="close-btn" @click="showApplyModal = false">×</button>
        </div>
        
        <form @submit.prevent="submitApplication">
          <div class="form-group">
            <label class="form-label">借款金额</label>
            <input 
              v-model="application.amount"
              type="number" 
              class="form-input"
              :placeholder="`请输入${selectedProduct.amountRange}之间的金额`"
              required
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">借款期限</label>
            <select v-model="application.term" class="form-input" required>
              <option value="">请选择借款期限</option>
              <option value="7">7天</option>
              <option value="14">14天</option>
              <option value="30">30天</option>
              <option value="90">90天</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">借款用途</label>
            <select v-model="application.purpose" class="form-input" required>
              <option value="">请选择借款用途</option>
              <option value="consumption">日常消费</option>
              <option value="education">教育培训</option>
              <option value="medical">医疗健康</option>
              <option value="business">创业经营</option>
              <option value="other">其他</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">还款方式</label>
            <select v-model="application.repaymentMethod" class="form-input" required>
              <option value="">请选择还款方式</option>
              <option value="equal">等额本息</option>
              <option value="interest">先息后本</option>
              <option value="principal">等额本金</option>
            </select>
          </div>
          
          <div class="loan-preview">
            <h4>借款预览</h4>
            <div class="preview-item">
              <span>借款金额：</span>
              <span>¥{{ application.amount || 0 }}</span>
            </div>
            <div class="preview-item">
              <span>日利率：</span>
              <span>{{ selectedProduct.dailyRate }}</span>
            </div>
            <div class="preview-item">
              <span>预计利息：</span>
              <span>¥{{ calculateInterest }}</span>
            </div>
            <div class="preview-item">
              <span>到期应还：</span>
              <span>¥{{ calculateTotal }}</span>
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary btn-block">
            确认申请
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loan',
  data() {
    return {
      loanProducts: [],
      selectedProduct: {},
      showApplyModal: false,
      application: {
        amount: '',
        term: '',
        purpose: '',
        repaymentMethod: ''
      }
    }
  },
  computed: {
    calculateInterest() {
      if (!this.application.amount || !this.selectedProduct.dailyRate) return 0
      const rate = parseFloat(this.selectedProduct.dailyRate.replace('%', '')) / 100
      const days = parseInt(this.application.term) || 0
      return Math.round(this.application.amount * rate * days * 100) / 100
    },
    calculateTotal() {
      return parseFloat(this.application.amount || 0) + this.calculateInterest
    }
  },
  created() {
    this.loadLoanProducts()
  },
  methods: {
    async loadLoanProducts() {
      try {
        // 预留接口：获取贷款产品列表
        console.log('调用API获取贷款产品列表')
        
        // 模拟数据
        this.loanProducts = [
          {
            id: 1,
            name: '信用贷',
            description: '纯信用贷款，无需抵押',
            amountRange: '1000-50000元',
            dailyRate: '0.02%',
            term: '7-90天',
            loanTime: '30分钟',
            features: ['极速放款', '随借随还', '信用借款']
          },
          {
            id: 2,
            name: '消费贷',
            description: '专为日常消费设计',
            amountRange: '500-20000元',
            dailyRate: '0.025%',
            term: '7-30天',
            loanTime: '1小时',
            features: ['额度灵活', '分期还款', '低利率']
          },
          {
            id: 3,
            name: '经营贷',
            description: '小微企业经营周转',
            amountRange: '10000-100000元',
            dailyRate: '0.018%',
            term: '30-90天',
            loanTime: '2小时',
            features: ['额度较高', '期限较长', '企业专享']
          }
        ]
      } catch (error) {
        console.error('获取贷款产品失败:', error)
      }
    },
    
    selectProduct(product) {
      this.selectedProduct = product
      this.showApplyModal = true
      this.application = {
        amount: '',
        term: '',
        purpose: '',
        repaymentMethod: ''
      }
    },
    
    async submitApplication() {
      if (!this.application.amount || !this.application.term || 
          !this.application.purpose || !this.application.repaymentMethod) {
        alert('请填写完整的申请信息')
        return
      }
      
      try {
        // 预留接口：提交贷款申请
        console.log('提交贷款申请:', {
          productId: this.selectedProduct.id,
          ...this.application
        })
        
        alert('申请提交成功，请等待审核')
        this.showApplyModal = false
        
        // 跳转到申请记录页面
        this.$router.push('/loan-records')
      } catch (error) {
        console.error('提交申请失败:', error)
        alert('申请提交失败，请重试')
      }
    }
  }
}
</script>

<style scoped>
.loan {
  padding: 16px;
  padding-bottom: 96px;
}

.page-header {
  text-align: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #212121;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 14px;
  color: #757575;
}

.loan-products {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-2px);
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  color: #212121;
  margin-bottom: 4px;
}

.product-desc {
  font-size: 14px;
  color: #757575;
  margin: 0;
}

.product-amount {
  text-align: right;
}

.amount-range {
  font-size: 16px;
  font-weight: 600;
  color: #1e88e5;
}

.product-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
}

.detail-item {
  text-align: center;
}

.detail-label {
  display: block;
  font-size: 12px;
  color: #757575;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
  color: #212121;
}

.product-features {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.feature-tag {
  background: #e3f2fd;
  color: #1e88e5;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.apply-btn {
  margin-top: 8px;
}

/* 弹窗样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #212121;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #757575;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content form {
  padding: 20px;
}

.loan-preview {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.loan-preview h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #212121;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.preview-item:last-child {
  margin-bottom: 0;
  font-weight: 600;
  color: #1e88e5;
}

@media (max-width: 480px) {
  .loan {
    padding: 12px;
    padding-bottom: 92px;
  }
  
  .product-header {
    flex-direction: column;
    gap: 8px;
  }
  
  .product-details {
    flex-direction: column;
    gap: 8px;
  }
  
  .detail-item {
    display: flex;
    justify-content: space-between;
    text-align: left;
  }
}
</style>
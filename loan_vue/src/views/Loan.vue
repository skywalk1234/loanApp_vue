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
            <p class="product-desc">年化利率: {{ (parseFloat(product.interest) * 100).toFixed(2) }}%</p>
          </div>
        </div>
        
        <div class="product-details">
          <div class="detail-item">
            <span class="detail-label">借款额度</span>
            <span class="detail-value">{{ getAmountRangeText(product) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">借款期限</span>
            <span class="detail-value">{{ getTermRangeText(product) }}</span>
          </div>
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
            <label class="form-label">产品名称</label>
            <input 
              :value="selectedProduct.name"
              type="text" 
              class="form-input"
              disabled
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">年化利率</label>
            <input 
              :value="(parseFloat(selectedProduct.interest) * 100).toFixed(2) + '%'"
              type="text" 
              class="form-input"
              disabled
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">借款金额</label>
            <input 
              v-model="application.amount"
              type="number" 
              class="form-input"
              :placeholder="getAmountPlaceholder()"
              :min="selectedProduct.min_principle || undefined"
              :max="selectedProduct.max_principle || undefined"
              required
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">借款期数</label>
            <div class="input-hint">一期为{{ getPeriodTypeText() }}</div>
            <input 
              v-model.number="application.term"
              type="number" 
              class="form-input"
              :placeholder="`请输入0-${selectedProduct.max_periods}之间的整数`"
              :min="selectedProduct.min_periods"
              :max="selectedProduct.max_periods"
              required
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">还款方式</label>
            <input 
              :value="getRepayTypeText(selectedProduct.repay_type)"
              type="text" 
              class="form-input"
              disabled
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">宽限期</label>
            <input 
              :value="0 + '期'"
              type="text" 
              class="form-input"
              disabled
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">宽限天数</label>
            <input 
              :value="selectedProduct.grace_day + '天'"
              type="text" 
              class="form-input"
              disabled
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">违约金率</label>
            <input 
              :value="(parseFloat(selectedProduct.penalty) * 100).toFixed(2) + '%'"
              type="text" 
              class="form-input"
              disabled
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">违约利率</label>
            <input 
              :value="(parseFloat(selectedProduct.default_rate) * 100).toFixed(2) + '%'"
              type="text" 
              class="form-input"
              disabled
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">产品说明</label>
            <textarea 
              :value="selectedProduct.info"
              class="form-input"
              rows="3"
              disabled
            ></textarea>
          </div>
          
          <div class="loan-preview">
            <h4>借款预览</h4>
            <div class="preview-item">
              <span>借款金额：</span>
              <span>¥{{ application.amount || 0 }}</span>
            </div>
            <div class="preview-item">
              <span>年化利率：</span>
              <span>{{ (parseFloat(selectedProduct.interest) * 100).toFixed(2) }}%</span>
            </div>
            <div class="preview-item">
              <span>借款期数：</span>
              <span>{{ application.term || 0 }}{{ getPeriodTypeText() }}</span>
            </div>
            <div class="preview-item">
              <span>预计利息：</span>
              <span>¥{{ calculateInterest.toFixed(2) }}</span>
            </div>
            <div class="preview-item">
              <span>到期应还：</span>
              <span>¥{{ calculateTotal.toFixed(2) }}</span>
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
import { tokenService } from '@/services/api'
import tokenRefreshMixin from '@/mixins/tokenRefresh'

export default {
  name: 'Loan',
  mixins: [tokenRefreshMixin],
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
      if (!this.application.amount || !this.selectedProduct.interest) return 0
      const rate = parseFloat(this.selectedProduct.interest)
      const periods = parseInt(this.application.term) || 0
      return Math.round(this.application.amount * rate * periods * 100) / 100
    },
    calculateTotal() {
      return parseFloat(this.application.amount || 0) + this.calculateInterest
    }
  },
  created() {
    // mixin会自动处理token刷新，这里只需要加载产品数据
    this.loadLoanProducts()
  },
  methods: {
    // 刷新accessToken - 现在使用tokenService
    async refreshAccessToken() {
      return await tokenService.refreshAccessToken()
    },
    
    async loadLoanProducts() {
      try {
        console.log('调用API获取贷款产品列表')
        
        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken) {
          console.error('没有找到accessToken')
          return
        }
        
        var myHeaders = new Headers()
        myHeaders.append("Authorization", accessToken)
        
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        }
        
        const response = await fetch("http://115.190.40.44:45444/loan/option", requestOptions)
        const result = await response.text()
        console.log('获取产品列表响应:', result)
        
        const responseData = JSON.parse(result)
        
        const products = responseData.option || []
        if (responseData.success && products.length > 0) {
          console.log('获取产品列表成功，共', products.length, '个产品')
          this.loanProducts = products.map(product => this.normalizeLoanProduct(product))
        } else {
          console.error('获取产品列表失败:', responseData.message || '未知错误')
        }
      } catch (error) {
        console.error('获取贷款产品失败:', error)
        if (error.message.includes('Failed to fetch')) {
          console.log('网络错误，无法连接到服务器')
        }
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

    normalizeLoanProduct(product) {
      const periodType = product.period_type || (product.calcType === 'ONE_TIME' ? 'DAY' : 'MONTH')
      const maxPeriods = product.max_periods || product.termNumber || 1

      return {
        id: String(product.id || product.strategyCode || ''),
        name: product.name || product.strategyName || '贷款产品',
        interest: product.interest || product.annualRate || '0',
        min_principle: product.min_principle || null,
        max_principle: product.max_principle || null,
        min_periods: product.min_periods || 1,
        max_periods: maxPeriods,
        period_type: periodType,
        repay_type: product.repay_type || product.calcType || '',
        grace_term: product.grace_term || 0,
        grace_day: product.grace_day || product.graceDays || 0,
        penalty: product.penalty || product.overdueDailyRate || '0',
        default_rate: product.default_rate || product.overdueDailyRate || '0',
        info: product.info || this.buildStrategyInfo(product),
        rawProduct: product
      }
    },

    buildStrategyInfo(product) {
      const tags = product.extInfo && Array.isArray(product.extInfo.tags) && product.extInfo.tags.length
        ? ` 标签：${product.extInfo.tags.join('、')}`
        : ''
      return `${product.strategyName || '该产品'}，还款方式${this.getRepayTypeText(product.calcType)}，宽限期${product.graceDays || 0}天。${tags}`
    },

    getAmountRangeText(product) {
      if (product.min_principle && product.max_principle) {
        return `${product.min_principle} - ${product.max_principle}元`
      }
      return '以审批结果为准'
    },

    getAmountPlaceholder() {
      if (this.selectedProduct.min_principle && this.selectedProduct.max_principle) {
        return `请输入${this.selectedProduct.min_principle}-${this.selectedProduct.max_principle}元之间的金额`
      }
      return '请输入借款金额'
    },

    getTermRangeText(product) {
      const unit = product.period_type === 'DAY' ? '天' : product.period_type === 'MONTH' ? '个月' : '年'
      return `${product.min_periods || 1} - ${product.max_periods}${unit}`
    },
    
    // 获取期数选项
    getPeriodOptions() {
      if (!this.selectedProduct || !this.selectedProduct.min_periods || !this.selectedProduct.max_periods) {
        return []
      }
      const options = []
      for (let i = this.selectedProduct.min_periods; i <= this.selectedProduct.max_periods; i++) {
        options.push(i)
      }
      return options
    },
    
    // 获取期数单位文本
    getPeriodTypeText() {
      if (!this.selectedProduct || !this.selectedProduct.period_type) return ''
      switch (this.selectedProduct.period_type) {
        case 'DAY': return '天'
        case 'MONTH': return '个月'
        case 'YEAR': return '年'
        default: return '期'
      }
    },
    
    // 获取还款方式文本
    getRepayTypeText(repayType) {
      switch (repayType) {
        case 'EQUAL_PRINCIPAL':
        case 'equal_principal':
          return '等额本金'
        case 'EQUAL_INSTALLMENT':
        case 'equal_principal_interest':
          return '等额本息'
        case 'INTEREST_ONLY':
        case 'bullet':
          return '先息后本'
        default: return repayType
      }
    },
    
    async submitApplication() {
      if (!this.application.amount || !this.application.term) {
        alert('请填写借款金额和期数')
        return
      }
      
      // 验证金额范围
      const amount = parseFloat(this.application.amount)
      const minAmount = parseFloat(this.selectedProduct.min_principle)
      const maxAmount = parseFloat(this.selectedProduct.max_principle)
      
      if (!Number.isNaN(minAmount) && amount < minAmount) {
        alert(`借款金额不能小于${minAmount}元`)
        return
      }

      if (!Number.isNaN(maxAmount) && amount > maxAmount) {
        alert(`借款金额不能大于${maxAmount}元`)
        return
      }
      
      // 验证期数范围
      const term = parseInt(this.application.term)
      const minTerm = parseInt(this.selectedProduct.min_periods)
      const maxTerm = parseInt(this.selectedProduct.max_periods)
      
      if (term < minTerm || term > maxTerm) {
        alert(`借款期数必须在${minTerm}-${maxTerm}之间`)
        return
      }
      
      try {
        // 获取accessToken
        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken) {
          alert('请先登录')
          return
        }
        
        console.log('提交贷款申请:', {
          productId: this.selectedProduct.id,
          amount: this.application.amount,
          term: this.application.term
        })
        
        // 创建请求头
        var myHeaders = new Headers()
        myHeaders.append("Authorization", accessToken)
        myHeaders.append("Content-Type", "application/json")

        // console.log("loan_id:",this.selectedProduct.id)
        //手动构造json格式
        var raw = `{"productId":${this.selectedProduct.id},` +
          `"amount":${this.application.amount},` +
          `"termCount":${this.application.term}}`;
        console.log("raw:",raw)

        // 准备请求数据
        // var raw = JSON.stringify({
        //   "productId": this.selectedProduct.id,
        //   "amount": parseFloat(this.application.amount),
        //   "termCount": parseInt(this.application.term)
        // })
        
        // 配置请求选项
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        }
        
        // 发送申请请求
        const response = await fetch("http://115.190.40.44:45444/loan/loan", requestOptions)
        const result = await response.text()
        
        console.log('申请响应:', result)
        
        // 解析响应数据
        const responseData = JSON.parse(result)
        
        if (responseData.success) {
          // 申请成功，显示成功弹窗
          alert('申请成功，等待管理员审核，可到借款记录中查看')
          this.showApplyModal = false
          
          // 跳转到申请记录页面
          this.$router.push('/loan-records')
        } else {
          // 申请失败
          console.error('申请失败:', responseData.message || '未知错误')
          alert('申请失败: ' + (responseData.message || '请重试'))
        }
      } catch (error) {
        console.error('提交申请失败:', error)
        if (error.message.includes('Failed to fetch')) {
          alert('网络错误，无法连接到服务器')
        } else {
          alert('申请提交失败，请重试')
        }
      }
    }
  }
}
</script>

<style scoped>
.loan {
  min-height: 100vh;
  padding: 16px 14px 98px;
  background:
    radial-gradient(circle at 18% 4%, rgba(50, 179, 151, 0.2), transparent 30%),
    radial-gradient(circle at 86% 8%, rgba(255, 148, 94, 0.2), transparent 28%),
    linear-gradient(180deg, #eef8f6 0%, #f8f3ec 42%, #f5f7fb 100%);
  color: #18212c;
}

.page-header {
  position: relative;
  overflow: hidden;
  padding: 22px;
  margin-bottom: 16px;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(20, 39, 68, 0.96), rgba(23, 115, 108, 0.92) 56%, rgba(255, 136, 87, 0.9));
  color: #fff;
  box-shadow: 0 18px 42px rgba(28, 88, 103, 0.24);
  text-align: left;
}

.page-header::after {
  content: "";
  position: absolute;
  right: -34px;
  top: -44px;
  width: 132px;
  height: 132px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
}

.page-title {
  position: relative;
  z-index: 1;
  margin: 0 0 8px;
  color: #fff;
  font-size: 26px;
  font-weight: 900;
  letter-spacing: 0;
}

.page-subtitle {
  position: relative;
  z-index: 1;
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.76);
  font-weight: 700;
}

.loan-products {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-card {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 24px;
  padding: 18px;
  box-shadow: 0 16px 36px rgba(32, 55, 76, 0.1);
  backdrop-filter: blur(18px);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.product-card::before {
  content: "";
  position: absolute;
  width: 96px;
  height: 96px;
  right: -38px;
  top: -38px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(55, 136, 255, 0.18), rgba(255, 154, 53, 0.2));
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 44px rgba(32, 55, 76, 0.14);
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.product-name {
  position: relative;
  z-index: 1;
  font-size: 18px;
  font-weight: 900;
  color: #1b2734;
  margin: 0 0 6px;
}

.product-desc {
  position: relative;
  z-index: 1;
  font-size: 14px;
  color: #17766f;
  font-weight: 800;
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
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}

.detail-item {
  padding: 12px;
  border-radius: 18px;
  background: #f8fafb;
  box-shadow: inset 0 0 0 1px rgba(231, 235, 241, 0.9);
}

.detail-label {
  display: block;
  font-size: 12px;
  color: #7b8794;
  margin-bottom: 6px;
  font-weight: 700;
}

.detail-value {
  font-size: 14px;
  font-weight: 900;
  color: #26313d;
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
  height: 44px;
  border: 0;
  border-radius: 16px;
  background: linear-gradient(135deg, #142744, #17736c 56%, #ff8857);
  color: #fff;
  font-weight: 900;
  box-shadow: 0 12px 24px rgba(23, 115, 108, 0.2);
}

/* 弹窗样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(16, 29, 43, 0.58);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background: #fff;
  border-radius: 24px;
  width: 100%;
  max-width: 400px;
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

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #1b2734;
  font-weight: 900;
}

.close-btn {
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

.modal-content form {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 800;
  color: #26313d;
}

.input-hint {
  font-size: 12px;
  color: #7b8794;
  margin-bottom: 6px;
  margin-top: -4px;
}

.loan-preview {
  background: linear-gradient(135deg, #eef8f6, #fff4e8);
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: inset 0 0 0 1px rgba(231, 235, 241, 0.9);
}

.loan-preview h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #1b2734;
  font-weight: 900;
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
  color: #17736c;
}

@media (max-width: 480px) {
  .loan {
    padding: 14px 12px 92px;
  }
  
  .product-header {
    flex-direction: column;
    gap: 8px;
  }
  
  .product-details {
    grid-template-columns: 1fr;
  }
  
  .detail-item {
    display: flex;
    justify-content: space-between;
    text-align: left;
  }
}
</style>

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
            <span class="detail-value">{{ product.min_principle }} - {{ product.max_principle }}元</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">借款期限</span>
            <span class="detail-value">0 - {{ product.max_periods }}{{ product.period_type === 'DAY' ? '天' : product.period_type === 'MONTH' ? '个月' : '年' }}</span>
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
              :placeholder="`请输入${selectedProduct.min_principle}-${selectedProduct.max_principle}元之间的金额`"
              :min="selectedProduct.min_principle"
              :max="selectedProduct.max_principle"
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
              :value="selectedProduct.grace_term + '期'"
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
        
        // 从localStorage获取accessToken
        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken) {
          console.error('没有找到accessToken')
          return
        }
        
        // 创建请求头
        var myHeaders = new Headers()
        myHeaders.append("Authorization", accessToken)
        
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        }
        
        // 发送获取产品列表请求
        const response = await fetch("http://115.190.40.44:45444/loan/option", requestOptions)
        const result = await response.text()
        
        // console.log('获取产品列表响应:', result)
        const jsonString = result;
        const fixedJsonString = jsonString.replace(
          /"id":\s*(\d{15,})/g,  // 匹配15位以上的数字id
          '"id":"$1"'  // 添加双引号使其变为字符串
        )
        console.log('获取产品列表响应:', fixedJsonString)
        // 解析响应数据
        const responseData = JSON.parse(fixedJsonString)
        
        if (responseData.success && responseData.products) {
          console.log('获取产品列表成功，共', responseData.products.length, '个产品')
          
          // 将后端数据转换为前端需要的格式
          this.loanProducts = responseData.products.map(product => ({
            id: product.id,
            name: product.name,
            interest: product.interest,
            min_principle: product.min_principle,
            max_principle: product.max_principle,
            min_periods: product.min_periods,
            max_periods: product.max_periods,
            period_type: product.period_type,
            repay_type: product.repay_type,
            grace_term: product.grace_term,
            grace_day: product.grace_day,
            penalty: product.penalty,
            default_rate: product.default_rate,
            info: product.info
          }))

          
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
        case 'EQUAL_PRINCIPAL': return '等额本金'
        case 'EQUAL_INSTALLMENT': return '等额本息'
        case 'INTEREST_ONLY': return '先息后本'
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
      
      if (amount < minAmount || amount > maxAmount) {
        alert(`借款金额必须在${minAmount}-${maxAmount}元之间`)
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

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #212121;
}

.input-hint {
  font-size: 12px;
  color: #757575;
  margin-bottom: 6px;
  margin-top: -4px;
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
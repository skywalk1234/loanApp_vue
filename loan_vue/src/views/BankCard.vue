<template>
  <div class="bank-card">
    <!-- 页面头部 -->
    <div class="page-header">
      <button class="back-btn" @click="goBack">‹</button>
      <h1 class="page-title">绑定银行卡</h1>
    </div>

    <!-- 主要内容区域 -->
    <div class="content">
      <!-- 银行卡信息表单 -->
      <div class="form-section">
        <div class="form-group">
          <label class="form-label">持卡人姓名</label>
          <input 
            type="text" 
            class="form-input" 
            v-model="formData.cardHolder"
            placeholder="请输入持卡人姓名"
          />
        </div>

        <div class="form-group">
          <label class="form-label">银行卡号</label>
          <input 
            type="text" 
            class="form-input" 
            v-model="formData.cardNumber"
            placeholder="请输入银行卡号"
            maxlength="19"
            @input="formatCardNumber"
          />
        </div>

        <div class="form-group">
          <label class="form-label">开户银行</label>
          <select class="form-select" v-model="formData.bankName">
            <option value="">请选择开户银行</option>
            <option value="中国工商银行">中国工商银行</option>
            <option value="中国农业银行">中国农业银行</option>
            <option value="中国银行">中国银行</option>
            <option value="中国建设银行">中国建设银行</option>
            <option value="交通银行">交通银行</option>
            <option value="招商银行">招商银行</option>
            <option value="中信银行">中信银行</option>
            <option value="中国光大银行">中国光大银行</option>
            <option value="华夏银行">华夏银行</option>
            <option value="中国民生银行">中国民生银行</option>
            <option value="广发银行">广发银行</option>
            <option value="平安银行">平安银行</option>
            <option value="兴业银行">兴业银行</option>
            <option value="浦发银行">浦发银行</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">银行预留手机号</label>
          <input 
            type="tel" 
            class="form-input" 
            v-model="formData.phone"
            placeholder="请输入银行预留手机号"
            maxlength="11"
            @input="formatPhone"
          />
        </div>


      </div>

      <!-- 提示信息 -->
      <div class="tips-section">
        <div class="tips-title">温馨提示：</div>
        <ul class="tips-list">
          <li>请确保银行卡信息填写准确，否则可能导致绑定失败</li>
          <li>绑定成功后，该银行卡将作为您的默认收款账户</li>
          <li>为了您的账户安全，请勿绑定他人银行卡</li>
        </ul>
      </div>

      <!-- 提交按钮 -->
      <div class="submit-section">
        <button 
          class="btn btn-primary btn-block"
          @click="submitBinding"
          :disabled="!isFormValid || submitting"
        >
          {{ submitting ? '绑定中...' : '确认绑定' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BankCard',
  data() {
    return {
      formData: {
        cardHolder: '',
        cardNumber: '',
        bankName: '',
        phone: ''
      },
      submitting: false
    }
  },
  computed: {
    isFormValid() {
      return this.formData.cardHolder && 
             this.formData.cardNumber && 
             this.formData.bankName && 
             this.formData.phone &&
             this.formData.cardNumber.length >= 16 &&
             this.formData.phone.length === 11
    }
  },
  methods: {
    
    formatCardNumber() {
      // 格式化银行卡号，每4位加空格
      let value = this.formData.cardNumber.replace(/\s/g, '').replace(/[^0-9]/gi, '')
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
      this.formData.cardNumber = formattedValue
    },
    
    formatPhone() {
      // 只允许数字
      this.formData.phone = this.formData.phone.replace(/[^0-9]/gi, '')
    },
    
    async submitBinding() {
      if (!this.isFormValid) {
        alert('请填写完整信息')
        return
      }
      
      this.submitting = true
      
      try {
        // 模拟提交绑定
        console.log('提交银行卡绑定:', this.formData)
        
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 模拟成功响应
        alert('银行卡绑定成功！')
        
        // 更新本地存储
        localStorage.setItem('hasBankCard', 'true')
        
        // 返回上一页
        this.goBack()
        
      } catch (error) {
        console.error('银行卡绑定失败:', error)
        alert('银行卡绑定失败，请检查信息是否正确')
      } finally {
        this.submitting = false
      }
    },
    
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.bank-card {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-header {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  font-size: 24px;
  color: #666;
  background: none;
  border: none;
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
  font-weight: 500;
  color: #333;
  margin: 0;
}

.content {
  padding: 16px;
}

.form-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #fff;
}

.form-input:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}

.form-input:disabled {
  background: #f5f5f5;
  color: #999;
}

.form-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  font-size: 16px;
  background: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.form-select:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}



.tips-section {
  background: #e3f2fd;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.tips-title {
  font-size: 14px;
  font-weight: 500;
  color: #1976d2;
  margin-bottom: 8px;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  padding-left: 16px;
  position: relative;
}

.tips-list li:before {
  content: '•';
  color: #1976d2;
  position: absolute;
  left: 0;
}

.submit-section {
  padding: 0 16px 20px;
}

.btn {
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
  box-shadow: 0 6px 16px rgba(25, 118, 210, 0.4);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-block {
  width: 100%;
  display: block;
}

@media (max-width: 480px) {
  .content {
    padding: 12px;
  }
  
  .form-section {
    padding: 16px;
  }
  
  .submit-section {
    padding: 0 12px 16px;
  }
}
</style>
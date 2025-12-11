<template>
  <div class="login-container">
    <div class="login-header">
      <h1 class="app-title">LoanApp</h1>
      <p class="app-subtitle">安全便捷的贷款服务平台</p>
    </div>
    
    <div class="login-form">
      <div class="login-tabs">
        <button 
          class="tab-btn"
          :class="{ active: loginType === 'password' }"
          @click="loginType = 'password'"
        >
          密码登录
        </button>
        <button 
          class="tab-btn"
          :class="{ active: loginType === 'email' }"
          @click="loginType = 'email'"
        >
          邮箱验证码登录
        </button>
      </div>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input 
            v-model="form.account"
            type="text" 
            class="form-input"
            :placeholder="loginType === 'password' ? '请输入手机号/邮箱' : '请输入邮箱'"
            required
          >
        </div>
        
        <div class="form-group" v-if="loginType === 'password'">
          <input 
            v-model="form.password"
            type="password" 
            class="form-input"
            placeholder="请输入密码"
            required
          >
        </div>
        
        <div class="form-group" v-if="loginType === 'email'">
          <div class="verify-group">
            <input 
              v-model="form.verifyCode"
              type="text" 
              class="form-input verify-input"
              placeholder="请输入验证码"
              required
            >
            <button 
              type="button" 
              class="verify-btn"
              @click="sendVerifyCode"
              :disabled="countdown > 0"
            >
              {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
            </button>
          </div>
        </div>
        
        <button type="submit" class="btn btn-primary btn-block">
          登录
        </button>
      </form>
      
      <div class="form-footer">
        <router-link to="/register" class="link-text">
          还没有账号？立即注册
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginType: 'password',
      form: {
        account: '',
        password: '',
        verifyCode: ''
      },
      countdown: 0
    }
  },
  methods: {
    handleLogin() {
      // 模拟登录请求
      console.log('登录信息:', this.form)
      
      // 模拟登录成功
      localStorage.setItem('token', 'mock_token')
      localStorage.setItem('user', JSON.stringify({
        name: '用户' + Math.floor(Math.random() * 1000),
        phone: this.form.account
      }))
      
      this.$router.push('/home')
    },
    
    sendVerifyCode() {
      if (!this.form.account) {
        alert('请输入邮箱地址')
        return
      }
      
      // 模拟发送验证码
      console.log('发送验证码到:', this.form.account)
      
      // 开始倒计时
      this.countdown = 60
      const timer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          clearInterval(timer)
        }
      }, 1000)
      
      alert('验证码已发送，请查收邮箱')
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e88e5 0%, #42a5f5 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
}

.login-header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.app-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 8px;
}

.app-subtitle {
  font-size: 16px;
  opacity: 0.9;
}

.login-form {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.login-tabs {
  display: flex;
  margin-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;
}

.tab-btn {
  flex: 1;
  background: none;
  border: none;
  padding: 12px;
  font-size: 16px;
  color: #757575;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.tab-btn.active {
  color: #1e88e5;
  border-bottom-color: #1e88e5;
}

.verify-group {
  display: flex;
  gap: 12px;
}

.verify-input {
  flex: 1;
}

.verify-btn {
  background: #1e88e5;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.3s ease;
}

.verify-btn:hover {
  background: #1976d2;
}

.verify-btn:disabled {
  background: #bdbdbd;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
  margin-top: 24px;
}

.link-text {
  color: #1e88e5;
  text-decoration: none;
  font-size: 14px;
}

.link-text:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-container {
    padding: 16px;
  }
  
  .login-form {
    padding: 24px;
  }
  
  .app-title {
    font-size: 36px;
  }
}
</style>
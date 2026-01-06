<template>
  <div class="login-container">
    <!-- 装饰性背景元素 -->
    <div class="bg-decoration bg-circle-1"></div>
    <div class="bg-decoration bg-circle-2"></div>
    <div class="bg-decoration bg-circle-3"></div>
    
    <div class="login-header">
      <h1 class="app-title">LoanApp</h1>
      <p class="app-subtitle">安全便捷的贷款服务平台</p>
    </div>
    
    <div class="login-form">
      <!-- 登录方式切换 -->
      <div class="login-type-switch">
        <button 
          :class="['type-btn', loginType === 'account' ? 'active' : '']"
          @click="loginType = 'account'"
        >
          用户名登录
        </button>
        <button 
          :class="['type-btn', loginType === 'email' ? 'active' : '']"
          @click="loginType = 'email'"
        >
          邮箱登录
        </button>
      </div>
      
      <!-- 用户名密码登录 -->
      <form v-if="loginType === 'account'" @submit.prevent="handleLogin">
        <div class="form-group">
          <input 
            v-model="form.account"
            type="text" 
            class="form-input"
            placeholder="请输入用户名"
            required
          >
        </div>
        
        <div class="form-group">
          <input 
            v-model="form.password"
            type="password" 
            class="form-input"
            placeholder="请输入密码"
            required
          >
        </div>
        
        <button type="submit" class="btn btn-primary btn-block">
          登录
        </button>
      </form>
      
      <!-- 邮箱验证码登录 -->
      <form v-if="loginType === 'email'" @submit.prevent="handleEmailLogin">
        <div class="form-group">
          <input 
            v-model="emailForm.email"
            type="email" 
            class="form-input"
            placeholder="请输入邮箱地址"
            required
          >
        </div>
        
        <div class="form-group verify-code-group">
          <input 
            v-model="emailForm.verifyCode"
            type="text" 
            class="form-input verify-input"
            placeholder="请输入验证码"
            required
          >
          <button 
            type="button" 
            class="btn btn-secondary verify-btn"
            @click="sendEmailCode"
            :disabled="emailCodeCountdown > 0"
          >
            {{ emailCodeCountdown > 0 ? `${emailCodeCountdown}秒后重试` : '发送验证码' }}
          </button>
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
      loginType: 'account', // 'account' 或 'email'
      form: {
        account: '',
        password: ''
      },
      emailForm: {
        email: '',
        verifyCode: ''
      },
      emailCodeSent: false,
      emailCodeCountdown: 0
    }
  },
  
  methods: {
    // 发送邮箱验证码
    sendEmailCode() {
      console.log('发送邮箱验证码:', this.emailForm.email);
      
      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.emailForm.email)) {
        alert('请输入正确的邮箱地址');
        return;
      }
      
      // TODO: 调用发送验证码API
      console.log('预留接口：发送验证码到邮箱', this.emailForm.email);
      
      // 模拟发送成功
      this.emailCodeSent = true;
      this.startEmailCodeCountdown();
      alert('验证码已发送到您的邮箱');
    },
    
    // 开始邮箱验证码倒计时
    startEmailCodeCountdown() {
      this.emailCodeCountdown = 60;
      const timer = setInterval(() => {
        this.emailCodeCountdown--;
        if (this.emailCodeCountdown <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    },
    
    // 邮箱验证码登录
    handleEmailLogin() {
      console.log('开始邮箱验证码登录...');
      console.log('邮箱:', this.emailForm.email);
      console.log('验证码:', this.emailForm.verifyCode);
      
      // 验证输入
      if (!this.emailForm.email || !this.emailForm.verifyCode) {
        alert('请填写完整的邮箱和验证码');
        return;
      }
      
      // TODO: 调用邮箱验证码登录API
      console.log('预留接口：邮箱验证码登录');
      console.log('请求数据:', {
        email: this.emailForm.email,
        verifyCode: this.emailForm.verifyCode
      });
      
      // 模拟登录成功（实际使用时删除此模拟逻辑）
      alert('邮箱登录功能已预留接口，实际使用时需要接入后端API');
      
      /* 实际API调用示例（取消注释并修改URL）：
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      
      var raw = JSON.stringify({
        "email": this.emailForm.email,
        "verifyCode": this.emailForm.verifyCode
      });
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      
      fetch("http://your-api-server/emailLogin", requestOptions)
        .then(response => response.text())
        .then(result => {
          const responseData = JSON.parse(result);
          if (responseData.success) {
            // 保存token和用户信息
            localStorage.setItem('accessToken', responseData.accessToken);
            localStorage.setItem('user', JSON.stringify(responseData.user));
            // 跳转到首页
            this.$router.push('/home');
          } else {
            alert('登录失败: ' + (responseData.message || '验证码错误'));
          }
        })
        .catch(error => {
          console.log('邮箱登录错误:', error);
          alert('登录失败: 网络错误或服务器不可用');
        });
      */
    },
    
    // 原有的用户名密码登录方法
    handleLogin() {
      console.log('开始登录流程...');
      console.log('用户名:', this.form.account);
      
      // 创建请求头
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      
      // 准备请求数据
      var raw = JSON.stringify({
        "username": this.form.account,
        "pwd": this.form.password,
        "force": true
      });
      
      console.log('请求数据:', raw);
      
      // 配置请求选项
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      
      // 发送登录请求
      fetch("http://115.190.40.44:45444/user/login", requestOptions)
        .then(response => {
          console.log('响应状态:', response.status);
          return response.text();
        })
        .then(result => {
          console.log('登录响应:', result);
          
          // 解析响应数据
          try {
            const responseData = JSON.parse(result);
            console.log('解析后的响应数据:', responseData);
            
            if (responseData.success) {
              console.log('登录成功，开始保存token...');
              // 保存token到localStorage
              localStorage.setItem('accessToken', responseData.accessToken);
              localStorage.setItem('refreshToken', responseData.refreshToken);
              
              // 保存用户信息
              localStorage.setItem('user', JSON.stringify({
                name: this.form.account,
                phone: this.form.account
              }));
              
              console.log('token保存完成，准备跳转...');
              
              // 跳转到首页
              this.$router.push('/home').then(() => {
                console.log('路由跳转成功');
              }).catch(err => {
                console.log('路由跳转错误:', err);
                // 如果跳转失败，强制刷新页面
                console.log('使用强制跳转');
                window.location.href = '/home';
              });
            } else {
              alert('登录失败: ' + (responseData.message || '未知错误'));
            }
          } catch (e) {
            console.error('解析响应失败:', e);
            alert('登录失败: 响应格式错误');
          }
        })
        .catch(error => {
          console.log('登录错误:', error);
          alert('登录失败: 网络错误或服务器不可用');
        });
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e88e5 0%, #64b5f6 50%, #90caf9 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    linear-gradient(45deg, transparent 49%, rgba(255, 255, 255, 0.05) 50%, transparent 51%),
    linear-gradient(-45deg, transparent 49%, rgba(255, 255, 255, 0.05) 50%, transparent 51%);
  background-size: 100% 100%, 100% 100%, 20px 20px, 20px 20px;
  animation: backgroundMove 20s ease-in-out infinite;
}

@keyframes backgroundMove {
  0%, 100% { transform: translateX(0) translateY(0); }
  25% { transform: translateX(-5px) translateY(-5px); }
  50% { transform: translateX(5px) translateY(-5px); }
  75% { transform: translateX(-5px) translateY(5px); }
}

/* 装饰性背景元素 */
.bg-decoration {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.bg-circle-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.bg-circle-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.bg-circle-3 {
  width: 60px;
  height: 60px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.login-header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
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
  position: relative;
  z-index: 1;
}

/* 基础按钮样式 */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: #1e88e5;
  color: white;
}

.btn-primary:hover {
  background: #1976d2;
}

.btn-secondary {
  background: #757575;
  color: white;
}

.btn-secondary:hover {
  background: #616161;
}

.btn-block {
  display: block;
  width: 100%;
}

/* 基础输入框样式 */
.form-group {
  margin-bottom: 16px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #1e88e5;
}

.form-input::placeholder {
  color: #999;
}

/* 登录方式切换样式 */
.login-type-switch {
  display: flex;
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.type-btn {
  flex: 1;
  padding: 12px;
  border: none;
  background: #f5f5f5;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-btn:hover {
  background: #e8e8e8;
}

.type-btn.active {
  background: #1e88e5;
  color: white;
}

/* 验证码输入组样式 */
.verify-code-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.verify-input {
  flex: 1;
}

.verify-btn {
  width: 120px;
  padding: 12px 16px;
  font-size: 14px;
  white-space: nowrap;
}

.verify-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 表单底部样式 */
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
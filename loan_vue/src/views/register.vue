<template>
  <div class="register-container">
    <div class="register-header">
      <h1 class="page-title">注册账号</h1>
      <p class="subtitle">创建您的贷款账户</p>
    </div>
    
    <div class="register-form">
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label class="form-label">昵称</label>
          <input 
            v-model="form.nickname"
            type="text" 
            class="form-input"
            placeholder="请输入昵称"
            required
          >
        </div>
        
        <div class="form-group">
          <label class="form-label">手机号码</label>
          <input 
            v-model="form.phone"
            type="tel" 
            class="form-input"
            placeholder="请输入手机号码"
            required
          >
        </div>
        
        <div class="form-group">
          <label class="form-label">设置密码</label>
          <input 
            v-model="form.password"
            type="password" 
            class="form-input"
            placeholder="请输入6-20位密码"
            required
          >
        </div>
        
        <div class="form-group">
          <label class="form-label">确认密码</label>
          <input 
            v-model="form.confirmPassword"
            type="password" 
            class="form-input"
            placeholder="请再次输入密码"
            required
          >
        </div>
        
        <div class="form-group">
          <label class="form-label">电子邮箱</label>
          <input 
            v-model="form.email"
            type="email" 
            class="form-input"
            placeholder="请输入邮箱地址"
            required
          >
        </div>
        
        <div class="form-group">
          <label class="form-label">邮箱验证码</label>
          <div class="verify-group">
            <input 
              v-model="form.emailCode"
              type="text" 
              class="form-input verify-input"
              placeholder="请输入验证码"
              required
            >
            <button 
              type="button" 
              class="verify-btn"
              @click="sendEmailCode"
              :disabled="countdown > 0"
            >
              {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
            </button>
          </div>
        </div>
        
        <div class="form-group">
          <label class="checkbox-label">
            <input 
              v-model="form.agree"
              type="checkbox" 
              required
            >
            我已阅读并同意《用户服务协议》和《隐私政策》
          </label>
        </div>
        
        <button type="submit" class="btn btn-primary btn-block">
          立即注册
        </button>
      </form>
      
      <div class="form-footer">
        <p>已有账号？<router-link to="/login" class="link-text">立即登录</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      form: {
        nickname: '',
        phone: '',
        password: '',
        confirmPassword: '',
        email: '',
        emailCode: '',
        agree: false
      },
      countdown: 0
    }
  },
  methods: {
    handleRegister() {
      // 验证密码一致性
      if (this.form.password !== this.form.confirmPassword) {
        alert('两次输入的密码不一致')
        return
      }
      
      // 验证手机号格式
      if (!/^1[3-9]\d{9}$/.test(this.form.phone)) {
        alert('请输入正确的手机号码')
        return
      }
      
      // 验证邮箱格式
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        alert('请输入正确的邮箱地址')
        return
      }
      
      // 验证是否已发送验证码
      if (!this.form.emailCode) {
        alert('请输入邮箱验证码')
        return
      }
      
      // 获取保存的邮箱验证token
      const emailVerifyToken = localStorage.getItem('emailVerifyToken');
      if (!emailVerifyToken) {
        alert('请先发送邮箱验证码')
        return
      }
      
      console.log('开始注册流程...')
      
      // 创建请求头
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      
      // 准备注册数据 - 严格按照API文档格式
      var raw = JSON.stringify({
        "username": this.form.nickname,  // 对应表单中的nickname
        "pwd": this.form.password,       // 对应password
        "phone": this.form.phone,
        "email": this.form.email,
        "code": this.form.emailCode,     // 对应emailCode
        "token": emailVerifyToken       // 从localStorage中的emailVerifyToken字段获取
      });
      
      console.log('注册请求数据:', raw)
      
      // 配置请求选项
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      
      // 发送注册请求 - 只使用POST请求体，URL不带参数
      fetch("http://115.190.40.44:45444/user/register", requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log('注册响应:', result);
          
          // 解析响应数据
          try {
            const responseData = JSON.parse(result);
            
            if (responseData.success) {
              console.log('注册成功');
              
              // 清除localStorage中的邮箱验证token
              localStorage.removeItem('emailVerifyToken');
              
              alert('注册成功！请登录')
              this.$router.push('/login')
            } else {
              alert('注册失败: ' + (responseData.message || '未知错误'));
            }
          } catch (e) {
            console.error('解析响应失败:', e);
            alert('注册失败: 响应格式错误');
          }
        })
        .catch(error => {
          console.log('注册错误:', error);
          alert('注册失败: 网络错误或服务器不可用');
        });
    },
    
    sendEmailCode() {
      if (!this.form.email) {
        alert('请输入邮箱地址')
        return
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        alert('请输入正确的邮箱地址')
        return
      }
      
      console.log('开始发送验证码到:', this.form.email)
      
      // 创建请求头
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      
      // 准备请求数据
      var raw = JSON.stringify({
        "email": this.form.email
      });
      
      // 配置请求选项
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      
      // 发送验证码请求
      fetch("http://115.190.40.44:45444/user/registerVerifyCode", requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log('验证码发送响应:', result);
          
          // 解析响应数据
          try {
            const responseData = JSON.parse(result);
            
            if (responseData.success) {
              // 保存token到localStorage
              localStorage.setItem('emailVerifyToken', responseData.token);
              console.log('验证码发送成功，token已保存:', responseData.token);
              
              // 开始倒计时
              this.countdown = 60
              const timer = setInterval(() => {
                this.countdown--
                if (this.countdown <= 0) {
                  clearInterval(timer)
                }
              }, 1000)
              
              alert('验证码已发送到您的邮箱，请查收')
            } else {
              alert('验证码发送失败: ' + (responseData.message || '未知错误'));
            }
          } catch (e) {
            console.error('解析响应失败:', e);
            alert('验证码发送失败: 响应格式错误');
          }
        })
        .catch(error => {
          console.log('验证码发送错误:', error);
          alert('验证码发送失败: 网络错误或服务器不可用');
        });
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e88e5 0%, #42a5f5 100%);
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.register-header {
  text-align: center;
  color: white;
  margin-bottom: 20px;
}

.page-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
  color: white;
}

.subtitle {
  font-size: 16px;
  opacity: 0.9;
}

.register-form {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  flex: 1;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 20px;
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

.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #757575;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 8px;
}

.form-footer {
  text-align: center;
  margin-top: 24px;
}

.link-text {
  color: #1e88e5;
  text-decoration: none;
}

.link-text:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register-container {
    padding: 16px;
  }
  
  .register-form {
    padding: 24px;
  }
  
  .page-title {
    font-size: 28px;
  }
}
</style>
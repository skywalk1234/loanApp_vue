<template>
  <div class="login-container">
    <div class="login-header">
      <h1 class="app-title">LoanApp</h1>
      <p class="app-subtitle">安全便捷的贷款服务平台</p>
    </div>
    
    <div class="login-form">
      <form @submit.prevent="handleLogin">
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
      form: {
        account: '',
        password: ''
      }
    }
  },
  methods: {
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



.form-group {
    margin-bottom: 16px;
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
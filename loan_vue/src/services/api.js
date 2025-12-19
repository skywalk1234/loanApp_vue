import axios from 'axios'
import tokenService from './token'

// 创建axios实例
const api = axios.create({
  baseURL: 'http://115.190.40.44:45444',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加一个通用的请求方法，自动处理token刷新
const requestWithTokenRefresh = async (requestFunc) => {
  try {
    // 先尝试正常请求
    return await requestFunc()
  } catch (error) {
    // 如果返回401错误，尝试刷新token
    if (error.response && error.response.status === 401) {
      console.log('Token过期，尝试刷新...')
      const refreshSuccess = await tokenService.refreshAccessToken()
      
      if (refreshSuccess) {
        console.log('Token刷新成功，重试原请求...')
        // 刷新成功后重试原请求
        return await requestFunc()
      } else {
        console.log('Token刷新失败，需要重新登录')
        // 刷新失败，清除token并跳转到登录页
        tokenService.clearTokens()
        window.location.href = '/login'
        throw error
      }
    }
    throw error
  }
}

// 请求拦截器
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response) {
      if (error.response.status === 401) {
        // 清除token并跳转到登录页
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
      return Promise.reject(error.response.data)
    }
    return Promise.reject(error)
  }
)

// API服务
const apiService = {
  // 用户认证相关
  auth: {
    // 用户登录
    login(credentials) {
      return api.post('/auth/login', credentials)
    },
    
    // 用户注册
    register(userData) {
      return api.post('/auth/register', userData)
    },
    
    // 发送邮箱验证码
    sendEmailCode(email) {
      return api.post('/auth/send-email-code', { email })
    },
    
    // 验证邮箱验证码
    verifyEmailCode(email, code) {
      return api.post('/auth/verify-email-code', { email, code })
    },
    
    // 退出登录
    logout() {
      return api.post('/auth/logout')
    },
    
    // 刷新accessToken（使用原生fetch以保持与现有代码的一致性）
    async refreshAccessToken() {
      return await tokenService.refreshAccessToken()
    }
  },
  
  // 用户信息相关
  user: {
    // 获取用户信息
    getUserInfo() {
      return api.get('/user/info')
    },
    
    // 更新用户信息
    updateUserInfo(userData) {
      return api.put('/user/info', userData)
    },
    
    // 获取用户信用信息
    getCreditInfo() {
      return api.get('/user/credit-info')
    },
    
    // 实名认证
    realNameAuth(authData) {
      return api.post('/user/real-name-auth', authData)
    },
    
    // 绑定银行卡
    bindBankCard(cardData) {
      return api.post('/user/bind-bank-card', cardData)
    }
  },
  
  // 贷款产品相关
  loan: {
    // 获取贷款产品列表
    getLoanProducts() {
      return api.get('/loan/products')
    },
    
    // 获取贷款产品详情
    getLoanProductDetail(productId) {
      return api.get(`/loan/products/${productId}`)
    },
    
    // 申请贷款
    applyLoan(loanData) {
      return api.post('/loan/apply', loanData)
    },
    
    // 获取借款记录
    getLoanRecords(params = {}) {
      return api.get('/loan/orderList', { params })
    },
    
    // 获取借款详情
    getLoanDetail(loanId) {
      return api.get(`/loan/records/${loanId}`)
    }
  },
  
  // 还款相关
  repayment: {
    // 获取还款计划
    getRepaymentPlans(loanId) {
      return api.get(`/repayment/plans/${loanId}`)
    },
    
    // 正常还款
    makeRepayment(repaymentData) {
      return api.post('/repayment/make', repaymentData)
    },
    
    // 提前还款
    earlyRepayment(repaymentData) {
      return api.post('/repayment/early', repaymentData)
    },
    
    // 获取还款记录
    getRepaymentRecords(params = {}) {
      return api.get('/repayment/records', { params })
    }
  },
  
  // 消息相关
  message: {
    // 获取消息列表
    getMessages(params = {}) {
      return api.get('/messages', { params })
    },
    
    // 获取消息详情
    getMessageDetail(messageId) {
      return api.get(`/messages/${messageId}`)
    },
    
    // 标记消息已读
    markAsRead(messageId) {
      return api.put(`/messages/${messageId}/read`)
    },
    
    // 删除消息
    deleteMessage(messageId) {
      return api.delete(`/messages/${messageId}`)
    }
  },
  
  // 文件上传相关
  upload: {
    // 上传头像
    uploadAvatar(file) {
      const formData = new FormData()
      formData.append('avatar', file)
      return api.post('/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },
    
    // 上传身份证照片
    uploadIdCard(file) {
      const formData = new FormData()
      formData.append('idCard', file)
      return api.post('/upload/id-card', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }
  }
}

// 将API服务挂载到Vue原型上
export default {
  install(app) {
    app.config.globalProperties.$api = apiService
  }
}

export { apiService, tokenService, requestWithTokenRefresh }
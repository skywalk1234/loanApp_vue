/**
 * Token服务模块
 * 用于处理accessToken的刷新和管理
 */

const API_BASE_URL = 'http://115.190.40.44:45444'

class TokenService {
  /**
   * 刷新accessToken
   * @returns {Promise<boolean>} 刷新成功返回true，失败返回false
   */
  async refreshAccessToken() {
    try {
      // 从localStorage获取refreshToken
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        console.log('没有找到refreshToken，跳过刷新')
        return false
      }

      console.log('开始刷新accessToken...')

      // 创建请求头
      const myHeaders = new Headers()
      myHeaders.append("Authorization", "")
      myHeaders.append("Content-Type", "application/json")

      // 准备请求数据
      const raw = JSON.stringify({
        "refresh_token": refreshToken
      })

      // 配置请求选项
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      }

      // 发送刷新token请求
      const response = await fetch(`${API_BASE_URL}/refresh`, requestOptions)
      const result = await response.text()

      console.log('刷新token响应:', result)

      // 解析响应数据
      const responseData = JSON.parse(result)

      if (responseData.success) {
        console.log('token刷新成功，更新localStorage...')

        // 更新localStorage中的token
        localStorage.setItem('accessToken', responseData.accessToken)
        localStorage.setItem('refreshToken', responseData.refreshToken)

        console.log('token更新完成')
        return true
      } else {
        console.error('刷新token失败:', responseData.message || '未知错误')
        // 如果刷新失败，可能需要重新登录
        if (responseData.errCode === 401) {
          console.log('刷新token无效，需要重新登录')
          // 可以选择跳转到登录页面
          // this.$router.push('/login')
        }
        return false
      }
    } catch (error) {
      console.error('刷新token错误:', error)
      // 网络错误或服务器错误
      if (error.message.includes('Failed to fetch')) {
        console.log('网络错误，无法连接到服务器')
      }
      return false
    }
  }

  /**
   * 获取当前accessToken
   * @returns {string|null} accessToken或null
   */
  getAccessToken() {
    return localStorage.getItem('accessToken')
  }

  /**
   * 获取当前refreshToken
   * @returns {string|null} refreshToken或null
   */
  getRefreshToken() {
    return localStorage.getItem('refreshToken')
  }

  /**
   * 设置token
   * @param {string} accessToken - accessToken
   * @param {string} refreshToken - refreshToken
   */
  setTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }

  /**
   * 清除token
   */
  clearTokens() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  /**
   * 检查是否需要刷新token（可以添加过期时间检查逻辑）
   * @returns {boolean} 是否需要刷新
   */
  shouldRefreshToken() {
    const accessToken = this.getAccessToken()
    const refreshToken = this.getRefreshToken()
    
    // 简单的检查逻辑：如果没有accessToken但有refreshToken，则需要刷新
    // 可以根据实际需求添加更复杂的过期时间检查
    return !accessToken && refreshToken
  }
}

// 创建单例实例
const tokenService = new TokenService()

export default tokenService
export { TokenService }
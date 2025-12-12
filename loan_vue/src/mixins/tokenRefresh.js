/**
 * Token刷新Mixin
 * 在页面加载时自动刷新accessToken
 */
import { tokenService } from '@/services/api'

export default {
  async created() {
    // 页面创建时自动刷新token
    if (this.shouldRefreshTokenOnLoad !== false) {
      try {
        console.log(`进入${this.$options.name || '页面'}，刷新accessToken...`)
        await tokenService.refreshAccessToken()
      } catch (error) {
        console.error('Token刷新失败:', error)
      }
    }
  }
}
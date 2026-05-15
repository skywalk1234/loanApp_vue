<template>
  <div class="bottom-nav">
    <router-link 
      to="/home" 
      class="nav-item"
      :class="{ active: $route.path === '/home' }"
    >
      <i class="nav-icon">🏠</i>
      <span>首页</span>
    </router-link>
    <router-link 
      to="/loan" 
      class="nav-item"
      :class="{ active: $route.path === '/loan' }"
    >
      <i class="nav-icon">💰</i>
      <span>贷款</span>
    </router-link>
    <router-link 
      to="/message" 
      class="nav-item"
      :class="{ active: $route.path === '/message' }"
    >
      <div class="nav-icon-wrapper">
        <i class="nav-icon">💬</i>
        <span v-if="unreadCount > 0" class="notification-dot"></span>
      </div>
      <span>消息</span>
    </router-link>
    <router-link 
      to="/profile" 
      class="nav-item"
      :class="{ active: $route.path === '/profile' }"
    >
      <i class="nav-icon">👤</i>
      <span>个人</span>
    </router-link>
  </div>
</template>

<script>
import { unreadCount } from '@/stores/messageStore'

export default {
  name: 'BottomNav',
  computed: {
    unreadCount() {
      return unreadCount.value
    }
  }
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 6px 0;
  padding-bottom: max(6px, env(safe-area-inset-bottom));
  z-index: 1000;
  height: 64px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  border-top: 1px solid rgba(231, 235, 241, 0.8);
  box-shadow: 0 -8px 32px rgba(32, 55, 76, 0.08);
}

.nav-item {
  flex: 1;
  text-align: center;
  padding: 2px 6px;
  color: #8a96a3;
  text-decoration: none;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  position: relative;
}

.nav-item .nav-icon {
  display: block;
  font-size: 22px;
  line-height: 1.3;
  transition: transform 0.25s ease;
  filter: grayscale(0.6);
  opacity: 0.7;
}

.nav-item span {
  font-size: 10px;
  font-weight: 800;
  display: block;
  letter-spacing: 0.3px;
  color: inherit;
  transition: color 0.25s ease;
}

.nav-item.active {
  color: #17736c;
}

.nav-item.active .nav-icon {
  transform: translateY(-1px) scale(1.08);
  filter: grayscale(0);
  opacity: 1;
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(135deg, #17736c, #20b883);
  box-shadow: 0 2px 8px rgba(23, 115, 108, 0.35);
}

.nav-item:hover .nav-icon {
  transform: translateY(-1px);
}

.nav-icon-wrapper {
  position: relative;
  display: inline-block;
  line-height: 1.3;
}

.notification-dot {
  position: absolute;
  top: 0;
  right: -5px;
  width: 7px;
  height: 7px;
  background: linear-gradient(135deg, #ff6b6b, #ee4444);
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.9);
  animation: pulse 2s infinite;
  box-shadow: 0 1px 4px rgba(238, 68, 68, 0.35);
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.25); opacity: 0.75; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
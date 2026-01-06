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
  background: white;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-around;
  padding: 6px 0;
  z-index: 1000;
  height: 56px;
}

.nav-item {
  flex: 1;
  text-align: center;
  padding: 4px;
  color: #757575;
  text-decoration: none;
  transition: color 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.nav-item.active {
  color: #1e88e5;
}

.nav-icon {
  display: block;
  font-size: 20px;
  margin-bottom: 2px;
}

.nav-item span {
  font-size: 11px;
  display: block;
}

.nav-icon-wrapper {
  position: relative;
  display: inline-block;
}

.notification-dot {
  position: absolute;
  top: -2px;
  right: -4px;
  width: 8px;
  height: 8px;
  background-color: #ff4444;
  border-radius: 50%;
  border: 1px solid white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
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
      <i class="nav-icon">💬</i>
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
export default {
  name: 'BottomNav'
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
  padding: 8px 0;
  z-index: 1000;
}

.nav-item {
  flex: 1;
  text-align: center;
  padding: 8px;
  color: #757575;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-item.active {
  color: #1e88e5;
}

.nav-icon {
  display: block;
  font-size: 24px;
  margin-bottom: 4px;
}

.nav-item span {
  font-size: 12px;
  display: block;
}
</style>
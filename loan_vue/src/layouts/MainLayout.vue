<template>
  <div class="main-layout">
    <div class="main-content">
      <router-view />
    </div>
    <BottomNav />
  </div>
</template>

<script>
import BottomNav from '../components/BottomNav.vue'

export default {
  name: 'MainLayout',
  components: {
    BottomNav
  }
}
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.main-content {
  padding-bottom: 80px;
}
</style>
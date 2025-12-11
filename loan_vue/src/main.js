import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import api from './services/api'

const app = createApp(App)

app.use(router)
app.use(api)

app.mount('#app')

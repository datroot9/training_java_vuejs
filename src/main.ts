import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router) // Đính kèm router vào trong lõi Vue

app.mount('#app')

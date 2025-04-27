import './assets/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { changeColor } from './directives/color'
const pinia = createPinia()
const app = createApp(App)
app.directive('changeColor',changeColor)
app.use(router)
app.use(pinia)
app.mount('#app')

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import 'element-plus/dist/index.css' // 新增：引入 Element Plus 全局样式
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'//引入icon
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


const app = createApp(App)
const pinia = createPinia()
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}//引入icon
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.mount('#app')
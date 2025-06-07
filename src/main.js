import { createApp } from 'vue'
import './style.css'
import 'element-plus/dist/index.css' // 新增：引入 Element Plus 全局样式
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'//


const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}//引入icon
app.use(router)
app.mount('#app')

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import { i18n } from './locale'
import { useThemeStore } from './stores/theme'
import './styles/base.css'
import './styles/animations.css'
import './styles/markdown.css'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(i18n)

// Initialize theme before mount
const themeStore = useThemeStore()
themeStore.init()

app.mount('#app')

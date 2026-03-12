import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import WebPlus from '@lingshugroup/web-plus'
import '@lingshugroup/web-plus/index.css';

const app = createApp(App)
app.use(ElementPlus)
app.use(WebPlus)
app.mount('#app')
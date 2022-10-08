import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './mock'

import 'normalize.css'
import '@/assets/styles/common.less'
// 引入自定义插件
import UI from './components/library/index'

const app = createApp(App)

app.use(router)
app.use(store)
// 使用自定义插件
app.use(UI)

app.mount('#app')

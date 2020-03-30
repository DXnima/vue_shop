import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

//导入全局样式表
import './assets/css/global.css'
//导入
import TreeTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', TreeTable)

//导入axios
import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL='http://39.97.126.50:8888/api/private/v1/'
// 请求拦截 请求头添加token
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem("token")
  return config
})
Vue.prototype.$http=axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

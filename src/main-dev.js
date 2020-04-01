import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

//导入全局样式表
import './assets/css/global.css'
//导入
import TreeTable from 'vue-table-with-tree-grid'
//导入加载 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)

//导入axios
import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL='http://39.97.126.50:8888/api/private/v1/'
// 请求拦截 请求头添加token request展示进度条 NProgress.start()
axios.interceptors.request.use(config=>{
  NProgress.start()
  config.headers.Authorization=window.sessionStorage.getItem("token")
  return config
})
//response隐藏进度条 NProgress.done()
axios.interceptors.response.use(config=>{
  NProgress.done()
  return config
})
Vue.prototype.$http=axios

Vue.config.productionTip = false

//格式化时间组件
Vue.filter('dateFormat',function (originVal) {
  const dt=new Date(originVal)

  const y=dt.getFullYear()
  const m=(dt.getMonth()+1+'').padStart(2,'0')
  const d=(dt.getDay()+'').padStart(2,'0')

  const hh=(dt.getHours()+'').padStart(2,'0')
  const mm=(dt.getMinutes()+'').padStart(2,'0')
  const ss=(dt.getSeconds()+'').padStart(2,'0')
  return  `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  { path:'/', redirect:'/login'},
  { path: '/login' , component: Login },
  { path: '/home' , component: Home }
]

const router = new VueRouter({
  routes
})


//为路由对象，添加beforeEach导航守卫
//to 将要访问路径
//from 从哪个路径跳转而来
//next 函数 表示方向
router.beforeEach((to, from, next) => {
    //如果用户访问的登录页，直接放行
    if (to.path === '/login') return next()
    //从sessionStorage 中获取到保存的token值
    const tokenStr = window.sessionStorage.getItem( 'token')
    //没有token,强制跳转到登录页
    if (!tokenStr)  return next('/login')
    next()
  }
);


export default router

import Vue from 'vue'
import Router from 'vue-router'

/*import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome'
import Users from "../components/user/Users";
import Rights from "../components/power/Rights";
import Roles from "../components/power/Roles";
import Cate from "../components/goods/Cate";
import Params from "../components/goods/Params";
import GoodsList from "../components/goods/List"
import Add from "../components/goods/Add";
import Order from "../components/order/Order";
import Report from "../components/report/Report";*/

//路由懒加载
const Login = () => import(/* webpackChunkNam:"login_home_welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkNam:"login_home_welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkNam:"login_home_welcome" */ '../components/Welcome.vue')
const Users = () => import(/* webpackChunkNam:"Users_Rights_Roles" */ '../components/user/Users.vue')
const Rights = () => import(/* webpackChunkNam:"Users_Rights_Roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkNam:"Users_Rights_Roles" */ '../components/power/Roles.vue')
const Cate = () => import(/* webpackChunkNam:"Cate_Params" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkNam:"Cate_Params" */ '../components/goods/Params.vue')
const GoodsList = () => import(/* webpackChunkNam:"GoodsList_Add" */ '../components/goods/List.vue')
const Add = () => import(/* webpackChunkNam:"GoodsList_Add" */ '../components/goods/Add.vue')
const Order = () => import(/* webpackChunkNam:"login_home_welcome" */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkNam:"login_home_welcome" */ '../components/report/Report.vue')

Vue.use(Router)

const routes = [
  //重定向
  { path:'/', redirect:'/login'},
  { path: '/login' , component: Login },
  {
    path: '/home' ,
    component: Home,
    redirect:'/welcome',
    //home下子路由规则
    children:[
      { path:'/welcome',component: Welcome},
      { path: '/users', component: Users},
      { path: '/rights', component: Rights},
      { path: '/roles', component: Roles},
      { path: '/categories', component: Cate},
      { path:'/params', component: Params},
      { path:'/goods', component: GoodsList},
      { path:'/goods/add', component: Add},
      { path:'/orders', component: Order},
      { path:'/reports', component: Report}
    ]
  }
]

const router = new Router({
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

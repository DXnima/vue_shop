import Vue from 'vue'
import {Button, Switch, Tooltip} from 'element-ui'
import { Form,FormItem } from 'element-ui'
import { Input } from 'element-ui'
import { Message } from 'element-ui'
import { Container,Header,Aside,Main } from 'element-ui'
import { Menu,Submenu,MenuItem } from 'element-ui'
import { Breadcrumb,BreadcrumbItem,Card,Row,Col,Table,TableColumn} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)

Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.prototype.$message=Message

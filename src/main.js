import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import animated from 'animate.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import * as echarts from "echarts"

import 'element-ui/lib/theme-chalk/display.css';

import '@/icons' // icon
import '@/permission' // permission control


/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

//引入Animate
Vue.use(animated)
import moment from 'moment'
Vue.prototype.$moment = moment//时间处理组件
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  beforeCreate() {
    Vue.prototype.$Bus = this
    Vue.prototype.$echarts = echarts
  },
  render: h => h(App)
})

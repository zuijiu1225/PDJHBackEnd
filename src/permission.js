import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async (to, from, next) => {


  var code = to.params.code;
  //路由白名单
  const whiteList = ['/login', `/Singin/${code}`, `/Singin2/${code}`, `/Singin0/${code}`] // no redirect whitelist

  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {

    // console.log("从哪来？",from.path,"去哪？",to.path);
    if (to.path === '/login') {
      // 如果已登录，重定向到主页、
      // console.log("如果已登录，请重定向到主页");
      next({ path: '/admin' })
      NProgress.done()
    } else {
      //否则去看看有没有用户名
      // console.log("如果在地址栏上直接输入地址去后端 那么检查有没有用户名");
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        // console.log("有用户名");
        next()
      } else {
        try {

          // console.log("没有用户名 那就触发getinfo");
          // 要是没有用户名 去请求一个 
          await store.dispatch('user/getInfo')
          next({ ...to, replace: true })

        } catch (error) {
          // 删除令牌并转到登录页面重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    // next()
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }

  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

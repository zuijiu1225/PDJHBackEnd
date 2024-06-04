import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'


//constantRoutes：不需要动态判断权限的路由，如登录页、404、等通用页面
export const constantRoutes = [
  // {
  //   path: '/login',
  //   component: () => import('@/views/login/index'),
  //   hidden: true
  // },
  {
    path: '/login',
    component: () => import('@/views/logins/index'),
    hidden: true
  },
  {
    path: '/Singin0/:code',
    component: () => import('@/views/SingIn/index'),
    hidden: true
  },
  {
    path: '/Singin2/:code',
    component: () => import('@/views/SingIn2/index'),
    hidden: true
  },
  {
    path: '/Singin/:code',
    component: () => import('@/views/SingIn3/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'Home', affix: true, onCache: true }
    }]
  }
  // { path: '*', redirect: '/404', hidden: true }
]

//asyncRoutes： 代表那些需求动态判断权限并通过 addRoutes 动态添加的页面。 
//更改成生成法 异步路由暂时不需要了
export const asyncRoutes = [

  // {
  //   path:'/patientCenter',
  //   component: Layout,
  //   name:'patientCenter',
  //   redirect:'/patientCenter/patientCallList',
  //   alwaysShow: true,
  //   meta:{title:'患者中心',icon:'component'},
  //   children:[
  //     {
  //       path:'patientCallList',
  //       name:'patientCallList',
  //       meta:{title:'患者队列'},
  //       component: ()=> import("@/views/patientCenter/patientCallList/index.vue")
  //     }
  //   ]
  // },
  // {
  //   path:'/hospitalInfo',
  //   component: Layout,
  //   name:'hospitalInfo',
  //   redirect:'/hospitalInfo/maintenance_of_dept',
  //   alwaysShow: true,
  //   meta:{title:'医院科室信息',icon:'example'},
  //   children:[
  //     {
  //       path:'maintenance_of_dept',
  //       name:'maintenance_of_dept',
  //       meta:{title:'科室维护'},
  //       component: ()=> import("@/views/hospitalInfo/maintenance_of_dept/maintenance_of_dept.vue")
  //     },
  //     {
  //       path:'maintenance_of_doctor',
  //       name:'maintenance_of_doctor',
  //       meta:{title:'医生维护'},
  //       component: ()=> import("@/views/hospitalInfo/maintenance_of_doctor/maintenance_of_doctor.vue")
  //     }
  //   ]
  // },




  // {
  //   path:'/menuPermission',
  //   component: Layout,
  //   redirect:'/menuPermission/maintenanceRole',
  //   name:'menuPermission',
  //   meta: { title: '菜单权限', icon: 'password',noCache:false},
  //   children:[
  //     {
  //       path: 'maintenanceRole',
  //       name: 'maintenanceRole',  
  //       // component:require('@/views/menu-permissions/role-maintenance/index').default,
  //       component: () => import('@/views/menu-permissions/role-maintenance/index'),
  //       meta: { title: '角色维护',noCache:false}
  //     },
  //     {
  //       path: 'maintenanceMenu',
  //       name: 'maintenanceMenu',
  //       component: () => import('@/views/menu-permissions/menu-maintenance/index'),
  //       meta: { title: '菜单维护',noCache:false}
  //     },
  //     {
  //       path: 'maintenanceUser',
  //       name: 'maintenanceUser',
  //       component: () => import('@/views/menu-permissions/user-management/index'),
  //       meta: { title: '用户管理',noCache:false}
  //     }
  //   ]
  // },

]


const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})



const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router

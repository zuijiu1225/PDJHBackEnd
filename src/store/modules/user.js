import { login, logout, getInfo, getAllUser, editorUser, removeUser, addUser, resetPassWord, getPatientByCardNo, GetUserClinic, GetDataTime } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, asyncRoutes, constantRoutes } from '@/router'
import router from '@/router'
import { MessageBox, Message } from 'element-ui';
import Layout from '@/layout'


const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    UserNo: '',
    asyncRoutesDto: asyncRoutes,
    AllRoutes: [] //联合之后的路由
  }
}

const state = getDefaultState()

//唯一修改state的地方
const mutations = {
  //重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  //存储token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  //存储用户名
  SET_NAME: (state, name) => {
    state.name = name
  },
  //存储用户头像
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  //存储用户账号
  SET_USERNO: (state, UserNo) => {
    state.UserNo = UserNo
  },
  //存储全部计算好了的路由
  SET_ALLROUTES: (state, AllRoutes) => {
    state.AllRoutes = AllRoutes
  }
}

//动作方法
const actions = {
  //这里就是登陆业务
  login({ commit, state }, userInfo) {
    //解析出用户名和密码
    const { UserNo, Password } = userInfo
    return new Promise((resolve, reject) => {
      login({ UserNo: UserNo.trim(), Password: Password }).then(response => {
        console.log("查看返回值", response);
        //本地存储签到端SignCode，目前未加密
        localStorage.setItem("SignCode", response.data.SignCode);
        const { Routes } = response.data
        //vuex存储token      
        commit('SET_TOKEN', response.data.Token)
        //本地持久化存储token
        setToken(response.data.Token)
        //设置账号
        commit('SET_USERNO', response.data.UserNo)
        //设置名字
        commit('SET_NAME', response.data.UserName)

        //设置头像
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')

        // console.log("查看返回的路由对象",response.data.Routes);

        // console.log("对比法 常量路由和异步路由合并之后的", constantRoutes.concat(computedAsyncReoutes(asyncRoutes, response.data.Routes)));

        //对比法 重新设置路由 这句话不是没用 不加没有组件
        // router.addRoutes(constantRoutes.concat(computedAsyncReoutes(asyncRoutes, response.data.Routes)));

        //生成法 重新设置路由 这句话不是没用 不加没有组件
        router.addRoutes(constantRoutes.concat(createAsyncReoutes(Routes)));
        //重新把路由保存在vuex中
        commit('SET_ALLROUTES', constantRoutes.concat(createAsyncReoutes(Routes)))

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  //获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {

      getInfo(state.token).then(response => {

        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        //返回的信息包含 头像地址 介绍 用户名 角色

        //设置账号
        commit('SET_USERNO', data.UserNo)
        //设置名字
        commit('SET_NAME', data.UserName)
        //设置头像
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')

        const { Routes } = response.data
        //重新设置路由
        // router.addRoutes(constantRoutes.concat(computedAsyncReoutes(asyncRoutes, response.data.Routes)));


        //生成法 重新设置路由 这句话不是没用 不加没有组件
        router.addRoutes(constantRoutes.concat(createAsyncReoutes(Routes)));

        //把路由保存在vuex中
        // console.log("getinfo 查看是否有路由信息 ", constantRoutes.concat(computedAsyncReoutes(asyncRoutes, response.data.Routes)));

        //对比法 
        // commit('SET_ALLROUTES', constantRoutes.concat(computedAsyncReoutes(asyncRoutes, response.data.Routes)))

        //生成法
        commit('SET_ALLROUTES', constantRoutes.concat(createAsyncReoutes(Routes)))

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },


  //根据卡号 获取患者数据
  getPatientByCardNo({ }, PatientCardNo) {
    return new Promise((resolve, reject) => {
      getPatientByCardNo(PatientCardNo).then(response => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  //根据用户ID获取用户数据
  GetUserClinic({ }, TokenInput) {
    return new Promise((resolve, reject) => {
      GetUserClinic(TokenInput).then(response => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  //修改密码
  resetPassWord({ }, ChangePassWord) {
    return new Promise((resolve, reject) => {
      resetPassWord(ChangePassWord).then(response => {

        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  //修改用户信息
  editorUser({ }, FromUser) {
    return new Promise((resolve, reject) => {

      editorUser(FromUser).then(response => {

        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })

  },

  //删除用户
  removeUser({ }, UserNo) {
    return new Promise((resolve, reject) => {
      removeUser(UserNo).then(response => {

        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })


    })
  },

  //新增用户
  addUser({ }, AddUser) {
    return new Promise((resolve, reject) => {
      addUser(AddUser).then(response => {

        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  //联合分页 获取用户信息
  getAllUser({ commit, state }, Page) {
    return new Promise((resolve, reject) => {

      const { pageindex, pagesize } = Page
      getAllUser(pageindex, pagesize).then(response => {

        const { data, pageInfo } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        //这个resolve 里面的数据 就是你要返回到 组件里的数据 就是最后一层拿到的数据
        resolve({ data, pageInfo })
      }).catch(error => {
        reject(error)
      })
    })

  },

  //登出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.UserNo).then(() => {
        removeToken() // must remove  token  first
        // resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 删除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

//对比法 后端返回路由名字   定义一个函数 对比异步路由 计算出用户到底显示哪些异步路由
const computedAsyncReoutes = (AsyncRoutes, Routes) => {
  return AsyncRoutes.filter(item => {
    if (Routes.indexOf(item.name) != -1) {
      //递归
      if (item.children && item.children.length) {
        item.children = computedAsyncReoutes(item.children, Routes)
      }
      return true
    }
  })
}


//生成法 后端返回路由实体 定义一个函数 直接生成路由信息
const createAsyncReoutes = (Routes) => {

  const asyncR = [];
  Routes.filter(item => {
    if (item.LevelId == 0) {
      const father = {
        path: `/${item.PageUrl}`,
        component: Layout,
        name: `${item.PageUrl}`,
        alwaysShow: true,
        hidden: !item.AlwaysShow,
        meta: { title: `${item.PageShowName}`, icon: `${item.Icon}`, noCache: !item.NoCache },
        children: []
      }
      Routes.filter(it => {
        if (it.ParentPageId.toLowerCase() == item.Id.toLowerCase()) {
          father.children.push({
            path: `${it.PageUrl}`,
            name: `${it.PageUrl}`,
            hidden: !item.AlwaysShow,
            meta: { title: `${it.PageShowName}` },
            component: getViews(it.PageUrl)
          })
        }
      })
      asyncR.push(father)
    }
  })
  return asyncR
}
//生成组件路径
function getViews(path) {
  return resolve => {
    require.ensure([], (require) => {
      resolve(require('@/views/' + path + '/' + 'index.vue'))
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


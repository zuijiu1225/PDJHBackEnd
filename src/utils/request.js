import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// axios.defaults.baseURL = "http://199.100.102.48:8890"//彭泽人民
// axios.defaults.baseURL = "http://172.17.0.141:8890"//于都中医院
// axios.defaults.baseURL = "http://192.168.21.210:8090"//于都中医院
// axios.defaults.baseURL = 'http://192.168.7.224:8090'
// axios.defaults.baseURL = 'http://192.168.7.208:8090'//新宁
// axios.defaults.baseURL = 'http://10.17.12.31:8090'//莲花中
// axios.defaults.baseURL = 'http://172.17.0.30:8090'//莲花人民
// axios.defaults.baseURL = 'http://192.147.160.228:8890'//全州人民
// axios.defaults.baseURL = 'http://192.168.1.154:8890'//吉安县妇幼保健院
// axios.defaults.baseURL = 'http://192.168.200.25:8091'
// axios.defaults.baseURL = 'http://192.168.117.135:8890'//上高县妇幼保健院
// axios.defaults.baseURL = 'http://localhost:14666'
// 'http://172.17.0.141:8890'
// create an axios instance
const service = axios.create({
  baseURL: 'http://192.168.200.25:8091',//广西龙胜人民医院
  // baseURL: 'http://172.50.200.201:8890',//庐山中医院
  // baseURL: 'http://192.168.42.8:8890',//于都中医院
  // baseURL: 'http://192.168.0.53:8099',  //同一请求头
  // baseURL: 'http://172.50.200.201:8890',  //庐山
  // baseURL: 'http://localhost:14666',  //同一请求头
  //  baseURL:'http://192.168.0.82',//兴国中医院
  // baseURL: 'http://192.168.1.21:8090',//庐山妇保
  timeout: 10000 // request timeout    //最大超时时间 10秒
})

// 请求拦截器     
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // 让每个请求携带令牌
      // ['X-Token']是一个自定义头信息
      // 请根据实际情况进行修改
      // config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // 处理请求错误
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * 如果您想获取http信息，如标题或状态
   * 请返回 response => response
  */

  /**
    *通过自定义代码确定请求状态
    *这里只是一个例子
    *您还可以通过HTTP状态代码来判断状态
   */
  response => {
    const res = response.data

    // console.log("响应拦截器接收到的数据",response);
    // 如果返回的状态码不是200
    if (res.code !== 200 && res.code !== 400) {
      // if (condition) {

      // }

      // Message({
      //   message: res.msg || '服务器错误！',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      //庐山市签到机端不需要
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(res)
    } else {
      return res
    }
  },
  error => {
    console.log("响应拦截器发生错误", 'err' + error) // for debug
    // Message({
    //   message: "服务器错误！",
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    //庐山市签到机端不需要
    return Promise.reject(error)
  }
)

export default service

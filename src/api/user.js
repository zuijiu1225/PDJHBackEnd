import request from '@/utils/request'

//登录
export function login(data) {
  return request({
    url: '/api/User/LoginUser',
    method: 'post',
    data
  })
}

//获取用户信息 
export function getInfo(token) {
  return request({
    url: '/api/User/GetInfo',
    method: 'post',
    params: { token }
  })
}

//获取用户诊室信息
export function GetUserClinic(data) {
  return request({
    url: 'api/User/GetUserClinic',
    method: 'post',
    data
  })
}


//根据卡号 获取患者数据
export function getPatientByCardNo(PatientCardNo) {
  return request({
    url: '/api/User/GetPatientByCardNo',
    method: 'post',
    params: { PatientCardNo }
  })
}

//登出
export function logout(userno) {
  return request({
    url: '/api/User/LogOut',
    method: 'post',
    params: { userno }
  })
}

//新增用户
export function addUser(data) {
  console.log(data);
  return request({
    url: '/api/User/AddUser',
    method: 'post',
    data
  })
}

//修改用户信息
export function editorUser(FromUser) {
  return request({
    url: '/api/User/EditorUser',
    method: 'post',
    data: FromUser
  })
}

//删除用户
export function removeUser(UserNo) {
  console.log(UserNo);
  return request({
    url: '/api/User/RemoveUser',
    method: 'post',
    params: { UserNo }
  })
}


//联合分页 获取所有用户信息 
export function getAllUser(pageindex, pagesize) {
  return request({
    url: '/api/User/GetUsers',
    method: 'post',
    params: { pageindex, pagesize }
  })
}

//重置密码
export function resetPassWord(ChangePassWord) {
  return request({
    url: '/api/User/ResetPassWord',
    method: 'post',
    data: ChangePassWord
  })
}




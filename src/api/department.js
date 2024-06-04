import request from '@/utils/request'


//获取用户所在导诊诊室以及复诊室（彩超一，彩超二，彩超等）
export function GetUserParentDeptID(data) {
  // console.log(data)
  return request({
    url: '/api/Department/GetUserParentDeptID',
    method: 'post',
    data
  })
}
//获取所有诊室信息 
export function getAllDepartment() {
  return request({
    url: '/api/Department/GetAllDepartment',
    method: 'post',
  })
}

//修改诊室信息
export function editorDepartment(EditorDept) {
  return request({
    url: '/api/Department/EditorDepartment',
    method: 'post',
    data: EditorDept
  })
}


//新增诊室信息
export function createDepartment(AddDept) {
  return request({
    url: '/api/Department/CreateDepartment',
    method: 'post',
    data: AddDept
  })
}

//删除诊室
export function removeDepartments(ID) {
  return request({
    url: '/api/Department/RemoveDepartments',
    method: 'post',
    params: { ID }
  })
}



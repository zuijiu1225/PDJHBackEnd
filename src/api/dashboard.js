import request from '@/utils/request'

//获取首页每个屏幕下每种诊室的排队人数
export function getDepartments() {
     return request({
          url: '/api/Dashboard/GetDepartments',
          method: 'post',
     })
}


//获取每个时间段每个诊室下的排队人数情况
export function getDepartmentQueueTime(input) {
     return request({
          url: 'api/Dashboard/GetDepartmentQueueTimeData',
          method: 'post',
          data: input
     })
}


//统计报表  统计每个医生呼叫了多少人
export function getDoctorCallCount(input) {
     console.log("条件对象", input);
     return request({
          url: 'api/Dashboard/GetDoctorCallCount',
          method: 'post',
          data: input
     })
}

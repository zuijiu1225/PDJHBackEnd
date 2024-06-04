import request from '@/utils/request'

//根据代码获取签到终端信息和按钮
export function GetSignInfoBtnByCode(params) {
    return request({
        url: '/api/SignInfo/GetSignInfoBtnByCode',
        method: 'get',
        params
    })
}
//按钮获取刷卡数据(导诊)
export function GetGuideCardBtnData(params) {
    return request({
        url: '/api/SignInfo/GetGuideCardBtnData',
        method: 'post',
        data: params
    })
}
//根据导诊工号获取屏幕关联诊室信息
export function GetGuideScreensInfo(params) {
    return request({
        url: '/api/DoctorCall/GetGuideScreensInfo',
        method: 'get',
        params
    })
}

//根据屏幕ID获取关联诊室信息
export function GetScreenDeptInfo(params) {
    return request({
        url: '/api/DoctorCall/GetScreenDeptInfo',
        method: 'get',
        params
    })
}

//根据诊室获取屏幕信息
export function GetDocScreenInfo(params) {
    return request({
        url: '/api/DoctorCall/GetDocScreenInfo',
        method: 'get',
        params
    })
}

//根据诊区和诊室获取医生信息
export function GetDocIntro(params) {
    return request({
        url: '/api/Screens/GetDocIntro',
        method: 'post',
        data: params
    })
}
//获取候诊,已完成，过号等所有患者信息
export function GetCallListInput(params) {
    return request({
        url: '/api/CallList/GetCallListInput',
        method: 'post',
        data: params
    })
}

//根据状态获取患者信息
export function GetCallListInputPage(params) {
    return request({
        url: '/api/CallList/GetCallListInputPage',
        method: 'post',
        data: params
    })
}
//删除指定患者
export function DeleteCallById(params) {
    return request({
        url: '/api/DoctorCall/DeleteCallById',
        method: 'post',
        data: params
    })
}
//验证患者是否签到
export function VerifyPatientSign(params) {
    return request({
        url: '/api/SignInfo/VerifyPatientSign',
        method: 'post',
        data: params
    })
}
//按钮确认签到
export function ConfirmPatientBtnSign(params) {
    return request({
        url: '/api/SignInfo/ConfirmPatientBtnSign',
        method: 'post',
        data: params
    })
}
//获取未签到数据(导诊)
export function GetNotSignData(params) {
    return request({
        url: '/api/SignInfo/GetNotSignData',
        method: 'post',
        data: params
    })
}
//根据诊室和状态获取数量
export function GetCallListInputTotleDept(params) {
    return request({
        url: '/api/CallList/GetCallListInputTotleDept',
        method: 'post',
        data: params
    })
}

//导诊端修改队列状态
export function UpdateCallListStatus(params) {
    return request({
        url: 'api/DoctorCall/UpdateCallListStatus',
        method: 'post',
        data: params
    })
}

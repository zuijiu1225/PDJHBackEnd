import request from '@/utils/request'

export function GetScreens(ScreenInput) {
    return request({
        url: '/api/Screens/GetScreens',
        method: 'post',
        data: ScreenInput
    })
}

export function GetScreensSingle(ScreenInput) {
    return request({
        url: '/api/Screens/GetScreensSingle',
        method: 'post',
        data: ScreenInput
    })
}

export function UpdateScreen(ScreenInput) {
    return request({
        url: '/api/Screens/UpdateScreen',
        method: 'post',
        data: ScreenInput
    })
}

export function AddScreen(ScreenInput) {
    return request({
        url: '/api/Screens/AddScreen',
        method: 'post',
        data: ScreenInput
    })
}

export function DelScreen(ScreenInput) {
    return request({
        url: '/api/Screens/DelScreen',
        method: 'post',
        data: ScreenInput
    })
}
export function GetDepartments(ScreenInput) {
    return request({
        url: 'api/Department/GetDepartments',
        method: 'post',
        data: ScreenInput
    })

}

export function GetHasassociatedDepartments(ScreenInput) {
    return request({
        url: 'api/ScreenDeptMapping/GetHasassociatedDepartments',
        method: 'post',
        data: ScreenInput
    })

}

export function RelevancyScreenAndDepts(ScreenDeptMappingInput) {
    return request({
        url: 'api/ScreenDeptMapping/RelevancyScreenAndDepts',
        method: 'post',
        data: ScreenDeptMappingInput
    })

}
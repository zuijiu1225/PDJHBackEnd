import request from '@/utils/request'

export function AddScreensIPMapping(ScreensIPMappingsInput) {
    return request({
        url: '/api/ScreensIPMapping/AddScreensIPMapping',
        method: 'post',
        data: ScreensIPMappingsInput
    })
}

export function SelectScreensIPMappingPage(ScreensIPMappingsInput) {
    return request({
        url: '/api/ScreensIPMapping/SelectScreensIPMappingPage',
        method: 'post',
        data: ScreensIPMappingsInput
    })
}

export function updateScreensIPMapping(ScreensIPMappingsInput) {
    return request({
        url: '/api/ScreensIPMapping/updateScreensIPMapping',
        method: 'post',
        data: ScreensIPMappingsInput
    })
}
export function DeleteScreensIPMapping(ScreensIPMappingsInput) {
    return request({
        url: '/api/ScreensIPMapping/DeleteScreensIPMapping',
        method: 'post',
        data: ScreensIPMappingsInput
    })
}
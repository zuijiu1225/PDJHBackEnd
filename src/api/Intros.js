import request from '@/utils/request'

//条件查询获取队列信息
export function GetIntrosList(QueryInput) {
    return request({
        url: 'api/Intros/GetIntrosList',
        method: 'post',
        data: QueryInput
    })
}

//增加
export function InsertIntros(QueryInput) {
    return request({
        url: 'api/Intros/InsertIntros',
        method: 'post',
        data: QueryInput
    })
}
//修改
export function ChangeIntros(QueryInput) {
    return request({
        url: 'api/Intros/ChangeIntros',
        method: 'post',
        data: QueryInput
    })
}
//删除
export function DeleteIntros(QueryInput) {
    return request({
        url: 'api/Intros/DeleteIntros',
        method: 'post',
        data: QueryInput
    })
}
//上传图片
export function UploadIntrosAsync(QueryInput) {
    return request({
        url: 'api/Intros/UploadIntrosAsync',
        method: 'post',
        // headers: {
        //     // 表示上传的是文件,而不是普通的表单数据application/x-www-form-urlencoded
        //     'Content-Type': 'multipart/form-data'
        // },
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: QueryInput
    })
}
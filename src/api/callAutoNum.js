import request from '@/utils/request'
import { Input } from 'element-ui'


//获取
export function getAutoNum(){
    return request({
        url:"/api/CallAutoNum/GetAutoNum",
        method:'post'
    })
}


//新增
export function createAutoNum(input){
    return request({
        url:"/api/CallAutoNum/CreateAutoNum",
        method:'post',
        data:input
    })
}

//修改
export function editorAutoNum(input){
    return request({
        url:"/api/CallAutoNum/EditorAutoNum",
        method:'post',
        data:input
    })
}

//删除
export function removeAutoNum(GID){
    return request({
        url:'/api/CallAutoNum/RemoveAutoNum',
        method:'post',
        params:{GID}
    })
}

//删除
export function removeAutoNum111(GID){
    return request({
        url:'/api/CallAutoNum/RemoveAutoNum',
        method:'post',
        params:{GID}
    })
}

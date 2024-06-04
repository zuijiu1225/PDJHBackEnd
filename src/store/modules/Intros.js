import { GetIntrosList, InsertIntros, ChangeIntros, UploadIntrosAsync, DeleteIntros } from '@/api/Intros'
const getDefaultState = () => {
    return {

    }
}
const state = getDefaultState()
const mutations = {

}

const actions = {
    //获取首页卡片上每个屏幕下每种诊室的排队人数
    GetIntrosList({ }, QueryInput) {
        return new Promise((resolve, reject) => {
            GetIntrosList(QueryInput).then(response => {
                const { data } = response
                resolve(data)
            }).catch(erro => {
                reject(erro)
            })
        })
    },
    InsertIntros({ }, QueryInput) {
        return new Promise((resolve, reject) => {
            InsertIntros(QueryInput).then(response => {
                const { data } = response
                resolve(data)
            }).catch(erro => {
                reject(erro)
            })
        })
    },
    ChangeIntros({ }, QueryInput) {
        return new Promise((resolve, reject) => {
            ChangeIntros(QueryInput).then(response => {
                const { data } = response
                resolve(data)
            }).catch(erro => {
                reject(erro)
            })
        })
    },
    DeleteIntros({ }, QueryInput) {
        return new Promise((resolve, reject) => {
            DeleteIntros(QueryInput).then(response => {
                const { data } = response
                resolve(data)
            }).catch(erro => {
                reject(erro)
            })
        })
    },
    UploadIntrosAsync({ }, QueryInput) {
        return new Promise((resolve, reject) => {
            UploadIntrosAsync(QueryInput).then(response => {
                const { data } = response
                resolve(data)
            }).catch(erro => {
                reject(erro)
            })
        })
    },

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
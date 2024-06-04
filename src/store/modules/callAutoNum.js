import { getAutoNum, editorAutoNum, removeAutoNum, createAutoNum, removeAutoNum111} from "@/api/callAutoNum"

const getDefaultState = () => {
    return {

    }
}
const state = getDefaultState()


const mutations = {

}

const actions = {

    getAutoNum({ }) {
        return new Promise((resolve, reject) => {
            getAutoNum().then(response => {
                const { data } = response
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    editorAutoNum({ }, input) {
        return new Promise((resolve, reject) => {
            editorAutoNum(input).then(response => {
                const { data } = response
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    removeAutoNum({ }, GID) {
        return new Promise((resolve, reject) => {
            removeAutoNum(GID).then(response => {
                const { data } = response
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    createAutoNum({ }, input) {
        return new Promise((resolve, rehect) => {
            createAutoNum(input).then(response => {
                const { data } = response
                resolve(data)
            }).catch(error => {
                reject(error)
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
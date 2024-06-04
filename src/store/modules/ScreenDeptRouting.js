import { AddScreensIPMapping,SelectScreensIPMappingPage,updateScreensIPMapping,DeleteScreensIPMapping} from '@/api/ScreenDeptRouting'

const getDefaultState = () => {
    return {
    }
}

const state = getDefaultState()

const mutations = {

}

const actions = {
    AddScreensIPMapping({ }, ScreensIPMappingsInput) {
        return new Promise((resolve, reject) => {
            AddScreensIPMapping(ScreensIPMappingsInput).then(response => {

                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })

    },
    SelectScreensIPMappingPage({ }, ScreensIPMappingsInput) {
        return new Promise((resolve, reject) => {
            SelectScreensIPMappingPage(ScreensIPMappingsInput).then(response => {

                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })

    },
    updateScreensIPMapping({ }, ScreensIPMappingsInput) {
        return new Promise((resolve, reject) => {
            updateScreensIPMapping(ScreensIPMappingsInput).then(response => {

                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })

    },
    DeleteScreensIPMapping({ }, ScreensIPMappingsInput) {
        return new Promise((resolve, reject) => {
            DeleteScreensIPMapping(ScreensIPMappingsInput).then(response => {

                resolve(response)
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

import { GetSignInfoBtnByCode,GetGuideCardBtnData,GetGuideScreensInfo,GetScreenDeptInfo,
    GetDocScreenInfo,GetDocIntro,GetCallListInput,GetCallListInputPage,DeleteCallById,
    VerifyPatientSign,ConfirmPatientBtnSign,GetNotSignData,GetCallListInputTotleDept,
    UpdateCallListStatus
 } from '@/api/patientCheckIn'
const getDefaultState = () => {
    return {

    }
}
const state = getDefaultState()
const mutations = {

}
const actions = {
    //根据代码获取签到终端信息和按钮
    GetSignInfoBtnByCode({ }, QueryInput) {
        return new Promise((resolve, reject) => {
            GetSignInfoBtnByCode(QueryInput).then(response => {
                const { data } = response
                resolve(data)
            }).catch(erro => {
                reject(erro)
            })
        })
    },
     //按钮获取刷卡数据(导诊)
     GetGuideCardBtnData({ }, QueryInput) {
        return new Promise((resolve, reject) => {
            GetGuideCardBtnData(QueryInput).then(response => {
                const  data  = response
                resolve(data)
            }).catch(erro => {
                reject(erro)
            })
        })
    },
     //根据代码获取签到终端信息和按钮
     GetGuideScreensInfo({ }, QueryInput) {
        return new Promise((resolve, reject) => {
            GetGuideScreensInfo(QueryInput).then(response => {
                const { data } = response
                resolve(data)
            }).catch(erro => {
                reject(erro)
            })
        })
    },
    //根据代码获取签到终端信息和按钮
    GetScreenDeptInfo({ }, QueryInput) {
        return new Promise((resolve, reject) => {
            GetScreenDeptInfo(QueryInput).then(response => {
                const { data } = response
                resolve(data)
            }).catch(erro => {
                reject(erro)
            })
        })
    },
     //根据代码获取签到终端信息和按钮
     GetDocScreenInfo({ }, QueryInput) {
        return new Promise((resolve, reject) => {
            GetDocScreenInfo(QueryInput).then(response => {
                const { data } = response
                resolve(data)
            }).catch(erro => {
                reject(erro)
            })
        })
    },
    //根据诊区和诊室获取医生信息
     GetDocIntro({ }, QueryInput) {
        return new Promise((resolve, reject) => {
            GetDocIntro(QueryInput).then(response => {
                const { data } = response
                resolve(data)
            }).catch(erro => {
                reject(erro)
            })
        })
    },
//获取候诊,已完成，过号等所有患者信息
    GetCallListInput({ }, QueryInput) {
        return new Promise((resolve, reject) => {
            GetCallListInput(QueryInput).then(response => {
                const { data } = response
                resolve(data)
            }).catch(erro => {
                reject(erro)
            })
        })
    },
    //获取候诊,已完成，过号等所有患者信息
    GetCallListInputPage({ }, QueryInput) {
        return new Promise((resolve, reject) => {
            GetCallListInputPage(QueryInput).then(response => {
                const { data } = response
                resolve(data)
            }).catch(erro => {
                reject(erro)
            })
        })
    },
    //获取候诊,已完成，过号等所有患者信息
    DeleteCallById({ }, QueryInput) {
        return new Promise((resolve, reject) => {
            DeleteCallById(QueryInput).then(response => {
                const { data } = response
                resolve(data)
            }).catch(erro => {
                reject(erro)
            })
        })
    },
    //验证患者是否签到
    VerifyPatientSign({ }, QueryInput) {
        return new Promise((resolve, reject) => {
            VerifyPatientSign(QueryInput).then(response => {
                const { data } = response
                resolve(data)
            }).catch(erro => {
                reject(erro)
            })
        })
    },
    //按钮确认签到
    ConfirmPatientBtnSign({ }, QueryInput) {
        return new Promise((resolve, reject) => {
            ConfirmPatientBtnSign(QueryInput).then(response => {
                const  data  = response
                resolve(data)
            }).catch(erro => {
                reject(erro)
            })
        })
    },
    //获取未签到数据(导诊)
    GetNotSignData({ }, QueryInput) {
        return new Promise((resolve, reject) => {
            GetNotSignData(QueryInput).then(response => {
                const { data } = response
                resolve(data)
            }).catch(erro => {
                reject(erro)
            })
        })
    },
    //获取未签到数据(导诊)
    GetCallListInputTotleDept({ }, QueryInput) {
        return new Promise((resolve, reject) => {
            GetCallListInputTotleDept(QueryInput).then(response => {
                const { data } = response
                resolve(data)
            }).catch(erro => {
                reject(erro)
            })
        })
    },
   //导诊端修改队列状态
    UpdateCallListStatus({ }, QueryInput) {
        return new Promise((resolve, reject) => {
            UpdateCallListStatus(QueryInput).then(response => {
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
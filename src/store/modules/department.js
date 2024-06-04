import { getAllDepartment, editorDepartment, createDepartment, removeDepartments, GetUserParentDeptID } from '@/api/department'
import Vue from 'vue'
const getDefaultState = () => {
    return {
        //所有的诊室信息
        DepartmentArry: []
    }
}

const state = getDefaultState()

const mutations = {

    SET_DEPARTMENTARRY: (state, value) => {
        state.DepartmentArry = value
    }
}


const actions = {
    //获取所有的诊室信息 并且计算父子关系 用于联级下拉框
    getAllDepartment({ commit }) {
        return new Promise((resolve, reject) => {
            getAllDepartment().then(response => {
                const { data } = response
                const DepartmentArry = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].Type == 1) {
                        const father = {
                            value: data[i].ID,
                            label: data[i].Name,
                            disabled: data[i].State == 1 ? false : true,
                            Queue: data[i].Queue,
                            children: [],

                        }
                        for (let j = 0; j < data.length; j++) {
                            if (data[j].FatherID == data[i].ID) {
                                const song = {
                                    value: data[j].ID,
                                    label: data[j].Name,
                                    Queue: data[i].Queue,
                                    disabled: data[j].State == 1 ? false : true
                                }
                                father.children.push(song)
                            }
                        }
                        DepartmentArry.push(father)
                    }
                }
                // console.log("计算完 父子级别的诊室",DepartmentArry);
                //保存在vuex中 暂时不保存在vuex中 诊室维护中的新增诊室会破坏原有数据结构
                // commit("SET_DEPARTMENTARRY", DepartmentArry)
                resolve(DepartmentArry)
            }).catch(error => {
                reject(error)
            })
        })
    },
    //获取用户所在导诊诊室以及复诊室（彩超一，彩超二，彩超等）
    GetUserParentDeptID({ }, DepartmentInput) {
        return new Promise((resolve, reject) => {
            GetUserParentDeptID(DepartmentInput).then(response => {
                const { data } = response
                const DepartmentArry = [];
                for (let i = 0; i < data.length; i++) {
                    const father = {
                        value: data[i].ID,
                        label: data[i].Name,
                        Type: data[i].Type,
                        Queue: data[i].Queue,
                        // disabled: data[i].State == 1 ? false : true,
                        // children: []
                    }
                    // if (data[i].Type == 1) {
                    //     const father = {
                    //         value: data[i].ID,
                    //         label: data[i].Name,
                    //         disabled: data[i].State == 1 ? false : true,
                    //         children: []
                    //     }
                    //     for (let j = 0; j < data.length; j++) {
                    //         if (data[j].FatherID == data[i].ID) {
                    //             const song = {
                    //                 value: data[j].ID,
                    //                 label: data[j].Name,
                    //                 disabled: data[j].State == 1 ? false : true
                    //             }
                    //             father.children.push(song)
                    //         }
                    //     }
                    //     DepartmentArry.push(father)
                    // }
                    DepartmentArry.push(father)
                }
                resolve(DepartmentArry)
            }).catch(error => {
                reject(error)
            })
        })
    },
    //获取所有的诊室信息 什么都不计算
    getAllDepartment3({ }) {
        return new Promise((resolve, reject) => {
            getAllDepartment().then(response => {
                const { data } = response
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getAllDepartment2({ }) {
        return new Promise((resolve, reject) => {
            getAllDepartment().then(response => {
                const { data } = response
                const DeptArry = [];
                data.filter(item => {
                    if (item.Type == 1) {
                        Vue.set(item, 'children', [])
                        data.filter(item2 => {
                            if (item.ID == item2.FatherID) {
                                item.children.push(item2)
                            }
                        })
                        DeptArry.push(item)
                    }
                })
                resolve(DeptArry)
            }).catch(error => {
                reject(error)
            })
        })
    },
    //新增诊室
    createDepartment({ }, AddDept) {
        return new Promise((resolve, reject) => {
            createDepartment(AddDept).then(response => {

                const { data } = response
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    //修改诊室信息
    editorDepartment({ }, EditorDept) {
        return new Promise((resolve, reject) => {
            editorDepartment(EditorDept).then(response => {

                const { data } = response
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    //删除诊室
    removeDepartments({ }, ID) {
        return new Promise((resolve, reject) => {
            removeDepartments(ID).then(response => {

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
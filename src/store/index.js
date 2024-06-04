import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import tagsView from './modules/tagsView'
import role from './modules/role'
import department from './modules/department'
import callList from './modules/callList'
import callAutoNum from './modules/callAutoNum'
import ScreenManages from './modules/ScreenManages'
import page from './modules/page'
import dashboard from './modules/dashboard'
import Intros from './modules/Intros'
import patientCheckIn from './modules/patientCheckIn'
import ScreenDeptRouting from './modules/ScreenDeptRouting'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    tagsView,
    user,
    role,
    department,
    callList,
    callAutoNum,
    ScreenManages,
    page,
    dashboard,
    Intros,
    patientCheckIn,
    ScreenDeptRouting
  },
  getters
})

export default store

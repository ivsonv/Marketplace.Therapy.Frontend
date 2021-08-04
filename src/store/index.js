import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import app from './app'
import appConfig from './app-config'
import verticalMenu from './vertical-menu'
import authorizationUser from './authorization-user'

import authorize from './softphone/authorize'
import menu from './softphone/menu'
import call from './softphone/call'
import login from './softphone/login'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    appConfig,
    verticalMenu,
    authorize,
    menu,
    call,
    login,
    authorizationUser
  },
  strict: process.env.DEV,
})

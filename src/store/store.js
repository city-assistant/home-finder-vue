import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    BACK_SERVER_LOCAL: 'http://localhost:8090/',
    BACK_SERVER_REAL: 'http://studioj.ddns.net:8090/',
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})

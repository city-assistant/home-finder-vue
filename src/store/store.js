import Vue from 'vue'
import Vuex from 'vuex'
import constant from './constant'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    SPRING_SERVER: constant.state.BACK_SERVER_REAL,
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})

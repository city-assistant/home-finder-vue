import Vue from 'vue'
import Vuex from 'vuex'
import constant from './constant'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // SPRING_SERVER: 'http://122.34.73.231:8090/',
    SPRING_SERVER: constant.state.BACK_SERVER_REAL,
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})

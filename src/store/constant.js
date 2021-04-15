import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    FRONT_SERVER_LOCAL: '192.168.31.38:8081',
  }
})

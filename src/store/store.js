import Vue from 'vue'
import Vuex from 'vuex'
import constant from './constant'

Vue.use(Vuex)

export default new Vuex.Store({
  state:  {
    // 여기서 접근한 아이피를 확인해서 로컬이 아닐 경우에는 BACK_SERVER_REAL 아닐 경우에는 BACK_SERVER_LOCAL 로 설정하는 기능을 추가하는 것이 좋겠다.
    SPRING_SERVER: constant.state.BACK_SERVER_REAL,
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})


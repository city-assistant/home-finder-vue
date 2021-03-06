import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    FRONT_SERVER_LOCAL: 'http://192.168.31.38:8081/',
    FRONT_SERVER_REAL: 'http://122.34.73.231:8081/',
    BACK_SERVER_LOCAL: 'http://localhost:8090/',
    BACK_SERVER_REAL: 'http://122.34.73.231:8090/',
    KAKAO_MAP_API_KEY: '6e5e29693162c801d9dcaf92ac0e2c7e',
    ELASTIC_REAL: 'http://122.34.73.231:9200/'
  }
})

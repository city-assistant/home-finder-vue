import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        FRONT_SERVER_LOCAL: 'http://192.168.31.38:8081/',
        KAKAO_MAP_API_KEY: '840d92cf35474ba6b57a29fd5f32b397'

    }
})
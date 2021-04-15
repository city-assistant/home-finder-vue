<template>
  <div class="navBar">
    <button v-if="login" v-on:click="myPage">
      user
    </button>
    <button v-else v-on:click="login">
      login
    </button>
    <button @click="showModal = true">
      About
    </button>
    <vmodal/>
  </div>

  
</template>

<script>
import vmodal from 'vue-js-modal'
import store from '../store/store';
   
export default {
  components: {
    vmodal
  },
  data() {
    return {
      showModal: false,
      logIn: false
    }
  },
  created() {
    if (this.$cookie.get('userToken')) {
      this.logIn = true;
    } else {
      this.login = false;
    }
  },
  methods: {
    login() {
      this.$router.push(store.state.BACK_SERVER_LOCAL + 'login')
    },
    myPage() {
      this.$router.push(store.state.BACK_SERVER_LOCAL + 'mypage')
    },
  }
}
</script>


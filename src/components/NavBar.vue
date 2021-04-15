<template>
  <div class="navBar">
    <button v-if="login" v-on:click="myPage">
      user
    </button>
    <button v-else v-on:click="login">
      login
    </button>
    <button v-on:click="about">
      About
    </button>
    <button v-on:click="goHome">
      Home
    </button>
    <vmodal/>
  </div>

  
</template>

<script>
import vmodal from 'vue-js-modal'
   
export default {
  components: {
    vmodal
  },
  data() {
    return {
      showModal: false,
      logIn: false,
      currentUrl: document.location
    }
  },
  watch: {
    currentUrl: function() {
      if (this.$cookie.get('userToken') != '') {
        this.logIn = true;
      } else {
        this.login = false;
      }
    }
  },
  methods: {
    about() {
      this.$router.push("/about")
    },
    login() {
      this.$router.push("/login")
    },
    myPage() {
      this.$router.push('/mypage')
    },
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>


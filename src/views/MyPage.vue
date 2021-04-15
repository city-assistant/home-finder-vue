<template>
  <div>
    <br><br><br>
    This is an MyPage page
    <button v-on:click="logOut">
      logout
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    logOut() {
      console.log('a');
      this.$cookies.set('userToken', '');
      this.$router.push('/');
    }
  }
}
</script>

<template>
  <div id="myPage">
    <br><br><br><br><br><br>
    This is an MyPage page
    <button v-on:click="logOut">
      logout
    </button>
  </div>
</template>

<script>
export default {
  name: 'MyPage',
  created: function() {

  },
  methods: {
    logOut() {
      this.$cookies.remove('userToken');
      alert('로그아웃 되었습니다')
      this.$router.push('/');
    }
  }
}
</script>

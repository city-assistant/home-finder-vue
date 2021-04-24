<template>
  <div id="myPage">
    <br /><br /><br /><br /><br /><br />
    MyPage
    <button v-on:click="logOut">
      logout
    </button>

    <div v-for="(item, index) in userSavedList" :key="index">
      {{item}}
    </div>

  </div>
</template>

<script>
import axios from 'axios';
axios
export default {
  name: "MyPage",
  created: function() {
    //여기서 해당 user의 저장 목록 불러와서 엘라스틱 서치에 검색 날리는것 까지 이뤄져야 할 것으로 보임, 백엔드에선 header 및 바디에서 받은 cookie 토큰을 가지고 userId 검증
  },
  data() {
    return {
      userSavedList: [1,2]
    }
  },
  methods: {
    logOut() {
      this.$cookies.remove("userToken");
      alert("로그아웃 되었습니다");
      this.$router.push("/");
    },
  },
};
</script>

<template>
  <div id="logInPage">
    <div id="logInBox">
      로그인 페이지<br><br>
      <el-input class="inline-input" type="id" v-model="currentId"></el-input>
      <el-input class="inline-input" type="password" v-model="currentPw"></el-input><br><br>
      <button v-on:click="login">login</button>
    </div>
  </div>
</template>

<script>
import store from "../store/store";
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      currentId: "",
      currentPw: "",
    };
  },
  methods: {
    login() {
      axios
        .post(store.state.SPRING_SERVER + "loginUser", {
          userId: this.currentId,
          userPw: this.currentPw,
        })
        .then((res) => {
          console.log(res.data);
          this.$cookies.set("userToken", res.data.userToken);
          // 세션에 로그인으로 왔던 페이지를 저장해두고 그 페이지로 돌려주는 걸로 추후 수정
          if (this.$cookies.get("userToken")) {
            this.$router.push("/mypage");
          } else {
            alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요");
          }
        });
    },
  },
};
</script>

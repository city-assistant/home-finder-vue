<template>
  <div id="myPage">
    <br /><br /><br /><br /><br /><br />
    MyPage
    <button v-on:click="logOut">
      logout</button
    ><br /><br />
    <el-radio-group v-model="homeType" size="mini">
      <el-radio-button label="officetel">오피스텔</el-radio-button>
      <el-radio-button label="apartment">아파트</el-radio-button>
      <el-radio-button label="single">단독다가구</el-radio-button>
      <el-radio-button label="multiple">연립다세대</el-radio-button>
    </el-radio-group>
    <div class="wrapper">
      <div class="longBox" v-for="(item, index) in userSavedList" :key="index">
        <div class="innerBox">
          {{ item.city }}
          <button v-on:click="deleteUserInterest(item.city)">del</button>
        </div>
        <LineChart
          :passData="passData[item.city]"
          class="chart"
          v-if="loaded"
        />
      </div>
    </div>
  </div>
</template>

<script>
import store from "../store/store";
import axios from "axios";
import LineChart from "../components/charts/LineChart";

export default {
  name: "MyPage",
  components: {
    LineChart,
  },
  mounted: function() {
    if (this.$cookies.get("userToken")) {
      this.getUserInterestList();
    } else {
      alert("로그인해주세요");
      this.$router.push("/login");
    }
  },
  data() {
    return {
      userSavedList: [],
      passData: {},
      loaded: {},
      homeType: "officetel",
    };
  },
  watch: {
    homeType: function() {
      this.getUserInterestList();
    },
  },
  methods: {
    getCityData(injectData) {
      let userToken = this.$cookies.get("userToken");
      axios
        .post(
          store.state.SPRING_SERVER + "prefixSearch",
          { city: injectData, homeType: this.homeType },
          { headers: { Authorization: "Bearer " + userToken } }
        )
        .then((res) => {
          this.loaded = false;
          let labels = [];
          let datas = [];
          for (let data of res.data.aggregations.result.buckets) {
            if (data.translated) {
              labels.push(data.key_as_string);
              datas.push(data.translated.value);
            }
          }
          this.passData[injectData] = {
            labels: labels,
            datasets: [{ data: datas, label: "10평당 합계지수" }],
          };
          this.loaded = true;
        })
        .catch((err) => {
          alert(err);
        });
    },
    deleteUserInterest(city) {
      console.log(city);
      let userToken = this.$cookies.get("userToken");
      axios
        .post(
          store.state.SPRING_SERVER + "deleteUserInterest",
          { userToken: userToken, city: city },
          { headers: { Authorization: "Bearer " + userToken } }
        )
        .then((res) => {
          res.data;
          alert("삭제되었습니다.");
          location.reload();
        })
        .catch((err) => {
          alert(err);
        });
    },
    getUserInterestList() {
      let userToken = this.$cookies.get("userToken");
      axios
        .post(
          store.state.SPRING_SERVER + "getUserInterestListByUserId",
          { userToken: userToken },
          { headers: { Authorization: "Bearer " + userToken } }
        )
        .then((res) => {
          this.userSavedList = res.data;
          for (let inject of res.data) {
            this.getCityData(inject.city);
          }
        })
        .catch((err) => {
          alert(err);
        });
    },
    logOut() {
      this.$cookies.remove("userToken");
      alert("로그아웃 되었습니다");
      this.$router.push("/");
    },
  },
};
</script>

<template>
  <div id="myPage">
    <br /><br /><br /><br /><br /><br />
    MyPage
    <button v-on:click="logOut">
      logout
    </button>
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
  created: function() {},
  mounted: function() {
    this.getUserInterestList();
  },
  data() {
    return {
      userSavedList: [],
      passData: {},
      loaded: {},
    };
  },
  methods: {
    getCityData(injectData) {
      let userToken = this.$cookies.get("userToken");
      axios
        .post(
          store.state.SPRING_SERVER + "officetelPrefixSearch",
          { city: injectData },
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

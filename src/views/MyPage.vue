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
          {{item.city}}
          <button v-on:click="deleteUserInterest(item.city)">del</button>
        </div>
        <LineChart :passData="passData[item.city]" class="chart"/>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../store/store";
import axios from 'axios';
import LineChart from '../components/charts/LineChart'

export default {
  name: "MyPage",
  components: {
    LineChart
  },
  created: function() {
    },
  mounted: function() {
    this.getUserInterestList();

  },
  data() {
    return {
      userSavedList: [],
      passData: {}
    }
  },
  methods: {
    getCityData(injectData) {
      let passData = {};
      let userToken = this.$cookies.get("userToken");
      axios.post(store.state.BACK_SERVER_LOCAL + "officetelPrefixSearch", 
      {"city": injectData},
      {headers:{"Authorization": "Bearer " + userToken}}
      ).then(res => {
          let labels = [];
          let datas = [];
          for (let data of res.data.aggregations.result.buckets) {
            if (data.translated) {
              labels.push(data.key_as_string);
              datas.push(data.translated.value);
            }
          }
          passData = [this.passData]

          passData[0][injectData] = {
            labels: labels,
            datasets: [{ data: datas, label: "10평 합계지수" }],
          };

          this.passData = passData[0];

          console.log(this.passData);
        }).catch(err => {
        alert(err);
      })
    },
    deleteUserInterest(city) {
      console.log(city);
      let userToken = this.$cookies.get("userToken");
      axios.post(store.state.BACK_SERVER_LOCAL + "deleteUserInterest", 
        {"userToken": userToken, "city": city}, 
        {headers:{"Authorization": "Bearer " + userToken}}
      ).then(res => {
        res.data
        alert("삭제되었습니다.")
        location.reload()
      }).catch(err =>{
        alert(err);
      })
    },
    getUserInterestList() {
      let userToken = this.$cookies.get("userToken");
      axios.post(store.state.BACK_SERVER_LOCAL + "getUserInterestListByUserId", 
        {"userToken": userToken}, 
        {headers:{"Authorization": "Bearer " + userToken}}
      ).then(res => {
        this.userSavedList = res.data;
        for (let inject of res.data) {
          this.getCityData(inject.city);
        } 
      }).catch(err =>{
        alert(err);
      })
    },
    logOut() {
      this.$cookies.remove("userToken");
      alert("로그아웃 되었습니다");
      this.$router.push("/");
    },
  },
};
</script>

<template>
  <div>
    <div id="loading" v-if="loading"></div>
    <br />분석 페이지 <br />
    <br /><br /><br /><br />
    <div class="top-long-box"><br>
        한정지을 지역은 넓은 곳에서부터 prefix 개념으로 사용됩니다. (ex. 아무것도
        안 쓸 경우 전국, '서울특별시' 까지 쓸 경우 서울특별시, '서울특별시 마포구'
        까지 쓸 경우 마포구까지 한정됩니다. 시/도 부터 써주셔야 합니다.)
      <br><br>
      <div class="searchReprt">
        <el-autocomplete
          class="inline-input"
          v-model="city"
          :fetch-suggestions="querySearch"
          placeholder="한정지을 지역(선택)"
          :trigger-on-focus="false"
          @select="handleSelect"
        ></el-autocomplete>
        <el-button type="primary" icon="el-icon-search" v-on:click="getData"
          >Search</el-button
        >
        <el-button type="primary" icon="el-icon-search" v-on:click="analyze"
          >Analyze</el-button
        >
    </div>
    </div>
    <div class="reportCharts">
      <LineChart class="chart" :passData="passData" />
      <LineChart class="miniChart" :passData="passTestedData"/>
      <LineChart class="miniChart" :passData="passAnalyzedData"/>
    </div>

    <div class="reportBottom">
      여기서의 합계 지수는, 월세 + 보증금 * 전월세전환률 / 12개월 의 수치로, 평균
      전월세 전환률은 약 5~6프로로 추산합니다. <br /><br />
      <button v-on:click="saveData">분석 리포트 다운로드</button>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import LineChart from "../components/charts/LineChart";

export default {
  name: "About",
  components: {
    LineChart,
  },
  data() {
    return {
      city: "",
      passData: {},
      allCitys: [],
      allDatas: {},
      forAnalyze: [],
      passAnalyzedData: {},
      passTestedData: {},
      loading: false
    };
  },
  created: function() {
    this.getData();
  },
  methods: {
    analyze: function() {
      this.loading = true;
      axios.post("http://localhost:5000/", {
        data: this.forAnalyze
      }).then(res => {
        console.log(res.data);

        let testLabels = []
        for (let i = 1; i <= 12; i++) {
          testLabels.push(13-i + '개월 전')
        }

        this.passTestedData = {
          labels: testLabels,
          datasets: [
            { data: this.forAnalyze.slice(this.forAnalyze.length - 12), label: "10평 실제 데이터", backgroundColor: '#66B1FF'},
            { data: res.data.test, label: "10평 분석 테스트", backgroundColor: '#12B1FF'},
          ],
        };

        let labels = []
        for (let i = 1; i <= 12; i++) {
          labels.push(i + '개월 후')
        }

        this.passAnalyzedData = {
          labels: labels,
          datasets: [
            { data: res.data.result, label: "10평 분석 결과" },
          ],
        };
        this.loading = false;
      }).catch(error => {
        console.log(error);
        this.loading = false;
      })
    },
    saveData: function() {
      let data = this.allDatas;

      let jsonData = JSON.stringify(data);

      function download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
      }
      download(jsonData, "json.txt", "text/plain");
    },
    getAllCities: function() {
      axios
        .post("http://localhost:9200/officetel-rent-data/_search", {
          size: 0,
          aggs: {
            group_by_state: {
              terms: {
                size: 10000000,
                field: "시군구",
              },
            },
          },
        })
        .then((res) => {
          res.data.aggregations.group_by_state.buckets.map((val) => {
            this.allCitys.push({ value: val.key });
          });
        });
    },
    getData: function() {
      let userToken = this.$coookies.get("userToken");
      let passCity = this.city;
      axios
        .post("http://localhost:9200/officetel-rent-data/_search", 
      {"city": passCity},
      {headers:{"Authorization": "Bearer " + userToken}})
        .then((res) => {
          console.log(res.data);
          let labels = [];
          let datas = [];
          for (let data of res.data.aggregations.result.buckets) {
            if (data.translated) {
              labels.push(data.key_as_string);
              datas.push(data.translated.value);
            }
          }

          this.forAnalyze = datas;
          this.allDatas[passCity] = { labels: labels, datas: datas };
          this.passData = {
            labels: labels,
            datasets: [{ data: datas, label: "10평 합계지수" }],
          };
        });
    },
    querySearch(queryString, cb) {
      var results = this.allCitys.filter((el) => {
        return el.value.match(queryString);
      });
      cb(results);
    },
    handleSelect(item) {
      console.log(item);
    },
  },
  mounted() {
    this.getAllCities();
  },
};
</script>

<style></style>

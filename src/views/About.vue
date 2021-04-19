<template>
  <div>
    <br />분석 페이지 <br />
    <br /><br /><br /><br />
    <div>
      한정지을 지역은 넓은 곳에서부터 prefix 개념으로 사용됩니다. (ex. 아무것도
      안 쓸 경우 전국, '서울특별시' 까지 쓸 경우 서울특별시, '서울특별시 마포구'
      까지 쓸 경우 마포구까지 한정됩니다. 시/도 부터 써주셔야 합니다.)
    </div>
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
    </div>
    <LineChart :passData="passData" style="width: 50vh" /><br />

    여기서의 합계 지수는, 월세 + 보증금 * 전월세전환률 / 12개월 의 수치로, 평균
    전월세 전환률은 약 5~6프로로 추산합니다. <br /><br />

    <button v-on:click="saveData">분석 리포트 다운로드</button>
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
    };
  },
  created: function() {
    this.getData();
  },
  methods: {
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
      let passCity = this.city;
      axios
        .post("http://localhost:9200/officetel-rent-data/_search", {
          size: 0,
          query: {
            bool: {
              must: [{ prefix: { 시군구: this.city } }],
            },
          },
          aggs: {
            result: {
              date_histogram: {
                field: "@timestamp",
                calendar_interval: "month",
                format: "yyyy-MM",
              },
              aggs: {
                면적: {
                  avg: { field: "area" },
                },
                보증금: { avg: { field: "deposit" } },
                월세: { avg: { field: "rent" } },
                translated: {
                  bucket_script: {
                    buckets_path: {
                      v1: "면적",
                      v2: "월세",
                      v3: "보증금",
                    },
                    script:
                      "(params.v2 + (params.v3 * 0.06 /12)) / params.v1 * 33",
                  },
                },
              },
            },
          },
        })
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

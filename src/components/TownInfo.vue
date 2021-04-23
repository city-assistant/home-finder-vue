<template>
  <div id="townInfo">
    <div v-if="needRent == 0">분석 정보가 부족해 차트로 표현되지 않았습니다.</div>
    {{ currentData }} 정보<br /><br />
      <el-button
        type="primary"
        icon="el-icon-save"
        >Save</el-button><br><br>
    전월세 전환률 설정 : {{ transferRatio }}%
    <!-- https://kosis.kr/statHtml/statHtml.do?orgId=408&tblId=DT_30404_N0010 참고 -->
    <div class="block">
      <el-slider
        style="margin: 10px"
        v-model="transferRatio"
        step="0.1"
        show-stops
        :max="10"
      >
      </el-slider>
    </div>
    <BarChart :passData="translatedData" /><br>
    가용 보증금 : {{ possibleDeposit }} 만원
    <div class="block">
      <el-slider
        style="margin: 10px"
        v-model="possibleDeposit"
        step="100"
        show-stops
        :max="10000"
      >
      </el-slider>
    </div>
    10평(33제곱미터)당 <br />
    예상 필요 월세 : {{ needRent }} <br /><br />
    <LineChart :passData="passRentData" />
    <LineChart :passData="passDepositData" />
    상권이나 근린, 역, 편의점 등의 정보
  </div>
</template>

<script>
import LineChart from "./charts/LineChart";
import BarChart from "./charts/BarChart";
import axios from "axios";

export default {
  components: {
    LineChart,
    BarChart,
  },
  props: {
    currentData: String,
  },
  data() {
    return {
      passData: {},
      passRentData: {},
      passDepositData: {},
      passSpecificData: {},
      translatedData: {},
      possibleDeposit: 2000,
      transferRatio: 5,
      needRent: 0,
      cheaper: 0,
    };
  },
  mounted: function() {
    this.getChartData(this.currentData);
  },
  watch: {
    currentData: function(data) {
      this.getChartData(data);
    },
    possibleDeposit: function(data) {
      console.log(this.translatedData);
      this.needRent = parseInt(
        this.translatedData.datasets[0].data[
          this.translatedData.datasets[0].data.length - 1
        ] -
          data * ((this.transferRatio * 0.01) / 12)
      );
    },
    transferRatio: function(data) {
      this.updateTranslatedData(data);
    },
    chosenAddress: function(address) {
      this.getSpecificChartData(
        this.currentData,
        address.substring(this.currentData.length + 1, address.length)
      );
    },
  },
  methods: {
    updateTranslatedData(data) {
      let i = 0;
      let labels = [];
      let tempData = [];
      for (let temp of this.passData.datasets[0].data) {
        temp;
        labels.push(this.passData.labels[i]);
        tempData.push(
          this.passData.datasets[0].data[i] * ((data * 0.01) / 12) +
            this.passData.datasets[1].data[i]
        );
        i++;
      }
      this.translatedData = {
        labels: labels,
        datasets: [{ data: tempData, label: "10평당 합계 지수(월 만원)" }],
      };
      this.needRent = parseInt(
        this.translatedData.datasets[0].data[
          this.translatedData.datasets[0].data.length - 1
        ] -
          this.possibleDeposit * ((this.transferRatio * 0.01) / 12)
      );
      console.log(this.translatedData);
    },
    getSpecificChartData(city, road) {
      axios
        .post("http://localhost:9200/officetel-rent-data/_search", {
          size: 0,
          sort: {
            "@timestamp": {
              order: "asc",
            },
          },
          query: {
            bool: {
              must: [{ match: { 시군구: city } }, { match: { 도로명: road } }],
            },
          },
          aggs: {
            result: {
              date_histogram: {
                field: "@timestamp",
                calendar_interval: "year",
                format: "yyyy",
              },
              aggs: {
                면적: {
                  avg: { field: "area" },
                },
                보증금: { avg: { field: "deposit" } },
                월세: { avg: { field: "rent" } },
                "10평당 월세": {
                  bucket_script: {
                    buckets_path: {
                      v1: "면적",
                      v2: "월세",
                    },
                    script: "params.v2 / params.v1 * 33",
                  },
                },
                "10평당 보증금": {
                  bucket_script: {
                    buckets_path: {
                      v1: "면적",
                      v2: "보증금",
                    },
                    script: "params.v2 / params.v1 * 33",
                  },
                },
              },
            },
          },
        })
        .then((res) => {
          let labels = [];
          let tempData1 = { data: [], label: "10평당 보증금" };
          let tempData2 = { data: [], label: "10평당 월세" };
          for (let data of res.data.aggregations.result.buckets) {
            labels.push(data.key_as_string);
            tempData1["data"].push(data["10평당 보증금"].value);
            tempData2["data"].push(data["10평당 월세"].value);
          }

          this.passSpecificData = {
            labels: labels,
            datasets: [tempData1, tempData2],
          };
        });
    },
    getChartData(val) {
      axios
        .post("http://localhost:9200/officetel-rent-data/_search", {
          size: 0,
          sort: {
            "@timestamp": {
              order: "asc",
            },
          },
          query: {
            bool: {
              must: [
                { match: { 전월세구분: "월세" } },
                { prefix: { 시군구: { value: val } } },
              ],
            },
          },
          aggs: {
            result: {
              date_histogram: {
                field: "@timestamp",
                calendar_interval: "year",
                format: "yyyy",
              },
              aggs: {
                면적: {
                  avg: { field: "area" },
                },
                보증금: { avg: { field: "deposit" } },
                월세: { avg: { field: "rent" } },
                "10평당 월세": {
                  bucket_script: {
                    buckets_path: {
                      v1: "면적",
                      v2: "월세",
                    },
                    script: "params.v2 / params.v1 * 33",
                  },
                },
                "10평당 보증금": {
                  bucket_script: {
                    buckets_path: {
                      v1: "면적",
                      v2: "보증금",
                    },
                    script: "params.v2 / params.v1 * 33",
                  },
                },
              },
            },
          },
        })
        .then((res) => {
          console.log();
          let labels = [];
          let tempData1 = { data: [], label: "10평당 보증금" };
          let tempData2 = { data: [], label: "10평당 월세" };
          for (let data of res.data.aggregations.result.buckets) {
            labels.push(data.key_as_string);
            tempData1["data"].push(data["10평당 보증금"].value);
            tempData2["data"].push(data["10평당 월세"].value);
          }
          this.passData = {
            labels: labels,
            datasets: [tempData1, tempData2],
          };
          this.passDepositData = {
            labels: labels,
            datasets: [tempData1],
          };
          this.passRentData = {
            labels: labels,
            datasets: [tempData2],
          };
          this.updateTranslatedData(this.transferRatio);
        });
    },
  },
};
</script>

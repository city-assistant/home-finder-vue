<template>
  <div>
    <div class="sidebar">
      <div class="sub-title">목적지 위치 : {{ chosenPoint }}</div>
      <el-autocomplete
        class="inline-input"
        v-model="searchAddress"
        :fetch-suggestions="querySearch"
        placeholder="한정지을 지역(선택)"
        :trigger-on-focus="false"
        @select="handleSelect"
      ></el-autocomplete>
      <el-button type="primary" icon="el-icon-search" v-on:click="searchCities"
        >Search</el-button
      >
      <div id="filters">
        <filter-items
          v-on:areaUpdate="areaUpdate"
          v-on:distanceUpdate="distanceUpdate"
          v-on:rentUpdate="rentUpdate"
          v-on:depositUpdate="depositUpdate"
          v-on:leaseTypeUpdate="leaseTypeUpdate"
        />
      </div>
    </div>
    <IntermediateResult
      v-on:emitAddress="emphasizeMarker"
      :searchResult="searchResult"
      :officeName="newOfficeName"
    />
    <Map
      :searchResult="searchResult"
      :searchCitiesResult="searchCitiesResult"
      v-on:chosenPointUpdate="chosenPointUpdate"
      v-on:currentDataUpdate="currentDataUpdate"
    />
  </div>
</template>

<script>
import FilterItems from "../components/FilterItems.vue";
import IntermediateResult from "./IntermediateResult.vue";
import Map from "../components/Map.vue";

import axios from "axios";

export default {
  name: "Sidebar",
  props: {},
  data() {
    return {
      links: [],
      searchAddress: "",
      leaseType: "월세",
      distance: 5,
      deposit: [0, 5000],
      rent: [0, 50],
      area: 30,
      chosenPoint: [37.566409573096465, 126.97772421964528],
      officeName: [],
      officeAddr: [],
      newOfficeName: [],
      searchCitiesResult: []
    };
  },
  components: { FilterItems, IntermediateResult, Map },
  methods: {
    currentDataUpdate(val) {
      this.searchQuery(val)
    },
    emphasizeMarker(val) {
      this.emphasizedMarker = val;
    },
    areaUpdate(val) {
      this.areaUpdate = val;
    },
    chosenPointUpdate(val) {
      this.chosenPoint = val;
    },
    distanceUpdate(val) {
      this.distance = val;
    },
    leaseTypeUpdate(val) {
      this.leaseType = val;
    },
    depositUpdate(val) {
      this.deposit = val;
    },
    rentUpdate(val) {
      this.rent = val;
    },
    searchCities() {
      let translatedMin = ((this.rent[0] + this.deposit[0] * 0.05 / 12) * 33 / this.area);
      let translatedMax = ((this.rent[1] + this.deposit[1] * 0.05 / 12) * 33 / this.area);
      axios.post("http://localhost:9200/officetel-rent-data/_search", {
        "size": 0,
        "query": {
          "bool": {
            "must": [
              {"prefix": {"시군구": this.searchAddress}},
              {"match": {"전월세구분": this.leaseType}}
            ],
            "filter": [{"range": {"yyyymmdd": {"gte": 20200000}}},
              {
                "geo_distance": {
                  "distance": this.distance + "km",
                  "location": {
                    "lat": this.chosenPoint[0],
                    "lon": this.chosenPoint[1],
                  },
                },
              }
            ]
          }
        },
        "aggs": {"group_by_state": {"terms": {"size": 10000000,"field": "시군구"},
            "aggs": {
              "location": {"geo_bounds": {"field": "location"}},
              "면적": {"avg": {"field": "area"}},
              "보증금": {"avg": {"field": "deposit"}},
              "월세": {"avg": {"field": "rent"}},
              "translated": {
                "bucket_script": {
                  "buckets_path": {
                    "v1": "면적",
                    "v2": "월세",
                    "v3": "보증금"
                  },
                  "script": "(params.v2 + params.v3 * 0.06 /12) / params.v1 * 33"
                }
              },
              "필터": {
                "bucket_selector": {
                  "buckets_path": {
                    "v1": "translated"
                  },
                  "script": translatedMin + " < params.v1" + " && " + "params.v1 < " + translatedMax
                }
              }
            }
          }
        }
      }).then(res => {
        this.searchCitiesResult = res.data.aggregations.group_by_state.buckets;
      })
    },
    searchQuery(val) {
      axios.post("http://localhost:9200/officetel-rent-data/_search", {
          size: 1000,
          query: {
            bool: {
              must: [
                {
                  prefix: {
                    시군구: val,
                  }
                },
                {
                  match: {
                    전월세구분: this.leaseType,
                  }
                },
              ]
            }
          }
        })
        .then((res) => {
          this.searchResult = res.data.hits.hits;
          this.mappingQuery();
        });
    },
    searchArround() {},
    querySearch(queryString, cb) {
      var results = this.links.filter((el) => {
        return el.value.match(queryString);
      });
      cb(results);
    },
    loadAll() {
      axios
        .post("http://localhost:9200/officetel-rent-data/_search", {
          size: 0,
          query: {
            prefix: {
              시군구: {
                value: "서울",
              },
            },
          },
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
          console.log(res.data.aggregations.group_by_state.buckets);
          res.data.aggregations.group_by_state.buckets.map((val) => {
            this.links.push({ value: val.key });
          });
        });
    },
    handleSelect(item) {
      console.log(item);
    },
     mappingQuery() {
       //초기화
      this.officeName = [];
      this.officeAddr = []
      this.newOfficeName = [];

      //중복제거
      for(let index in this.searchResult ){
        if(this.officeName.indexOf(this.searchResult[index]._source.단지명) == -1){
            this.officeName.push(this.searchResult[index]._source.단지명)
            this.officeAddr.push(this.searchResult[index]._source.시군구.split(' '));
          }
        }
        console.log(this.officeName)
      //key값 지정
      for(let item in this.officeName){
          if(this.officeName[item] != undefined){
            this.newOfficeName.push({value:this.officeName[item], addr: this.officeAddr[item][this.officeAddr[item].length-1]})
          }
      }
       console.log(this.newOfficeName)
    }
  },
  mounted() {
    this.loadAll();
  },
};
</script>

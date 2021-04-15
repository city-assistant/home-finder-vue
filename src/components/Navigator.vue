<template>
  <div>
    <div class="sidebar">
      <div class="sub-title">목적지 위치 : {{ chosenPoint }} </div>
      <el-autocomplete
        class="inline-input"
        v-model="searchAddress"
        :fetch-suggestions="querySearch"
        placeholder="한정지을 지역(선택)"
        :trigger-on-focus="false"
        @select="handleSelect"
      ></el-autocomplete>
      <el-button type="primary" icon="el-icon-search" v-on:click="searchQuery">Search</el-button>
      <div id="filters">
        <filter-items v-on:areaUpdate="areaUpdate" v-on:distanceUpdate="distanceUpdate" v-on:rentUpdate="rentUpdate" v-on:depositUpdate="depositUpdate" v-on:leaseTypeUpdate="leaseTypeUpdate"/>
      </div>
    </div>
    <IntermediateResult v-on:emitAddress="emphasizeMarker" :searchResult="searchResult"/>
    <Map :emphasizedMarker="emphasizedMarker" :searchResult="searchResult" v-on:chosenPointUpdate="chosenPointUpdate" />
  </div>
</template>

<script>
import FilterItems from "../components/FilterItems.vue";
import IntermediateResult from './IntermediateResult.vue';
import Map from '../components/Map.vue';

import axios from 'axios';

export default {
  name: "Sidebar",
  props: {
  },
  data() {
    return {
      links: [],
      searchAddress: '',
      leaseType: '월세',
      distance: 5,
      deposit: [0, 25000],
      rent: [0, 100],
      area: [10, 50],
      chosenPoint: [37.566409573096465, 126.97772421964528],
      emphasizedMarker: '',
      searchResult: []
    }
  },
  components: { FilterItems, IntermediateResult, Map },
  methods: {
    emphasizeMarker(val){
      this.emphasizedMarker = val;
    },
    areaUpdate(val) {
      this.areaUpdate = val;
    },
    chosenPointUpdate(val) {
      this.chosenPoint = val;
    },
    distanceUpdate(val) {
      this.distance = val
    },
    leaseTypeUpdate(val) {
      this.leaseType = val
    },
    depositUpdate(val) {
      this.deposit = val
    },
    rentUpdate(val) {
      this.rent = val
    },
    searchQuery() {
      axios.post('http://localhost:9200/officetel-rent-data/_search', {
        "size":1000,
        "query": {
          "bool": {
            "must": [
              {
                "prefix": {
                  "시군구": this.searchAddress
                }
              },{
                "match": {
                  "전월세구분": this.leaseType
                }
              }
            ],
            "filter": [
              {
                "geo_distance": {
                  "distance": this.distance + "km",
                  "location": {
                    "lat": this.chosenPoint[0],
                    "lon": this.chosenPoint[1]
                  }
                }
              },{
                "range": {
                  "yyyymmdd": {
                    "gte": 20200000
                  }
                }
              },{
                "range": {
                  "area": {
                    "gte": this.area[0],
                    "lte": this.area[1]
                  }
                }
              },{
                "range": {
                  "deposit": {
                    "gte": this.deposit[0],
                    "lte": this.deposit[1]
                  }
                }
              },{
                "range": {
                  "rent": {
                    "gte": this.rent[0],
                    "lte": this.rent[1]
                  }
                }
              }
            ]
          }
        }
      }).then(res => { 
        console.log(res.data.hits.hits)
        this.searchResult = res.data.hits.hits
      })
    },
    searchArround() {
      
    },
    // 중복 제거
    mappingQuery() {
      for(let i = 0; i < this.searchResult.length; i++ ){
      if(this.searchResult.indexOf(this.searchResult._source.단지명) != -1){
        console.log("값이잇나")
           this.searchResult.push(this.searchResult[i])
        }
      }
      return this.searchResult;
    },
    querySearch(queryString, cb) {
        var results = this.links.filter((el) => {
          return el.value.match(queryString);
        });
      cb(results);
    },
    loadAll() {
      axios
        .post("http://localhost:9200/officetel-rent-data/_search",{
          size: 0,
          query: {
            prefix: {
              시군구: {
                value: "서울"
              }
            }
          }, 
          aggs: {
            group_by_state: {
              terms: {
                size: 10000000, 
                field: "시군구"
              }
            }
          }
        })
        .then((res) => {
          console.log(res.data.aggregations.group_by_state.buckets);
          res.data.aggregations.group_by_state.buckets.map(val => {
              this.links.push({value: val.key});
          });
          console.log('======================================')
          console.log(this.links)
        });
    },
    handleSelect(item) {
      console.log(item);
    },
  },
  mounted() {
    this.loadAll();
  },
};
</script>

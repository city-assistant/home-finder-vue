<template>
  <div>
    <div class="sidebar">
      <div class="sub-title">목적지 검색</div>
      <el-autocomplete
        class="inline-input"
        v-model="searchAddress"
        :fetch-suggestions="querySearch"
        placeholder="목적지를 입력해주세요"
        :trigger-on-focus="false"
        @select="handleSelect"
      ></el-autocomplete>
      <el-button type="primary" icon="el-icon-search" v-on:click="searchQuery">Search</el-button>
      <div id="filters">
        <filter-items />
      </div>
    </div>
    <IntermediateResult :searchResult="searchResult"/>
    <Map :searchResult="searchResult"/>
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
    searchResult: String
  },
  data() {
    return {
      searchAddress: '',
    }
  },
  components: { FilterItems, IntermediateResult, Map },
  methods: {
    searchQuery() {
      axios.post('http://localhost:9200/officetel-rent-data/_search', {
        "size":100,
        "query": {
          "bool": {
            "must": [
                {
                  "prefix": {
                  "시군구": this.searchAddress
                  }
                }
            ],
            "filter": [
              {
                "range": {
                  "yyyymmdd": {
                    "gte": 20200000
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
    }
  },
};
</script>

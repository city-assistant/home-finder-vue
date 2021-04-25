<template>
  <div>
    <div class="sidebar">
      <div class="sub-title" v-if="!townInfoVisible">
        목적지 위치 : {{ chosenPoint }}
      </div>
      <el-autocomplete
        class="inline-input"
        v-model="searchAddress"
        :fetch-suggestions="querySearch"
        placeholder="한정지을 지역(선택)"
        :trigger-on-focus="false"
        @select="handleSelect"
        v-if="!townInfoVisible"
      ></el-autocomplete>
      <el-button
        type="primary"
        icon="el-icon-search"
        v-on:click="searchCities"
        v-if="!townInfoVisible"
        >Search</el-button
      >
      <el-button
        type="primary"
        icon="el-icon-back"
        v-on:click="searchCities"
        v-if="townInfoVisible"
        >Back</el-button
      >
      <div id="filters" v-if="!townInfoVisible">
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
      v-if="townInfoVisible"
    />
    <Map
      :searchResult="searchResult"
      :searchCitiesResult="searchCitiesResult"
      :townInfoVisible="townInfoVisible"
      v-on:updateTownInfoVisible="updateTownInfoVisible"
      v-on:chosenPointUpdate="chosenPointUpdate"
      v-on:currentDataUpdate="currentDataUpdate"
      v-on:citiesResultUpdate="citiesResultUpdate"
    />
    <CitiesResult
      v-if="!townInfoVisible && citiesResult != []"
      :searchResult="citiesResult"
    />
  </div>
</template>

<script>
import FilterItems from "./FilterItems.vue";
import CitiesResult from "./CitiesResult.vue";
import IntermediateResult from "./IntermediateResult.vue";
import Map from "../components/Map.vue";
import store from "../store/store";
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
      chosenPoint: [37.52, 126.98],
      officeName: [],
      officeAddr: [],
      officeRoad: [],
      newOfficeName: [],
      searchCitiesResult: [],
      townInfoVisible: false,
      citiesResult: [],
    };
  },
  components: { FilterItems, IntermediateResult, Map, CitiesResult },
  methods: {
    citiesResultUpdate(val) {
      this.citiesResult = val;
    },
    updateTownInfoVisible(val) {
      this.townInfoVisible = val;
    },
    currentDataUpdate(val) {
      this.searchQuery(val);
    },
    emphasizeMarker(val) {
      this.emphasizedMarker = val;
    },
    areaUpdate(val) {
      this.areaUpdate = val;
    },
    chosenPointUpdate(val) {
      this.chosenPoint = [
        parseInt(val[0] * 100) / 100,
        parseInt(val[1] * 100) / 100,
      ];
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
      this.townInfoVisible = false;
      let translatedMin =
        ((this.rent[0] + (this.deposit[0] * 0.05) / 12) * 33) / this.area;
      let translatedMax =
        ((this.rent[1] + (this.deposit[1] * 0.05) / 12) * 33) / this.area;
      axios
        .post(
          store.state.SPRING_SERVER + "searchCities",
          {
            city: this.searchAddress,
            leaseType: this.leaseType,
            distance: this.distance,
            lat: this.chosenPoint[0],
            lon: this.chosenPoint[1],
            translatedMin: translatedMin,
            translatedMax: translatedMax,
          },
          {
            headers: {
              Authorization: "Bearer " + this.$cookies.get("userToken"),
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          this.searchCitiesResult =
            res.data.aggregations.group_by_state.buckets;
          this.citiesResult = this.searchCitiesResult;
        })
        .catch((err) => {
          alert(err);
        });
    },
    searchQuery(val) {
      axios
        .post(store.state.SPRING_SERVER + "searchQuery", {
          city: val,
          leaseType: this.leaseType,
        })
        .then((res) => {
          this.searchResult = res.data.hits.hits;
          this.mappingQuery();
        });
    },
    searchArround() {},
    querySearch(queryString, cb) {
      let results = this.links.filter((el) => {
        return el.value.match(queryString);
      });
      cb(results);
    },
    loadAll() {
      axios.get(store.state.SPRING_SERVER + "getAllCities").then((res) => {
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
      this.officeAddr = [];
      this.officeRoad = [];
      this.newOfficeName = [];

      //중복제거
      for (let index in this.searchResult) {
        if (
          this.officeName.indexOf(this.searchResult[index]._source.단지명) == -1
        ) {
          this.officeName.push(this.searchResult[index]._source.단지명);
          this.officeRoad.push(this.searchResult[index]._source.도로명);
          this.officeAddr.push(
            this.searchResult[index]._source.시군구.split(" ")
          );
        }
      }
      console.log(this.officeName);
      //key값 지정
      for (let item in this.officeName) {
        if (this.officeName[item] != undefined) {
          this.newOfficeName.push({
            value: this.officeName[item],
            road: this.officeRoad[item],
            addr: this.officeAddr[item][this.officeAddr[item].length - 1],
          });
        }
      }
    },
  },
  mounted() {
    this.loadAll();
  },
};
</script>

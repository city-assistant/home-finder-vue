<template>
  <div>
    <div id="map" class="map"></div>
    <town-info :currentData="currentData" v-if="townInfoVisible" />
  </div>
</template>

<script>
import axios from "axios";
import store from "../store/store"
import townInfo from "./TownInfo.vue";
import constant from "../store/constant";
import eventbus from "../store/EventBus";
eventbus;
export default {
  props: {
    searchResult: Array,
    searchCitiesResult: Array,
    emphasizedMarker: String,
    townInfoVisible: Boolean,
  },
  components: {
    townInfo,
  },
  data() {
    return {
      map: undefined,
      geocoder: undefined,
      clusterer: undefined,
      pickedMarker: undefined,
      searchCircle: undefined,
      cityMarkerList: [],
      buildingMarkerList: [],
      currentData: "",
      chosenAddress: "",
      chosenPoint: [],
    };
  },
  mounted() {
    window.kakao && window.kakao.maps
      ? this.initMap()
      : this.addKakaoMapScript();
  },
  watch: {
    chosenAddress: function(val) {
      this.$emit("updateChosenAddress", val);
    },
    emphasizedMarker: function(val) {
      console.log(val);
    },
    chosenPoint: function(val) {
      this.$emit("chosenPointUpdate", val);
    },
    currentData: function(val) {
      this.$emit("currentDataUpdate", val);
    },
    searchCitiesResult: function(val) {
      this.buildingMarkerList.map((marker) => marker.setMap(null));
      this.cityMarkerList.map((marker) => marker.setMap(null));
      this.buildingMarkerList = [];
      this.cityMarkerList = [];
      for (let data of val) {
        if (data.location.bounds) {
          let lat = data.location.bounds.top_left.lat;
          let long = data.location.bounds.top_left.lon;
          let degree = parseInt((data.translated.value * 10) / 200);
          this.setCityMarker(lat, long, data.key, data.key, degree * 2);
        }
      }
      this.map.setLevel(7);
      this.map.setCenter(this.pickedMarker.getPosition());
    },
    searchResult: function(val) {
      this.cityMarkerList.map((marker) => marker.setMap(null));
      const valPatch = val.map(
        (result) =>
          result._source["시군구"] +
          " " +
          result._source["도로명"] +
          "$" +
          result._source["시군구"]
      );
      const setValPatch = new Set(valPatch);

      this.buildingMarkerList.map((marker) => marker.setMap(null));
      this.buildingMarkerList = [];
      if (val != []) {
        let lat = parseFloat(val[0]._source.location.split(",")[0]);
        let long = parseFloat(val[0]._source.location.split(",")[1]);
        for (let result of setValPatch) {
          this.setMarkerFromAddress(result.split("$")[0], result.split("$")[1]);
        }
        // 지도 중심을 이동 시킵니다
        this.map.panTo(new kakao.maps.LatLng(lat, long));
      }
    },
  },
  methods: {
    addKakaoMapScript() {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src =
        "http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=" +
        constant.state.KAKAO_MAP_API_KEY +
        "&libraries=services,clusterer,drawing";
      document.head.appendChild(script);
      this.geocoder = new kakao.maps.services.Geocoder();
    },
    initMap() {
      let container = document.getElementById("map");
      let options = {
        center: new kakao.maps.LatLng(37.52405404265759, 126.98020296411083),
        level: 7,
      };
      this.map = new kakao.maps.Map(container, options);
      this.geocoder = new kakao.maps.services.Geocoder();

      let imageSrc =
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png", // 마커이미지의 주소입니다
        imageSize = new kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
        imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

      let markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );

      this.pickedMarker = new kakao.maps.Marker({
        position: this.map.getCenter(),
        image: markerImage,
      });

      this.pickedMarker.setMap(this.map);
      kakao.maps.event.addListener(this.map, "click", (mouseEvent) => {
        var latlng = mouseEvent.latLng;
        this.pickedMarker.setPosition(latlng);
        this.chosenPoint = [latlng.getLat(), latlng.getLng()];
      });

      this.getTranslatedDataWithLocation();
    },
    setMarkerFromAddress(address, city) {
      this.geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          this.setBuildingMarker(result[0].y, result[0].x, address, city);
        }
      });
    },
    setBuildingMarker(lat, long, address, city) {
      let coords = new kakao.maps.LatLng(lat, long);
      let marker = new kakao.maps.Marker({
        map: this.map,
        position: coords,
        clickable: true,
        text: city,
      });
      kakao.maps.event.addListener(marker, "click", () => {
        this.map.panTo(new kakao.maps.LatLng(lat, long));
        if (this.getChosenAddress() == address) {
          if (document.getElementById("townInfo").style.display == "block") {
            // document.getElementById('townInfo').style.display = 'none';
          } else {
            // document.getElementById('townInfo').style.display = 'block';
          }
        } else {
          // this.alterChosenAddress(address);
          // document.getElementById('townInfo').style.display = 'block';
        }
      });
      this.buildingMarkerList.push(marker);
    },
    setCityMarker(lat, long, address, city, degree) {
      let imageSrc =
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png", // 마커이미지의 주소입니다
        imageSize = new kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
        imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
      let markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );

      let option = {
        map: this.map,
        zIndex: 5,
        center: new kakao.maps.LatLng(lat, long),
        radius: 200,
        strokeWeight: 5,
        strokeColor: "fabdcf",
        strokeOpacity: 1,
        fillColor:
          "#" +
          (16 - degree).toString(16) +
          (16 - degree).toString(16) +
          "abfa",
        fillOpacity: 0.75,
        image: markerImage,
      };
      let marker = new kakao.maps.Circle(option);

      kakao.maps.event.addListener(marker, "mouseover", () => {
        eventbus.$emit("");
        console.log("mouseIn");
      });
      kakao.maps.event.addListener(marker, "mouseout", () => {
        console.log("mouseOut");
      });

      kakao.maps.event.addListener(marker, "click", () => {
        this.cityMarkerList.map((marker) => marker.setMap(null));
        this.map.panTo(new kakao.maps.LatLng(lat, long));
        this.map.setLevel(4);

        if (this.currentData == city) {
          this.map.panTo(marker.getPosition());
          this.$emit("updateTownInfoVisible", true);
        } else {
          this.currentData = city;
          this.$emit("updateTownInfoVisible", true);
          console.log(3);
        }
      });
      this.cityMarkerList.push(marker);
    },
    getTranslatedDataWithLocation() {
      axios.get(store.state.SPRING_SERVER + "getTranslatedDataWithLocation")
        .then((res) => {
          let val = res.data.aggregations.group_by_state.buckets;
          for (let data of val) {
            if (data.location.bounds) {
              let lat = data.location.bounds.top_left.lat;
              let long = data.location.bounds.top_left.lon;
              let degree = parseInt((data.translated.value * 10) / 200);
              this.setCityMarker(lat, long, data.key, data.key, degree * 2);
            }
          }
          this.$emit("citiesResultUpdate", val);
        });
    },
    alterCurrentData(val) {
      this.currentData = val;
    },
    alterChosenAddress(val) {
      this.chosenAddress = val;
    },
    getChosenAddress() {
      return this.chosenAddress;
    },
  },
};
</script>

<template>
  <div>
    <div id="map" class="map"></div>
    <town-info :currentData="currentData" :chosenAddress="chosenAddress"/>
  </div>
</template>

<script>
import axios from 'axios';
import townInfo from './TownInfo.vue';

export default {
  props: {
    searchResult: Array,
    emphasizedMarker: String
  },
  components: {
    townInfo
  },
  data() {
    return {
      map: undefined,
      geocoder: undefined,
      clusterer: undefined,
      markerList: [],
      currentData: "",
      chosenAddress: "",
      chosenPoint: [],
    }
  },
  mounted() {
    window.kakao && window.kakao.maps
      ? this.initMap()
      : this.addKakaoMapScript();
  },
  watch: {
    emphasizedMarker: function(val){
      console.log(val);
    },
    chosenPoint: function(val) {
      this.$emit("chosenPointUpdate", val)
    },
    currentData: function(val) {
      console.log(val);
    },
    searchResult: function(val) {
      const valPatch = val.map((result) => result._source['시군구'] + ' ' + result._source['도로명'] + '$' + result._source['시군구'])
      const setValPatch = new Set(valPatch);
      
      this.currentData = val[0]._source['시군구'];
      this.markerList.map((marker) => marker.setMap(null));
      this.markerList = []
      if (val != []) {
        let lat = parseFloat(val[0]._source.location.split(',')[0]);
        let long = parseFloat(val[0]._source.location.split(',')[1]);
        for (let result of setValPatch) {
          this.setMarkerFromAddress(result.split('$')[0], result.split('$')[1]);
        }
        // 지도 중심을 이동 시킵니다
        this.map.panTo(new kakao.maps.LatLng(lat, long));
      }
    }
  },
  methods: {
    addKakaoMapScript() {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src =
        "http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=6e5e29693162c801d9dcaf92ac0e2c7e&libraries=services,clusterer,drawing";
      document.head.appendChild(script);
      this.geocoder = new kakao.maps.services.Geocoder()
    },
    initMap() {
      let container = document.getElementById('map');
      let options = {
          center: new kakao.maps.LatLng(37.566826, 126.9786567),
          level: 3
      };
      this.map = new kakao.maps.Map(container, options);
      this.geocoder = new kakao.maps.services.Geocoder();

      kakao.maps.event.addListener(this.map, 'click', (mouseEvent) => {        
          // 클릭한 위도, 경도 정보를 가져옵니다 
          var latlng = mouseEvent.latLng;
          var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
          message += '경도는 ' + latlng.getLng() + ' 입니다';
          console.log(message);
          this.chosenPoint = [latlng.getLat(), latlng.getLng()]
      });

      // this.clusterer = new kakao.maps.MarkerClusterer({
      //     map: this.map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
      //     averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
      //     minLevel: 4 // 클러스터 할 최소 지도 레벨 
      // });
    },
    setMarkerFromAddress(address, city) {
      this.geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
            let coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            let marker = new kakao.maps.Marker({
                map: this.map,
                position: coords,
                clickable: true,
                text: address
            });
            kakao.maps.event.addListener(marker, 'click', () => {
              if (this.getChosenAddress() == address) {
                if (document.getElementById('townInfo').style.display == 'block') {
                  document.getElementById('townInfo').style.display = 'none';
                } else {
                  // this.getLocationGeo(city);
                  document.getElementById('townInfo').style.display = 'block';
                }
              } else {
                this.alterChosenAddress(address);
                this.alterCurrentData(city);
                // this.getLocationGeo(city);
                document.getElementById('townInfo').style.display = 'block';
              }
            });
            this.markerList.push(marker);
        } 
      });
    },
    getLocationGeo(city) {
      axios.post('http://localhost:9200/korea-geojson-data/_search',{
          "size": 1,
          "query": {
            "match": {
              "adm_nm": city
            }
          }
      }).then(res => {
        let polygonPath = []
        for (let point of res.data.hits.hits[0]._source.coordinates.coordinates[0][0]) {
          console.log(typeof(point[0]));
          polygonPath.push(new kakao.maps.LatLng(point[1], point[0]))
        }
        // 다각형을 구성하는 좌표 배열입니다. 이 좌표들을 이어서 다각형을 표시합니다
        // let polygonPath = [
        //     new kakao.maps.LatLng(33.45133510810506, 126.57159381623066),
        //     new kakao.maps.LatLng(33.44955812811862, 126.5713551811832),
        //     new kakao.maps.LatLng(33.449986291544086, 126.57263296172184),
        //     new kakao.maps.LatLng(33.450682513554554, 126.57321034054742),
        //     new kakao.maps.LatLng(33.451346760004206, 126.57235740081413) 
        // ];

        // 지도에 표시할 다각형을 생성합니다
        var polygon = new kakao.maps.Polygon({
            path:polygonPath, // 그려질 다각형의 좌표 배열입니다
            strokeWeight: 3, // 선의 두께입니다
            strokeColor: '#39DE2A', // 선의 색깔입니다
            strokeOpacity: 0.8, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle: 'longdash', // 선의 스타일입니다
            fillColor: '#A2FF99', // 채우기 색깔입니다
            fillOpacity: 0.7 // 채우기 불투명도 입니다
        });

        // 지도에 다각형을 표시합니다
        console.log(polygonPath);
        console.log(polygon);
        polygon.setMap(this.map);
      })

    },
    alterCurrentData(val) {
      this.currentData = val;
    },
    alterChosenAddress(val) {
      this.chosenAddress = val;
    },
    getChosenAddress() {
      return this.chosenAddress
    }
  }
};
</script>
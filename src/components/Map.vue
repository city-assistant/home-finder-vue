<template>
  <div>
    <div id="map" class="map"></div>
    <town-info :currentData="currentData"/>
  </div>
</template>

<script>
import axios from 'axios';
import townInfo from './TownInfo.vue';
import constant from '../store/constant';

export default {
  props: {
    searchResult: Array,
    searchCitiesResult: Array,
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
      pickedMarker: undefined,
      markerList: [],
      currentData: "",
      chosenAddress: "",
      chosenPoint: []
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
      this.$emit("currentDataUpdate", val)
    },
    searchCitiesResult: function(val) {
      this.markerList.map((marker) => marker.setMap(null));
      this.markerList = []
        for (let data of val) {
          if (data.location.bounds) {
            let lat = data.location.bounds.top_left.lat;
            let long = data.location.bounds.top_left.lon;
            this.setMarker(lat, long, data.key, data.key);
          }
        }
    },
    searchResult: function(val) {
      const valPatch = val.map((result) => result._source['시군구'] + ' ' + result._source['도로명'] + '$' + result._source['시군구'])
      const setValPatch = new Set(valPatch);
      
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
        "http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=" + constant.state.KAKAO_MAP_API_KEY + "&libraries=services,clusterer,drawing";
      document.head.appendChild(script);
      this.geocoder = new kakao.maps.services.Geocoder()
    },
    initMap() {
      let container = document.getElementById('map');
      let options = {
          center: new kakao.maps.LatLng(37.52405404265759, 126.98020296411083),
          level: 7
      };
      this.map = new kakao.maps.Map(container, options);
      this.geocoder = new kakao.maps.services.Geocoder();

      let imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png', // 마커이미지의 주소입니다    
          imageSize = new kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
          imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
            
      // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
      let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

      this.pickedMarker = new kakao.maps.Marker({ 
        // 지도 중심좌표에 마커를 생성합니다 
        position: this.map.getCenter(),
        image: markerImage
      }); 

      // 지도에 마커를 표시합니다
      this.pickedMarker.setMap(this.map);
      kakao.maps.event.addListener(this.map, 'click', (mouseEvent) => {        
          var latlng = mouseEvent.latLng; 
          this.pickedMarker.setPosition(latlng);
          this.chosenPoint = [latlng.getLat(), latlng.getLng()]
      });

      // this.clusterer = new kakao.maps.MarkerClusterer({
      //     map: this.map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
      //     averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
      //     minLevel: 4 // 클러스터 할 최소 지도 레벨 
      // });
      this.getTranslatedDataWithLocation();
    },
    setMarkerFromAddress(address, city) {
      this.geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
            this.setBuildingMarker(result[0].y,  result[0].x, address, city)
        } 
      });
    },
    setBuildingMarker(lat, long, address, city) {
      let coords = new kakao.maps.LatLng(lat, long);
      let marker = new kakao.maps.Marker({
          map: this.map,
          position: coords,
          clickable: true,
          text: city
      });
      kakao.maps.event.addListener(marker, 'click', () => {
        this.map.panTo(new kakao.maps.LatLng(lat, long));
        if (this.getChosenAddress() == address) {
          if (document.getElementById('townInfo').style.display == 'block') {
            // document.getElementById('townInfo').style.display = 'none';
          } else {
              // this.getLocationGeo(city);
              // document.getElementById('townInfo').style.display = 'block';
            }
        } else {
          // this.alterChosenAddress(address);
          // this.alterCurrentData(city);
          // this.getLocationGeo(city);
          // document.getElementById('townInfo').style.display = 'block';
        }
      });
      this.markerList.push(marker);
    },
    setMarker(lat, long, address, city) {
      let coords = new kakao.maps.LatLng(lat, long);
      let marker = new kakao.maps.Marker({
          map: this.map,
          position: coords,
          clickable: true,
          text: address
      });
      kakao.maps.event.addListener(marker, 'click', () => {
      this.map.panTo(new kakao.maps.LatLng(lat, long));
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
    },
    getTranslatedDataWithLocation() {
      axios.post('http://localhost:9200/officetel-rent-data/_search',{
        "size": 0,
        "query": {
          "bool": {
            "must": [
              {"prefix": {"시군구": "서울"}},
              {"match": {"전월세구분": "월세"}}
            ],
            "filter": [
              {"range": {"yyyymmdd": {"gte": 20200000}}}
            ]
          }
        },
        "aggs": {
          "group_by_state": {
            "terms": {
              "size": 10000000, 
              "field": "시군구"
            },
            "aggs": {
                "면적": {"avg": {"field": "area"}},
                "보증금": {"avg": {"field": "deposit"}},
                "월세": {"avg": {"field": "rent"}},
                "location": {"geo_bounds": {"field": "location"}},
                "translated": {
                "bucket_script": {
                  "buckets_path": {
                    "v1": "면적",
                    "v2": "월세",
                    "v3": "보증금"
                  },
                  "script": "(params.v2 + params.v3 * 0.06 /12) / params.v1 * 33"
                }
                }
            }
          }
        }
      }).then(res => {
        console.log(res.data.aggregations.group_by_state.buckets);
        for (let data of res.data.aggregations.group_by_state.buckets) {
          if (data.location.bounds) {
            // data.translated
            let lat = data.location.bounds.top_left.lat;
            let long = data.location.bounds.top_left.lon;

            this.setMarker(lat, long, data.key, data.key);
          }
        }
      })
    },
    getLocationGeo(city) {
      axios.post('http://localhost:9200/korea-geojson-data/_search',{
        "size": 10,
        "query": {
          "prefix": {
            "adm_nm.keyword": {
              "value": city.split(' ')[0] + ' ' + city.split(' ')[1] + ' ' + city.split(' ')[2][0] + city.split(' ')[2][1]
            }
          }
        }
      }).then(res => {
        let polygonPath = []
        for (let point of res.data.hits.hits[0]._source.coordinates.coordinates[0][0]) {
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
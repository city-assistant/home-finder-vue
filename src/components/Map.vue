<template>
  <div>
    <div id="map" class="map"></div>
    <town-info :currentData="currentData" :chosenAddress="chosenAddress"/>
  </div>
</template>

<script>
import townInfo from './TownInfo.vue';

export default {
  props: {
    searchResult: Array
  },
  components: {
    townInfo
  },
  data() {
    return {
      map: undefined,
      geocoder: undefined,
      markerList: [],
      currentData: "",
      chosenAddress: ""
    }
  },
  mounted() {
    window.kakao && window.kakao.maps
      ? this.initMap()
      : this.addKakaoMapScript();
  },
  watch: {
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
    },
    setMarkerFromAddress(address, city) {
      this.geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
            let coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            let marker = new kakao.maps.Marker({
                map: this.map,
                position: coords,
                clickable: true
            });
            kakao.maps.event.addListener(marker, 'click', () => {
              if (this.getChosenAddress() == address) {
                if (document.getElementById('townInfo').style.display == 'block') {
                  document.getElementById('townInfo').style.display = 'none';
                } else {
                  document.getElementById('townInfo').style.display = 'block';
                }
              } else {
                this.alterChosenAddress(address);
                this.alterCurrentData(city);
                document.getElementById('townInfo').style.display = 'block';
              }
            });
            this.markerList.push(marker);
        } 
      });
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
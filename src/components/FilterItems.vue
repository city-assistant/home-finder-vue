<template>
  <div class="filter">
    <el-menu default-active="true" background-color="#ffffff">
      <el-submenu index="" >
        <h5>소요시간(준비중)</h5>
        <!-- 목적지까지 소요시간 -->
        <el-input-number
          v-model="num"
          @change="handleChange"
          :min="15"
          :max="90"
          :step="timeStep"
          size="mini"
        ></el-input-number>

        <h5>거리 (해당 km 이하)</h5>
        <el-input-number
          v-model="distance"
          @change="handleChange"
          :min="0"
          :max="30"
          :step="1"
          size="mini"
        ></el-input-number>

        <!-- 거래 방식 -->
        <div style="margin-top: 20px">
          <el-radio-group v-model="leaseType" size="mini">
            <el-radio-button label="월세"></el-radio-button>
            <el-radio-button label="전세"></el-radio-button>
            <!-- <el-radio-button label="매매"></el-radio-button> -->
          </el-radio-group>
        </div>
        <br><br>면적
        <div class="block">
          <el-slider
            style="margin: 10px"
            v-model="area"
            :step="areaStep"
            show-stops
            :min="10"
            :max="200"
          >
          </el-slider>
        </div>
        보증금
        <!-- 보증금 최소, 최대 -->
        <div class="block">
          <el-slider
            style="margin: 10px"
            v-model="deposit"
            :step="depositStep"
            range
            show-stops
            :max="30000"
          >
          </el-slider>
        </div>
        월세
        <div class="block">
          <el-slider
            style="margin: 10px"
            v-model="rent"
            :step="rentStep"
            range
            show-stops
            :max="200"
          >
          </el-slider>
        </div>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: "FilterItems",
  data() {
    return {
      distance: 5,
      rentStep: 10, depositStep: 100, areaStep: 10, timeStep: 1,
      num: 15,
      leaseType: "월세",
      deposit: [0, 5000],
      rent: [0, 50],
      area: 30
    };
  },
  watch: {
    area: function(val) {
      this.$emit("areaUpdate", val)
    },
    distance: function(val) {
      this.$emit("distanceUpdate", val)
    },
    leaseType: function(val) {
      this.$emit("leaseTypeUpdate", val)
    },
    deposit: function(val) {
      this.$emit("depositUpdate", val)
    },
    rent: function(val) {
      this.$emit("rentUpdate", val)
    },
  },
  methods: {
    handleChange(value) {
      console.log(value);
    },
  },
};
</script>

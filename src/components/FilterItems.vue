<template>
  <div class="filter">
    <h5>소요시간(준비중)</h5>
    <!-- 목적지까지 소요시간 -->
    <el-input-number
      v-model="num"
      @change="handleChange"
      :min="15"
      :max="90"
      :step="15"
      size="small"
    ></el-input-number>

    <h5>거리 (해당 km 이하)</h5>
    <el-input-number
      v-model="distance"
      @change="handleChange"
      :min="0"
      :max="30"
      :step="1"
      size="small"
    ></el-input-number>

    <el-menu default-active="true" background-color="#ffffff">
      <el-submenu index="">
        <!-- 주거 형태 -->
        <div style="margin-top: 20px">
          <el-radio-group v-model="homeType" size="small">
            <el-radio-button label="오피스텔"></el-radio-button>
            <el-radio-button label="아파트"></el-radio-button>
            <el-radio-button label="단독다가구"></el-radio-button>
            <el-radio-button label="연립다세대"></el-radio-button>
          </el-radio-group>
        </div>

        <!-- 거래 방식 -->
        <div style="margin-top: 20px">
          <el-radio-group v-model="leaseType" size="small">
            <el-radio-button label="월세"></el-radio-button>
            <el-radio-button label="전세"></el-radio-button>
            <!-- <el-radio-button label="매매"></el-radio-button> -->
          </el-radio-group>
        </div>

        <!-- 보증금 최소, 최대 -->
        <div class="block">
          <el-slider
            style="margin: 10px"
            v-model="deposit"
            step="1000"
            range
            show-stops
            :max="100000"
          >
          </el-slider>
        </div>

        <!-- 면적 최소, 최대 (평수 기준) -->
        <div class="block">
          <el-slider
            style="margin: 10px"
            v-model="rent"
            step="10"
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
      rentStep: 10,
      num: 15,
      homeType: "오피스텔",
      leaseType: "월세",
      deposit: [10000, 25000],
      rent: [0, 20],
    };
  },
  watch: {
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

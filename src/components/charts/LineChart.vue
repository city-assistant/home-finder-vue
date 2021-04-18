<template>
  <div class="small">
    <line-chart :chart-data="datacollection"></line-chart>
  </div>
</template>

<script>
import LineChart from "../../assets/scripts/LineChart.module.js";

export default {
  components: {
    LineChart,
  },
  props: {
    passData: Object,
  },
  data() {
    return {
      datacollection: null,
    };
  },
  mounted() {
    this.fillData();
  },
  watch: {
    passData: function(data) {
      this.datacollection = {
        labels: data.labels,
        datasets: data.datasets,
      };
    },
  },
  methods: {
    fillData() {
      this.datacollection = {
        labels: [],
        datasets: [],
      };
    },
  },
};
</script>

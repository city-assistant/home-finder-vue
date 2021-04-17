<template>
  <div class="small">
    <bar-chart :chart-data="datacollection"></bar-chart>
  </div>
</template>

<script>
  import BarChart from '../../assets/scripts/BarChart.module.js'

  export default {
    components: {
      BarChart
    },
    props: {
      passData: Object
    },
    data () {
      return {
        datacollection: null
      }
    },
    mounted () {
      this.fillData()
    },
    watch: {
      passData: function(data) {
        this.datacollection = {
          labels: data.labels,
          datasets: data.datasets
        }
      }
    },
    methods: {
      fillData () {
        this.datacollection = {
          labels: [1,2],
          datasets: [
            {
              label: 'Data One',
              backgroundColor: '#f87979',
              data: [0, 1]
            }, {
              label: 'Data One',
              backgroundColor: '#f87979',
              data: [0.5, 2]
            }
          ]
        }
      },
    }
  }
</script>


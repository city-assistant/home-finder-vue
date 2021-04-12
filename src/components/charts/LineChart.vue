<template>
  <div class="small">
    <line-chart :chart-data="datacollection"></line-chart>
  </div>
</template>

<script>
  import LineChart from '../../assets/scripts/LineChart.module.js'

  export default {
    components: {
      LineChart
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

        console.log(this.datacollection);
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


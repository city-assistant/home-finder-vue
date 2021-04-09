<template>
  <div id="townInfo" style="display:none">
      <LineChart/>
      {{ currentData }} <br>
      여기에 동네 정보를 표기할 수 있을 것 같습니다
  </div>
</template>

<script>
import LineChart from './charts/LineChart'

export default {
    components: {
        LineChart
    },
    props: {
        currentData: String,
    },
}
</script>
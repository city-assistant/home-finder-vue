<template>
  <div id="IntermediateResult">
    <div v-for="(item, index) in searchResult" :key="index">
      <div>
        건축년도 : {{ item._source.builtyear }} <br>
        보증금 : {{ item._source.deposit }} / 월세 : {{ item._source.rent }} <br>
        거래일 : {{ item._source.yyyymmdd }} <br>
        위치 : {{ item._source.location }} <br>
        <br>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IntermediateResult',
  props: {
    searchResult: Array
  },
}
</script>
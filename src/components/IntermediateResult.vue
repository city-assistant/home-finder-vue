<template>
 <div id="IntermediateResult">
     <!-- <div v-for="(item, index) in searchResult" :key="index">  -->
    
    <el-table
    v-if="searchResult.length !=0"
    :data="searchResult"
    height="650"
    style="width: 100%">
    
    <el-table-column
      prop="_source.builtyear"
      label="건축년도"
      width="60%">
    </el-table-column>
    <el-table-column
      prop="_source.yyyymmdd"
      label="거래일"
      width="90%">
    </el-table-column>
    <el-table-column
      prop="_source.deposit"
      label="보증금">
    </el-table-column>
    <el-table-column
      prop="_source.rent"
      label="월세">
    </el-table-column>
    </el-table>
  
      <!-- <div>
        건축년도 : {{ item._source.builtyear }} <br>
        보증금 : {{ item._source.deposit }} / 월세 : {{ item._source.rent }} <br>
        거래일 : {{ item._source.yyyymmdd }} <br>
        위치 : {{ item._source.단지명 }} <br>
        <br>
     </div> -->
   
    <!-- </div> -->
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

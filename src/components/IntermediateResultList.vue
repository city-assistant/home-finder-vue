<template>
  <el-table :data="filterOfficetel()" height="300" style="width: 100%">
    <el-table-column prop="_source.deposit" label="보증금(만원)">
    </el-table-column>
    <el-table-column prop="_source.rent" label="월세(만원)" width="60%">
    </el-table-column>
    <el-table-column prop="_source.area" label="면적" width="60%">
    </el-table-column>
    <el-table-column prop="_source.builtyear" label="건축년도" width="60%">
    </el-table-column>
    <el-table-column prop="_source.yyyymmdd" label="거래일" width="90%">
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "IntermediateResultList",
  props: {
    searchResult: Array,
    officeName: String,
  },
  methods: {
    filterOfficetel() {
      return this.searchResult.filter((val) => {
        return this.officeName == val._source.도로명;
      });
    },
  },
};
</script>

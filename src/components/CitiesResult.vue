<template>
  <div id="IntermediateResult">
    <el-table
      v-if="this.searchResult.length != 0"
      :data="searchResult"
      style="width: 100%"
      max-height="auto"
    >
      <el-table-column label="지역명" prop="key"></el-table-column>
      <el-table-column label="예상 10평당 합계 지수" prop="translated.value"></el-table-column>

    </el-table>
  </div>
</template>

<script>
export default {
  name: "IntermediateResult",
  props: {
    searchResult: Array,
    citiesResult: Array,
  },
  data() {
    return {
     
    };
  },
  watch: {
    searchResult: function(v) {
      console.log(v);
    }
  },
  methods: {
    emitAddress(val) {
      this.$emit(
        "emitAddress",
        val
      );
    },
  },
};
</script>

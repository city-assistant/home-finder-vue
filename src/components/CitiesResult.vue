<template>
  <div id="IntermediateResult">
    <el-table
      v-if="this.searchResult.length != 0"
      :data="searchResult"
      style="width: 100%"
      max-height="650"
    >
      <el-table-column label="지역명" prop="key"></el-table-column>
      <el-table-column label="예상 10평 헙계 지수" prop="translated.value"></el-table-column>


      <!-- <el-table-column type="expand">
        <template slot-scope="scope">
        <intermediate-result-list
        :searchResult="searchResult"
        :officeName="scope.row.road"/>
      </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
// import IntermediateResultList from "./IntermediateResultList.vue";

export default {
  // components: { IntermediateResultList },
  name: "IntermediateResult",
  props: {
    searchResult: Array,
    officeName: Array,
  },
  data() {
    return {
      chosenAddress: "",
      currentRowObject: "",
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

<template>
  <div id="IntermediateResult">
    <el-table
      v-if="this.officeName.length != 0"
      :data="officeName"
      style="width: 100%"
      max-height="650"
    >
      <el-table-column>
        <template slot-scope="{ row }">
          <el-col>
            <el-button @click="emitAddress(row)">
              선택
            </el-button>
          </el-col>
        </template>
      </el-table-column>
      <el-table-column id="offiName" label="오피스텔명" prop="value">
      </el-table-column>

      <el-table-column label="지역명" prop="addr"> </el-table-column>

      <el-table-column type="expand">
        <template slot-scope="scope">
        <intermediate-result-list
        :searchResult="searchResult"
        :officeName="scope.row.road"/>
      </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import IntermediateResultList from "./IntermediateResultList.vue";

export default {
  components: { IntermediateResultList },
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

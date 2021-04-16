<template>

 <div id="IntermediateResult">
   <el-table
    :data="officeName"
    style="width: 100%"
    @current-change="handleCurrentChange"
    >
    
    <el-table-column
      id="offiName"
      label="오피스텔명"
      prop="value">
      
    </el-table-column>

    <el-table-column
      label="평균가?"
      prop="avg">
    </el-table-column>

    <el-table-column type="expand">
      <intermediate-result-list 
      :searchResult="searchResult"
      :officeName="newOfficeName"/>

    </el-table-column>
  </el-table>
  </div>
</template>

<script>
import IntermediateResultList from './IntermediateResultList.vue'

export default {
  components: { IntermediateResultList },
  name: 'IntermediateResult',
  props: {
    searchResult: Array,
    officeName: Array,
  },
  data() {
    return {
      chosenAddress: '',
      currentRowObject: ''
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRowObject = val;
      console.log(val)
    },
  }
}
</script>

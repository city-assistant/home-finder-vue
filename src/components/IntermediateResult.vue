<template>

 <div id="IntermediateResult">
  
   <el-table
    v-if="this.officeName.length != 0"
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
      label="지역명"
      prop="addr">
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

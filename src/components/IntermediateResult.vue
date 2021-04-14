<template>
 <div id="IntermediateResult">
    <el-table
    v-if="searchResult.length !=0"
    :data="searchResult"
    height="650"
    style="width: 100%">
      <el-table-column>
        <template slot-scope="{ row }">
          <el-col>
            <el-button @click="emitAddress(row)">
              쳌
            </el-button>
          </el-col>
        </template>
      </el-table-column>
      <el-table-column
        prop="_source.deposit"
        label="보증금">
      </el-table-column>
      <el-table-column
        prop="_source.rent"
        label="월세">
      </el-table-column>
      <el-table-column
        prop="_source.area"
        label="면적">
      </el-table-column>
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
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'IntermediateResult',
  props: {
    searchResult: Array
  },
  data() {
    return {
      chosenAddress: ''
    }
  },
  methods: {
    emitAddress(val){
      this.$emit('emitAddress', val._source['시군구'] + ' ' + val._source['도로명'])
    }
  }
}
</script>

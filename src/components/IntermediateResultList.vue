<template>
    <el-table
        :data="searchResult"
        v-if="this.searchResult.length!=0"

        height="650"
        style="width: 100%">
          <el-table-column>
            <template slot-scope="{ row }">
              <el-col>
                <el-button @click="emitAddress(row)">
                  {{선택}}
                </el-button>
              </el-col>
            </template>
          </el-table-column>
        <el-table-column 
            prop="_source.단지명"
            label="단지명">
        </el-table-column>
          <el-table-column
            prop="_source.deposit"
            label="보증금(만원)">
          </el-table-column>
          <el-table-column
            prop="_source.rent"
            label="월세(만원)"
            width="60%">
          </el-table-column>
          <el-table-column
            prop="_source.area"
            label="면적"
            width="60%">
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
</template>

<script>
export default {
    name: 'IntermediateResultList',
    props: {
        searchResult: Array,
        officeName: Array,
        addName: String

    },
    methods: {
        emitAddress(val){
        this.$emit('emitAddress', val._source['시군구'] + ' ' + val._source['도로명'])
        },
    },
}
</script>
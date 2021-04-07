<template>
  <div class="sidebar">
    <div class="sub-title">목적지 검색</div>
    <el-autocomplete
      class="inline-input"
      v-model="state2"
      :fetch-suggestions="querySearch"
      placeholder="목적지를 입력해주세요"
      :trigger-on-focus="false"
      @select="handleSelect"></el-autocomplete>
    <el-button type="primary" icon="el-icon-search">Search</el-button>
    <div id="filters">
      <filter-items/>

    </div>
  </div>
</template>
<script>
import FilterItems from '../components/FilterItems.vue';
export default {
  name: "Sidebar",
  components: { FilterItems },
};
    
</script>

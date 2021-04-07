<template>
  <div id="app">
    <div id="nav">
      <sidebar/>
    </div>
    <router-view/>
  </div>
</template>

<style src='@/assets/styles/main.css'>
</style>

<script>
import Sidebar from './views/Sidebar.vue';
export default {
  name: 'App',
  components: {
    Sidebar
  }
}
</script>
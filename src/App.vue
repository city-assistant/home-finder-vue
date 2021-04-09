<template>
  <div id="app">
    <div id="nav">
      <Navigator :searchResult="searchResult"/>
    </div>
    <router-view/>
  </div>
</template>

<style src='@/assets/styles/main.css'>
</style>

<script>
import Navigator from './components/Navigator';

export default {
  name: 'App',
  data() {
    return {
      searchResult: ''
    }
  },
  components: {
    Navigator,
  }
}
</script>
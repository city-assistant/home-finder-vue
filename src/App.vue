<template>
  <div id="app">
    <NavBar/>
    <div id="nav">
      <Navigator/>
    </div>
    <router-view/>
  </div>
</template>

<style src='@/assets/styles/main.css'>
</style>

<script>
import Navigator from './components/Navigator';
import NavBar from './components/NavBar';

export default {
  name: 'App',
  data() {
    return {
    }
  },
  components: {
    Navigator, 
    NavBar
  }
}
</script>
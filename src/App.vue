<template>
  <div id="app">
    <div id="nav">
      <sidebar/>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  float : left;
  background-color: #d5dfdb;
	width : 22%;
  height: 100%;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
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
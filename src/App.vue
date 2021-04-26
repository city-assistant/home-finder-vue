<template>
  <div id="app">
    <NavBar />
    <router-view />
  </div>
</template>

<style src="@/assets/styles/main.css"></style>

<script>
import NavBar from "./components/NavBar";

export default {
  name: "App",
  data() {
    return {};
  },
  components: {
    NavBar,
  },
};
</script>

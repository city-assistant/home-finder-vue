<template>
    <div class="home">
      <!-- <img alt="Vue logo" src="../assets/logo.png">
      <HelloWorld msg="여기는 지도자리"/> -->
      <Map/>
    </div>
</template>

<script>
// import HelloWorld from '@/components/HelloWorld.vue'
import Map from '../components/Map.vue'

export default {
  name: 'Home',
  components: {
    // HelloWorld,
    Map,
  }
}
</script>

<style>
.home {
	float : right;
	width : 78%;
}
</style>
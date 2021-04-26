<template>
  <div class="home">
    <div id="nav">
      <Navigator />
    </div>
  </div>
</template>

<script>
import Navigator from "../components/Navigator";

export default {
  name: "Home",
  components: {
    Navigator,
  },
};
</script>

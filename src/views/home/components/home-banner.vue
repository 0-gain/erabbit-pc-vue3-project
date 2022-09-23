<template>
  <div class="home-banner">
    <XtxCarousel :sliders="sliders" :duration="2000" :isAutoPlay="true" />
  </div>
</template>

<script setup>
import { reqBanner } from "@/api/home";
import { ref } from "vue";
const sliders = ref([]);

reqBanner().then((data) => {
  sliders.value = data.result;
});
</script>
<style scoped lang="less">
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;
}
</style>

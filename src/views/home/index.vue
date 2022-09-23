<template>
  <div class="page-home">
    <div class="home-entry">
      <div class="container">
        <!-- 左侧分类 -->
        <HomeCategory />
        <!-- 轮播图 -->
        <HomeBanner></HomeBanner>
        <!-- 面板 -->
        <HomeNew></HomeNew>
        <HomeHot></HomeHot>
        <HomeBrand></HomeBrand>
        <HomeProduct></HomeProduct>
        <HomeSpecial></HomeSpecial>
      </div>
    </div>
  </div>
</template>

<script setup>
import HomeCategory from "./components/home-category.vue";
import HomeBanner from "./components/home-banner.vue";
import HomeNew from "./components/home-new.vue";
import HomeHot from "./components/home-hot.vue";
import HomeBrand from "./components/home-brand.vue";
import HomeProduct from "./components/home-product.vue";
import HomeSpecial from "./components/home-special.vue";


</script>
<style scoped lang="less">
  :deep(.xtx-carousel .carousel-btn.prev){
    left: 260px !important;
  }
</style>

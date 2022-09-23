<template>
  <!-- 筛选区 -->
  <div class="sub-filter" v-if="filterData && !filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a
          :class="{ active: filterData.selectedBrand === brand.id }"
          href="javascript:;"
          v-for="brand in filterData.brands"
          :key="brand.id"
          >{{ brand.name }}</a
        >
      </div>
    </div>

    <div class="item" v-for="sale in filterData.saleProperties" :key="sale.id">
      <div class="head">{{ sale.name }}</div>
      <div class="body">
        <a
          href="javascript:;"
          :class="{ active: sale.selectedProp === item.id }"
          v-for="item in sale.properties"
          :key="item.id"
          >{{ item.name }}</a
        >
      </div>
    </div>
  </div>

  <!-- 骨架 -->
  <div class="sub-filter" v-else>
    <XtxSkeleton class="item" width="800px" height="40px" :animated="true" />
    <XtxSkeleton class="item" width="800px" height="40px" :animated="true" />
    <XtxSkeleton class="item" width="600px" height="40px" :animated="true" />
    <XtxSkeleton class="item" width="600px" height="40px" :animated="true" />
    <XtxSkeleton class="item" width="600px" height="40px" :animated="true" />
  </div>
</template>

<script setup>
import { reqCategorySub } from "@/api/category";
import { useRoute } from "vue-router";
import { ref, watch } from "vue";

const route = useRoute();
const filterData = ref(null);
const filterLoading = ref(false);

// 监听路由
watch(
  () => route.params.id,
  (newVal) => {
    // 分清点击的是否是二级目录
    if (newVal && route.path === `/category/sub/${newVal}`) {
      filterLoading.value = true;
      reqCategorySub(route.params.id).then(({ result }) => {
        // 品牌全部
        result.selectedBrand = null;
        result.brands.unshift({ id: null, name: "全部" });
        // 销售属性全部
        result.saleProperties.forEach((p) => {
          p.selectedProp = null;
          p.properties.unshift({ id: null, name: "全部" });
        });
        filterData.value = result;
        filterLoading.value = false;
      });
    }
  },
  { immediate: true }
);
</script>
<style scoped lang="less">
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}
.xtx-skeleton {
  padding: 10px 0;
}
</style>

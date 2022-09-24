<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread />
      <!-- 筛选区 -->
      <SubFilter @filter-change="filterChange"></SubFilter>

      <!-- 结果区域 -->
      <div class="goods-list">
        <!-- 排序 -->
        <SubSort @sort-change="sortChange"></SubSort>
        <!-- 列表 -->
        <ul>
          <li v-for="goods in goodsList" :key="goods.id">
            <GoodsItem :goods="goods"></GoodsItem>
          </li>
        </ul>

        <!-- 加载 -->
        <XtxInfiniteLoading
          :loading="loading"
          :finished="finished"
          @infinite="getSubData"
        ></XtxInfiniteLoading>
      </div>
    </div>
  </div>
</template>

<script setup>
import SubBread from "./components/sub-bread.vue";
import SubFilter from "./components/sub-filter.vue";
import SubSort from "./components/sub-sort.vue";
import GoodsItem from "./components/goods-item.vue";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { reqCategorySubGoods } from "@/api/category";

const route = useRoute();
// 商品列表
const goodsList = ref([]);
// 是否还有商品数据
const finished = ref(false);
// 加载数据
const loading = ref(false);
// 查询参数
let reqData = {
  page: 1,
  pageSize: 20,
};

// 获取商品
const getSubData = () => {
  loading.value = true;
  reqCategorySubGoods(reqData).then(({ result }) => {
    if (result.items.length) {
      goodsList.value.push(...result.items);
      reqData.page++;
    } else {
      // 加载完毕
      finished.value = true;
    }
    loading.value = false;
  });
};

// 改变排序的函数
const sortChange = (sortData) => {
  reqData = { ...reqData, ...sortData };
  reqData.page = 1;
  goodsList.value = [];
  finished.value = false;
  getSubData();
};

// 筛选商品的回调
const filterChange = (filterData) => {
  reqData = { ...reqData, ...filterData };
  reqData.page = 1;
  goodsList.value = [];
  finished.value = false;
  getSubData();
};

// 侦听路由
watch(
  () => route.params.id,
  (newVal) => {
    if (newVal && route.path === `/category/sub/${newVal}`) {
      getSubData();
    }
  }
);
</script>
<style scoped lang="less">
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>

<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <xtxBread>
        <xtxBreadItem to="/">首页</xtxBreadItem>
        <transition name="fade-right" mode="out-in">
          <!-- 不同的key可以创建移除元素，创造触发动画条件 -->
          <xtxBreadItem :key="topCategory.id">{{
            topCategory.name
          }}</xtxBreadItem>
        </transition>
      </xtxBread>
      <!-- 轮播图 -->
      <XtxCarousel
        :sliders="sliders"
        style="height: 500px"
        :isAutoPlay="true"
      />
      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="item in topCategory.children" :key="item.id">
            <router-link :to='`/category/sub/${item.id}`'>
              <img :src="item.picture" />
              <p>{{ item.name }}</p>
            </router-link>
          </li>
        </ul>
      </div>
      <!-- 分类关联商品 -->
      <div class="ref-goods" v-for="item in subList" :key="item.id">
        <template v-if="item.goods.length">
          <div class="head">
            <h3>- {{ item.name }} -</h3>
            <p class="tag">{{ item.desc }}</p>
            <XtxMore />
          </div>
          <div class="body">
            <GoodsItem v-for="g in item.goods" :key="g.id" :goods="g" s />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import GoodsItem from "./components/goods-item.vue";
// 获取接口
import { reqBanner } from "@/api/home";
import { reqTop_category } from "@/api/category";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { ref, computed, watch } from "vue";

const store = useStore();
const route = useRoute();

// 获取轮播图数据
const sliders = ref([]);
console.log(sliders);
reqBanner().then((res) => {
  sliders.value = res.result;
});

// 推荐商品
const subList = ref([]);
const getSubList = () => {
  reqTop_category(route.params.id).then((res) => {
    subList.value = res.result.children;
  });
};

// 监听路由的变化
watch(
  () => route.params.id,
  (newVal) => {
    if (newVal && route.path === `/category/${newVal}`) {
      getSubList();
    }
  },
  { immediate: true }
);
// 面包屑+所有分类
const topCategory = computed(() => {
  let cate = {};
  const item = store.state.category.categoryList.find(
    (item) => item.id === route.params.id
  );

  if (item) cate = item;
  return cate;
});
</script>
<style scoped lang="less">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>

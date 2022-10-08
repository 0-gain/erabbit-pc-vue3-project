<template>
  <div class="member-home">
    <!-- 概览 -->
    <HomeOverview></HomeOverview>
    <!-- 收藏 -->
    <HomePanel title="我的收藏">
      <GoodsItem v-for="i in collectGoods" :key="i" :goods="i"></GoodsItem>
    </HomePanel>
    <!-- 足迹 -->
    <HomePanel title="我的足迹">
      <GoodsItem v-for="i in 4" :key="i" :goods="goods"></GoodsItem>
    </HomePanel>
    <!-- 猜你 -->
    <GoodsRelevant></GoodsRelevant>
  </div>
</template>

<script setup>
import GoodsRelevant from "@/views/goods/components/goods-relevant.vue";
import HomeOverview from "./components/home-overview.vue";
import HomePanel from "./components/home-panel.vue";
import GoodsItem from "@/views/category/components/goods-item.vue";
import { reqCollect } from "@/api/index";
import { ref } from "vue";

const goods = {
  id: "1",
  name: "自煮火锅不排队 麦饭石不粘鸳鸯火锅",
  picture:
    "https://yanxuan-item.nosdn.127.net/fcdcb840a0f5dd754bb8fd2157579012.jpg",
  desc: "清汤鲜香 红汤劲爽",
  price: "159.00",
};

// 调用模拟的接口
const collectGoods = ref([]);
reqCollect({
  page: 1,
  pageSize: 4,
}).then(({ result }) => {
  collectGoods.value = result.items;
});
</script>
<style scoped lang="less">
:deep(.xtx-carousel) .carousel-btn.prev {
  left: 5px;
}
:deep(.xtx-carousel) .carousel-btn.next {
  right: 5px;
}
</style>

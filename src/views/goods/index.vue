<template>
  <div class="xtx-goods-page" v-if="productData">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem to="/">{{ productData.categories[1].name }}</XtxBreadItem>
        <XtxBreadItem to="/">{{ productData.categories[0].name }}</XtxBreadItem>
        <XtxBreadItem to="/">{{ productData.name }}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="productData.mainPictures"></GoodsImage>
          <GoodsSales></GoodsSales>
        </div>
        <div class="spec">
          <GoodsName :goods="productData"></GoodsName>
          <GoodsSku :goods="productData"></GoodsSku>
          <XtxNumbox label="数量" v-model="counts"></XtxNumbox>
          <XtxButton type="primary" style="margin-top: 20px" s
            >加入购物车</XtxButton
          >
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant :goodsId="goodsId"></GoodsRelevant>
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs :counts="productData.commentCount"></GoodsTabs>
          <!-- 注意事项 -->
          <div class="goods-warn">
            <GoodsWarn></GoodsWarn>
          </div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot :id="goodsId" :type="1"></GoodsHot>
          <GoodsHot :id="goodsId" :type="3"></GoodsHot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import GoodsRelevant from "./components/goods-relevant.vue";
import { reqProduct } from "@/api/product";
import { useRoute } from "vue-router";
import { ref, provide } from "vue";
import GoodsImage from "./components/goods-image.vue";
import GoodsSales from "./components/goods-sales.vue";
import GoodsName from "./components/goods-name.vue";
import GoodsSku from "./components/goods-sku.vue";
import GoodsTabs from "./components/goods-tabs.vue";
import GoodsHot from "./components/goods-hot.vue";
import GoodsWarn from "./components/goods-warn.vue";

// 商品详情数据
const productData = ref(null);
const route = useRoute();

const counts = ref(1);
// 商品id
const goodsId = ref(route.params.id);

// 获取商品详情
reqProduct(route.params.id).then(({ result }) => {
  result.skus.forEach((sku) => {
    const sortSpecs = [];
    result.specs.forEach((spec) => {
      sortSpecs.push(sku.specs.find((item) => item.name === spec.name));
    });
    sku.specs = sortSpecs;
  });
  productData.value = result;
});

// 注入给goods-detail组件
provide("goods", productData);
</script>
<style scoped lang="less">
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}

.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>

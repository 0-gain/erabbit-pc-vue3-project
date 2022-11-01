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
          <GoodsSku :goods="productData" @change="changeCounts"></GoodsSku>
          <XtxNumbox label="数量" v-model="counts" :max="max"></XtxNumbox>
          <XtxButton type="primary" style="margin-top: 20px" @change="addCart"
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
import { useStore } from "vuex";
import { ref, provide, watch } from "vue";
import GoodsImage from "./components/goods-image.vue";
import GoodsSales from "./components/goods-sales.vue";
import GoodsName from "./components/goods-name.vue";
import GoodsSku from "./components/goods-sku.vue";
import GoodsTabs from "./components/goods-tabs.vue";
import GoodsHot from "./components/goods-hot.vue";
import GoodsWarn from "./components/goods-warn.vue";
import Message from "@/components/library/Message";

// 商品详情数据
const productData = ref(null);
const route = useRoute();
const store = useStore();

// 商品id
const goodsId = ref(route.params.id);

// 获取商品详情
const getGoods = () => {
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
};

// 注入给goods-detail组件
provide("goods", productData);

// 与goods-sku子组件通信，获取当前所点击的规格配置的库存
const counts = ref(1); //购买的数量
const max = ref(1); //可购买的最大值
const curSku = ref(null); //当前所选中的配套规格
const changeCounts = (val) => {
  max.value = val?.inventory || 0;
  curSku.value = val;
};

const addCart = () => {
  if (curSku.value) {
    // id skuId name attrsText picture price nowPrice selected stock count isEffective
    const { skuId, specsText: attrsText, inventory: stock } = curSku.value;
    const { id, name, price, mainPictures } = productData.value;
    store
      .dispatch("cart/getAddCart", {
        skuId,
        attrsText,
        stock,
        id,
        name,
        price,
        nowPrice: price,
        picture: mainPictures[0],
        selected: true,
        isEffective: true,
        count: counts.value,
      })
      .then(() => {
        Message({ type: "success", text: "加入购物车成功" });
      });
  } else {
    Message({ type: "error", text: "请选择完整的规格" });
  }
};

// 侦听路由的变化
watch(
  () => route.params.id,
  (newVal) => {
    if (newVal && route.path === `/product/${newVal}`) {
      getGoods()
    }
  },{immediate:true}
);
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

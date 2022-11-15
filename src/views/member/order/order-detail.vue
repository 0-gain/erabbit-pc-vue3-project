<template>
  <div class="order-detail-page" v-if="order">
    <!-- 操作栏 -->
    <DetailAction :order="order" />
    <!-- 步骤条 组件xtx-steps.vue-->
    <DetailSteps :order="order"></DetailSteps>
    <!-- 物流栏 -->
    <Suspense  v-if="[3,4,5].includes(order.orderState)">
      <!-- 组件加载完毕 -->
      <template #default>
        <DetailLogistics :order="order" />
      </template>
      <!-- 组件加载中显示 -->
      <template #fallback>
        <div class="loading">loading</div>
      </template>
    </Suspense>
    <!-- 订单商品信息 -->
    <OrderInfo :order="order"></OrderInfo>
  </div>
</template>

<script setup>
import DetailAction from "./components/detail-action.vue";
import DetailSteps from "./components/detail-steps.vue";
import DetailLogistics from './components/detail-logistics.vue'
import OrderInfo from './components/order-info.vue'
import { reqOrderDetail } from "@/api/order";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const order = ref(null);
reqOrderDetail(route.params.id).then(({ result }) => {
  order.value = result;
});
</script>
<style scoped lang="less">
.order-detail-page {
  background: #fff;
}
</style>

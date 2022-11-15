<template>
  <div class="detail-action">
    <div class="state">
      <span
        class="iconfont"
        :class="[`icon-order-${orderStatus[order.orderState].name}`]"
      ></span>
      <p>{{ orderStatus[order.orderState].label }}</p>
    </div>
    <div class="info">
      <p>订单编号：{{ order.id }}</p>
      <p>下单时间：{{ order.createTime }}</p>
    </div>
    <div class="btn">
      <!-- 
        订单状态
            1.待付款：立即付款，取消订单
            2.待发货：再次购买
            3.待收货：确认收货，再次购买
            4.待评价：评价商品，再次购买，申请售后
            5.已完成：查看评价，再次购买，申请售后
            6.已取消：-
         -->
      <template v-if="order.orderState === 1">
        <XtxButton
          @click="$router.push('/member/pay?id=' + order.id)"
          type="primary"
          size="small"
          >立即付款</XtxButton
        >
        <XtxButton @click="handleCancelOrder(order)" type="gray" size="small"
          >取消订单</XtxButton
        >
      </template>
      <!-- 待发货 -->
      <template v-if="order.orderState === 2">
        <XtxButton type="primary" size="small">再次购买</XtxButton>
      </template>
      <!-- 待收货 -->
      <template v-if="order.orderState === 3">
        <XtxButton
          @click="handleConfirmOrder(order)"
          type="primary"
          size="small"
          >确认收货</XtxButton
        >
        <XtxButton type="plain" size="small">再次购买</XtxButton>
      </template>
      <!-- 待评价 -->
      <template v-if="order.orderState === 4">
        <XtxButton
          @click="handleRepurchaseOrder(order)"
          type="primary"
          size="small"
          >再次购买</XtxButton
        >
        <XtxButton type="plain" size="small">评价商品</XtxButton>
        <XtxButton type="gray" size="small">申请售后</XtxButton>
      </template>
      <!-- 已完成 -->
      <template v-if="order.orderState === 5">
        <XtxButton type="primary" size="small">再次购买</XtxButton>
        <XtxButton type="plain" size="small">查看评价</XtxButton>
        <XtxButton type="gray" size="small">申请售后</XtxButton>
      </template>
      <!-- 已取消 -->
    </div>

    <Teleport to="#dailog">
      <OrderCancel ref="cancelCom"></OrderCancel>
    </Teleport>
  </div>
</template>

<script setup>
import { orderStatus, reqConfirmOrder, reqRepurchaseOrder } from "@/api/order";
import OrderCancel from "./order-cancel.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import Confirm from "@/components/library/confirm";
import Message from "@/components/library/Message";

const props = defineProps({ order: { type: Object, default: () => {} } });

// 取消订单
const cancelCom = ref(null);
const handleCancelOrder = (order) => {
  cancelCom.value.open(order);
};

// 确认收货
const handleConfirmOrder = (order) => {
  Confirm({ text: "您确认收到货吗？确认后货款将会打给卖家" }).then(() => {
    reqConfirmOrder(order.id).then(() => {
      Message({ text: "确认收获成功", type: "success" });
      order.orderState = 4;
    });
  });
};

// 再次购买
const router = useRouter();
const handleRepurchaseOrder = (order) => {
  reqRepurchaseOrder(order.id).then((res) => {
    // 跳转到填写订单
    router.push({ path: "/member/checkout", query: { id: order.id } });
    console.log(res);
  });
};
</script>
<style scoped lang="less">
.detail-action {
  height: 180px;
  width: 100%;
  display: flex;
  align-items: center;
  .state {
    width: 220px;
    text-align: center;
    .iconfont {
      font-size: 40px;
      color: @xtxColor;
    }
    p {
      font-size: 16px;
      color: #666;
      margin-bottom: 10px;
    }
  }
  .info {
    width: 240px;
    line-height: 30px;
    p {
      color: #999;
    }
  }
  .btn {
    flex: 1;
    text-align: right;
    margin-right: 100px;
    .xtx-button {
      margin-left: 20px;
    }
  }
}
</style>

<template>
  <div class="member-order-page">
    <XtxTabs v-model="activeName" @tab-click="clickTab">
      <XtxTabsPanel
        v-for="item in orderStatus"
        :key="item.label"
        :name="item.name"
        :label="item.label"
      >
        <div class="order-list">
          <div v-if="loading" class="loading"></div>
          <div class="none" v-if="!loading && orderList.length === 0">
            暂无数据
          </div>
          <OrderItem
            v-for="v in orderList"
            :key="v.id"
            :order="v"
            @on-cancel-order="handleCancelOrder(v)"
            @on-delete-order="handleDeleteOrder(v)"
            @on-confirm-order="handleConfirmOrder(v)"
            @on-logistics-order="handleLogisticsOrder(v)"
          ></OrderItem>
        </div>
      </XtxTabsPanel>
    </XtxTabs>

    <Teleport to="#dailog">
      <OrderCancel ref="cancelCom"></OrderCancel>
    </Teleport>

    <XtxPagination
      v-if="total > reqParams.pageSize"
      @current-change="reqParams.page = $event"
      :total="total"
      :currentPage="reqParams.page"
      :pageSize="reqParams.pageSize"
    ></XtxPagination>
  </div>
</template>

<script setup>
import XtxTabsPanel from "@/components/library/xtx-tabs-panel.vue";
import XtxTabs from "@/components/library/xtx-tabs.vue";
import OrderItem from "./components/order-item.vue";
import { ref, reactive, watch } from "vue";
import {
  orderStatus,
  reqOrderList,
  reqDeleteOrder,
  reqConfirmOrder,
} from "@/api/order";
import OrderCancel from "./components/order-cancel.vue";
import Confirm from "@/components/library/confirm";
import Message from "@/components/library/Message";
const activeName = ref("all");
const loading = ref(true);
const total = ref(0);
const clickTab = ({ index }) => {
  reqParams.orderState = index;
  reqParams.page = 1;
};

// 查询订单参数
const reqParams = reactive({
  page: 1,
  pageSize: 5,
  orderState: 0,
});
// 订单列表
const orderList = ref([]);
// 获取订单数据
const getOrderList = () => {
  loading.value = true;
  reqOrderList(reqParams).then(({ result }) => {
    orderList.value = result.items;
    total.value = result.counts;
    loading.value = false;
  });
};
// 监听reqParams的变化
watch(
  reqParams,
  () => {
    getOrderList();
  },
  { immediate: true }
);

const cancelCom = ref(null);
// 取消订单
const handleCancelOrder = (order) => {
  cancelCom.value.open(order);
};

// 删除订单
const handleDeleteOrder = (order) => {
  Confirm({ text: "您确定删除这条订单吗？" })
    .then(() => {
      console.log([order.id]);
      reqDeleteOrder([order.id]).then(({ result }) => {
        Message({ text: "删除成功", type: "success" });
        getOrderList();
      });
    })
    .catch((e) => {});
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

// 查看物流
const logisticsOrderCom = ref(null)
const handleLogisticsOrder = (item)=>{
  logisticsOrderCom.value.open(item)
}
</script>
<style scoped lang="less">
.order-list {
  padding: 20px;
  position: relative;
  min-height: 400px;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(../../../assets/images/loading.gif)
    no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>

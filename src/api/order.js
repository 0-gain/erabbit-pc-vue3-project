import request from "@/utils/request";

/* 
    生成订单
*/
export const reqCheckOutInfo = () => request.get("/member/order/pre");

/* 
    添加收货地址
*/
export const reqOrderAddress = (address) =>
  request.post("/member/address", address);

// 获取收获地址列表
export const reqAddressList = () => request.get("/member/address");

// 删除收获地址
export const reqDeleteAddress = (id) => request.delete(`/member/address/${id}`);

// 编辑收获地址
export const reqEditAddress = (address) =>
  request.put(`/member/address/${address.id}`, address);



// 提交订单
export const reqSubmitOrder = (order) => request.post("/member/order", order);

// 获取订单详情
export const reqOrderInfo = (id) => request.get(`/member/order/${id}`);

// 支付跳转链接
export const baseURL = "http://pcapi-xiaotuxian-front-devtest.itheima.net/";

// 订单状态
export const orderStatus = [
  { name: "all", label: "全部订单" },
  { name: "unpay", label: "待付款" },
  { name: "deliver", label: "待发货" },
  { name: "receive", label: "待收货" },
  { name: "comment", label: "待评价" },
  { name: "complete", label: "已完成" },
  { name: "cancel", label: "已取消" },
];

// 获取我的订单
// orderState :1 待付款、2 代发货、3 待收货、4 待评价、5 已完成、6 已取消、默认0 全部
export const reqOrderList = ({ page, pageSize, orderState }) =>
  request.get("/member/order", { params: { page, pageSize, orderState } });

// 取消订单
export const reqCancelOrder = (id, cancelReason) =>
  request.put(`/member/order/${id}/cancel`, { cancelReason });

// 删除订单
export const reqDeleteOrder = (ids) =>
  request.delete("/member/order", { data: { ids } });

// 确认收获
export const reqConfirmOrder = (id) =>
  request.put(`/member/order/${id}/receipt`);

// 查看物流
export const reqLogisticsOrder = (id) =>
  request.get(`/member/order/${id}/logistics`);

// 订单详情
export const reqOrderDetail = (id) => request.get(`/member/order/${id}`);

// 再次购买
export const reqRepurchaseOrder = (id) => request.get(`/member/order/repurchase/${id}`)

import request from "@/utils/request";

// 加入购物车
export const reqAddCart = (skuId, count) =>
  request.post("/member/cart", { skuId, count });

//获取新的商品信息
export const reqNewCartGoods = (skuId) => request.get(`/goods/stock/${skuId}`);
// 购物车列表
export const reqCartList = () => request.get("/member/cart");

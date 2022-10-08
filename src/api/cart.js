import request from "@/utils/request";

// 加入购物车
export const reqAddCart = ( skuId, count ) =>
  request.post("/member/cart", { skuId, count });

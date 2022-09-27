import request from "@/utils/request";

export const reqProduct = (id) => request.get("/goods", { params: { id } });

// 同类推荐(猜你喜欢)id:传入代表查询相关商品，不传代表查询猜你喜欢
export const reqGoodsRelevant = (id,limit=16) =>
  request.get("/goods/relevant", { params: { id,limit } });

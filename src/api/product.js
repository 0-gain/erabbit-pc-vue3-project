import request from "@/utils/request";

export const reqProduct = (id) => request.get("/goods", { params: { id } });

// 同类推荐(猜你喜欢)id:传入代表查询相关商品，不传代表查询猜你喜欢
export const reqGoodsRelevant = (id, limit = 16) =>
  request.get("/goods/relevant", { params: { id, limit } });

// 热销推荐
export const reqGoodsHot = (id, type, limit) =>
  request.get("/goods/hot", { params: { id, type, limit } });

// 评价信息
export const reqGoodsComments = (id) => request.get(`/goods/${id}/evaluate`);

// 评论分页数据
export const reqGoodsPage = (id, params) =>
  request.get(`/goods/${id}/evaluate/page`, { params });

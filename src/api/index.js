import request from "@/utils/request";

/**
 * 获取收藏分页数据
 * @param {Integer} collectType - 收藏类型，1为商品，2为专题，3为品牌
 * @returns
 */
export const reqCollect = ({ page = 1, pageSize = 10, collectType = 1 }) =>
  request.get("/member/collect", { params: { page, pageSize, collectType } });

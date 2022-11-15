import request from "@/utils/request";

// 加入购物车
export const reqAddCart = (skuId, count) =>
  request.post("/member/cart", { skuId, count });

//获取新的商品信息
export const reqNewCartGoods = (skuId) => request.get(`/goods/stock/${skuId}`);

// 登录后的购物车列表
export const reqCartList = () => request.get("/member/cart");

/**
 * 删除商品（支持批量删除）
 * @param {Array<string>} ids - skuId集合
 * @returns Promise
 */
export const reqDeleteCart = (ids) =>
  request.delete("/member/cart", { data: { ids } });

// 修改购物车商品
export const reqUpdateCart = ({skuId,count,selected}) =>
  request.put(`/member/cart/${skuId}`, { count,selected });

// 购物车全选/取消全选
export const reqCheckAll = ({selected,ids})=>request.put('/member/cart/selected',{selected,ids})

/**
 * 合并本地购物车
 * @param {Array<object>} cartList - 本地购物车数组
 * @param {String} item.skuId - 商品SKUID
 * @param {Boolean} item.selected - 是否选中
 * @param {Integer} item.count - 数量
 */
export const reqMergeLocalCart = (cartList) =>
  request.post("/member/cart/merge", cartList);

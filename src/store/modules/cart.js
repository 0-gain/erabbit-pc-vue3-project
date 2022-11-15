import {
  reqAddCart,
  reqDeleteCart,
  reqCartList,
  reqNewCartGoods,
  reqMergeLocalCart,
  reqUpdateCart,
  reqCheckAll,
} from "@/api/cart";

export default {
  namespaced: true,
  state() {
    return {
      // 购物车商品列表
      list: [],
    };
  },
  mutations: {
    // 加入购物车
    ADD_CART(state, goods) {
      const sameIndex = state.list.findIndex(
        (item) => item.skuId === goods.skuId
      );
      // todo 有相同的给goods累加数量，删除相同skuId的商品
      if (sameIndex >= 0) {
        goods.count = state.list[sameIndex].count + goods.count;
        state.list.splice(sameIndex, 1);
      }
      state.list.unshift(goods);
    },

    // 删除购物车商品
    DELETE_CART(state, skuId) {
      const index = state.list.findIndex((item) => item.skuId === skuId);
      state.list.splice(index, 1);
    },

    // 更新购物车
    UPDATE_CART(state, goods) {
      // 寻找需要更新得商品
      const updateGoods = state.list.find((item) => item.skuId === goods.skuId);
      for (const key in goods) {
        updateGoods[key] = goods[key];
      }
    },

    // 设置购物车列表
    SET_CART_LIST(state, list) {
      state.list = list;
    },
  },
  actions: {
    // 加入购物车
    getAddCart({ commit, rootState }, goods) {
      return new Promise((resolve, reject) => {
        const { token } = rootState.user.profile;
        if (token) {
          // 登录后加入购物车
          let { count, skuId } = goods;
          reqAddCart(skuId, count)
            .then((res) => {
              commit("ADD_CART", res.result);
              resolve();
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          // 未登录
          commit("ADD_CART", goods);
          resolve();
        }
      });
    },

    // 购物车列表
    getCartList({ commit, state, rootState }) {
      return new Promise((resolve, reject) => {
        if (rootState.user.profile.token) {
          // 登录TODO
          reqCartList()
            .then((res) => {
              commit("SET_CART_LIST", res.result);
              resolve();
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          // 本地
          // Promise.all() 可以并列发送多个请求，等所有请求成功，调用then
          // Promise.race() 可以并列发送多个请求，等最快的请求成功，调用then
          // 传参数promise数组
          const promiseArr = state.list.map((item) => {
            return reqNewCartGoods(item.skuId);
          });
          Promise.all(promiseArr)
            .then((dataArr) => {
              dataArr.forEach((data, i) => {
                commit("UPDATE_CART", {
                  skuId: state.list[i].skuId,
                  ...data.result,
                });
              });
              resolve;
            })
            .catch((e) => reject(e));
        }
      });
    },

    // 删除/清空购物车
    getDeleteCart({ commit, dispatch, rootState }, skuId) {
      return new Promise((resolve, reject) => {
        if (rootState.user.profile.token) {
          // 登录
          reqDeleteCart([skuId])
            .then((res) => {
              dispatch("getCartList");
              resolve();
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          commit("DELETE_CART", skuId);
          resolve();
        }
      });
    },

    // 批量删除选中商品
    batchDeleteCart({ commit, rootState, getters }) {
      return new Promise((resolve, reject) => {
        if (rootState.user.profile.token) {
          // 登录TODO
          const ids = getters.selectedList.map((item) => item.skuId);
          reqDeleteCart(ids)
            .then((res) => {
              return reqCartList();
            })
            .then((res) => {
              commit("SET_CART_LIST", res.result);
              resolve();
            });
        } else {
          // 本地
          // 1.获取选中商品列表，进行遍历调用DELETE_CART
          getters.selectedList.forEach((item) => {
            commit("DELETE_CART", item.skuId);
          });
          resolve();
        }
      });
    },

    // 更新购物车商品
    updateCart({ commit, state, rootState }, goods) {
      return new Promise((resolve, reject) => {
        if (rootState.user.profile.token) {
          // 登录
          reqUpdateCart(goods)
            .then((res) => {
              return reqCartList();
            })
            .then((res) => {
              commit("SET_CART_LIST", res.result);
              resolve();
            });
        } else {
          // 本地
          commit("UPDATE_CART", goods);
        }
      });
    },

    // 更新商品sku规格
    updateCartSku({ commit, state, rootState }, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (rootState.user.profile.token) {
          // 登录
          // 1.获取原先商品
          const oldGoods = state.list.find((item) => item.skuId === oldSkuId);
          // 2.删除原先商品
          reqDeleteCart([oldSkuId])
            .then((res) => {
              // 3.插入修改后的商品
              return reqAddCart(newSku.skuId, oldGoods.count);
            })
            .then((res) => {
              return reqCartList();
            })
            .then((res) => {
              commit("SET_CART_LIST", res.result);
              resolve();
            });
        } else {
          // 本地
          // 1.先获取旧的商品信息
          const oldGoods = state.list.find((item) => item.skuId === oldSkuId);
          // 2.删除旧的商品
          commit("DELETE_CART", oldSkuId);
          // 3.合并一条新的商品信息
          const {
            inventory: stock,
            specsText: attrsText,
            skuId,
            price: nowPrice,
            oldPrice,
          } = newSku;
          const newGoods = {
            ...oldGoods,
            stock,
            attrsText,
            skuId,
            nowPrice,
            oldPrice,
          };
          commit("ADD_CART", newGoods);
          resolve();
        }
      });
    },

    // 全选or反选
    checkAllCart({ commit, rootState, getters }, selected) {
      return new Promise((resolve, reject) => {
        if (rootState.user.profile.token) {
          // 登录
          const ids = getters.validList.map((item) => item.skuId);
          reqCheckAll({ selected, ids })
            .then(() => {
              return reqCartList();
            })
            .then((res) => {
              commit("SET_CART_LIST", res.result);
              resolve();
            });
        } else {
          // 本地
          // 获取有效得商品列表，遍历的去调用修改mutations
          getters.validList.forEach((el) => {
            commit("UPDATE_CART", { skuId: el.skuId, selected });
          });
          resolve();
        }
      });
    },

    // 合并本地购物车
    async mergeLocalCart({ commit, getters }) {
      // 存储token后调用合并API接口函数进行购物合并
      const cartList = getters.validList.map(({ skuId, selected, count }) => {
        return { skuId, selected, count };
      });
      await reqMergeLocalCart(cartList);

      // 合并成功将本地购物车删除
      commit("SET_CART_LIST", []);
    },
  },
  getters: {
    // 有效商品列表
    validList(state) {
      return state.list.filter((item) => item.stock > 0 && item.isEffective);
    },
    // 有效商品总金额
    validAmount(state, getters) {
      return getters.validList.reduce((prev, cur) => {
        return (prev += cur.count * cur.price);
      }, 0);
    },

    // 有效商品件数
    validTotal(state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0);
    },

    // 无效商品
    invalidList(state) {
      return state.list.filter((item) => !(item.stock > 0 && item.isEffective));
    },

    // 选中商品列表
    selectedList(state, getters) {
      return getters.validList.filter((item) => item.selected);
    },

    // 选中商品总金额
    selectedAmount(state, getters) {
      return getters.selectedList.reduce(
        (prev, cur) => (prev += cur.nowPrice * cur.count),
        0
      );
    },

    // 全选
    isCheckAll(state, getters) {
      return (
        getters.validList.length === getters.selectedList.length &&
        getters.selectedList.length !== 0
      );
    },
  },
};

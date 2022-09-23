import { reqFind_All_Category } from "@/api/category";
import { topCategory } from "@/api/constants";

export default {
  namespaced: true,
  state() {
    return {
      // 首页分类数据，初始值
      categoryList: topCategory.map((item) => ({ name: item })),
    };
  },
  mutations: {
    // 首页全部分类
    GET_ALL_CATEGORY(state, categoryList) {
      state.categoryList = categoryList;
    },
  },
  actions: {
    // 首页全部分类
    async getAllCategory({ commit }) {
      const res = await reqFind_All_Category();
      commit("GET_ALL_CATEGORY", res.result);
    },
  },
};

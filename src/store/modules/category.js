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
    SHOW(state,item){
      const category = state.categoryList.find(category => category.id === item.id)
      category.open = true
    },
    HIDE(state,item){
      const category = state.categoryList.find(category => category.id === item.id)
      category.open = false
    }
  },
  actions: {
    // 首页全部分类
    async getAllCategory({ commit }) {
      const res = await reqFind_All_Category();
      // 给一级分类加上一个控制二级分类显示隐藏的数据open
      res.result.forEach(item=>{
        item.open = false
      })
      commit("GET_ALL_CATEGORY", res.result);
    },
  },
};

import { createStore } from "vuex";
// 持久存储
import createPersistedState from "vuex-persistedstate";

import category from "./modules/category";
import user from "./modules/user";
export default createStore({
  modules: {
    category,
    user,
  },
  // 配置插件
  plugins:[
    // 默认存储在localStorage
    createPersistedState({
      // 本地存储名字
      key:'erabbit-client-pc-124-store',
      // 指定需要存储的模块
      paths:['user']
    })
  ]
});

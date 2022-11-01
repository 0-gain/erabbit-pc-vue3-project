export default {
  namespaced: true,
  state: {
    // 用户账户信息
    profile:{},
    redirectUrl:'/'
  },
  mutations: {
    // 获取用户的信息
    SET_USER(state, data) {
        state.profile = data
    },
    // 需要回跳的地址
    SET_REDIRECT_URL(state,url){
      state.redirectUrl = url
    }
  },
  actions: {},
};

export default {
  namespaced: true,
  state: {
    // 用户账户信息
    profile:{}
  },
  mutations: {
    // 获取用户的信息
    SET_USER(state, data) {
        state.profile = data
    },
  },
  actions: {},
};

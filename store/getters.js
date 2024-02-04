export default {
  userInfo: (state) => state.auth.userInfo,
  userToken: (state) => state.auth.userToken,

  // 个人中心
  electronicCardInfo: (state) => state.user.electronicCardInfo,

  // app
  systermInfo: (state) => state.app.systermInfo,
  terminal: (state) => state.app.terminal
};

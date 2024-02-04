import Vue from "vue";
import VueX from "vuex";
import getters from "./getters";
import auth from "./modules/auth";
import user from "./modules/user";
import app from "./modules/app";

Vue.use(VueX);

export default new VueX.Store({
  state: () => {},
  getters,
  modules: {
    auth,
    user,
    app,
  },
});

import Vue from 'vue'
import App from './App'
import store from './store/index.js';
import * as util from '@/common/js/util.js'
Vue.prototype.$util = util
import uView from "uview-ui";
Vue.use(uView);
Vue.config.productionTip = false

App.mpType = 'app'
const app = new Vue({
    ...App,
	store
})
app.$mount()

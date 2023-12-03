import Vue from 'vue'
import App from './App'
import store from './store/index.js'
import uView from 'uview-ui'

Vue.mixin({
	data() {
		return {
			common: {
				seamingImgUrl(url) {
					if (!url) return ''
					return url.startsWith('https://') ? url : 'https://www.tuanfengkeji.cn:9527/dts-admin-api/admin/storage/fetch/' + url
				}
			}
		}
	},
	methods: {
		setData(obj) {
			const that = this
			let keys = []
			let val, data
			Object.keys(obj).forEach(function (key) {
				keys = key.split('.')
				val = obj[key]
				data = that.$data
				keys.forEach(function (key2, index) {
					if (index + 1 == keys.length) {
						that.$set(data, key2, val)
					} else if (!data[key2]) {
						that.$set(data, key2, {})
					}
					data = data[key2]
				})
			})
		},
		$showToast(text, icon) {
			uni.showToast({
				title: text,
				duration: 2000,
				icon: icon || 'none'
			})
		},
		go(url, param) {
			if (!url) return
			if (param) url = `${url}?detail=${encodeURIComponent(JSON.stringify(param)?.replace(/%/g, '%25'))}`
			uni.navigateTo({
				url
			})
		},
		$getJumpParam(loadParam) {
			if (typeof loadParam === 'object' && loadParam?.detail) return JSON.parse(decodeURIComponent(loadParam.detail))
			return {}
		},

		$copy(text, title = '复制成功') {
			uni.setClipboardData({
				data: text,
				success: () => {
					uni.showToast({
						title
					})
				}
			})
		},

		$redirectTo(url) {
			if (!url) return
			uni.redirectTo({ url })
		},

		$switchTab(url) {
			if (!url) return
			uni.switchTab({ url })
		},

		getSize(selecter) {
			const _this = this
			return new Promise((resolve, reject) => {
				const query = uni.createSelectorQuery().in(_this)
				query
					.select(selecter)
					.boundingClientRect((data) => {
						resolve(data)
					})
					.exec()
			})
		},

		empty() {
			uni.showToast({
				title: '功能升级中...',
				icon: 'none'
			})
		},

		isLogin() {
			return !!this.$store.state.userId
		}
	}
})

Vue.use(uView)
Vue.config.productionTip = false

App.mpType = 'app'
const app = new Vue({
	...App,
	store
})
app.$mount()

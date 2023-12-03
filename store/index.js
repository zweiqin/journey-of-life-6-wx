import { T_STORAGE_KEY, USER_INFO } from '../constant'
import { getAnotherTFTokenApi } from '../api/anotherTFInterface'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		userInfo: uni.getStorageSync(USER_INFO)
	},
	getters: {
		userId(state) {
			return state.userInfo.id || null
		}
	},
	mutations: {
		// 更新state数据
		setStateAttr(state, param) {
			if (param instanceof Array) {
				for (const item of param) {
					state[item.key] = item.val
				}
			} else {
				state[param.key] = param.val
			}
		},

		'CHNAGE_USER_INFO'(state, userInfo) {
			state.userInfo = userInfo
			uni.setStorageSync(USER_INFO, userInfo)
		}
	},
	actions: {
		setUserData({ state, commit }, data) {
			commit('setStateAttr', {
				key: 'userInfo',
				val: data
			})
			uni.setStorageSync(USER_INFO, data)
		},

		// 密码登录
		loginAction({ commit, dispatch }, loginData) {
			return new Promise((resolve, reject) => {
				loginApi({ ...loginData })
					.then(async ({ data }) => {
						commit('CHNAGE_USER_INFO', data.userInfo)
						uni.showToast({
							title: '登录成功'
						})
						console.log(data)
						await dispatch('updateStorageKeyToken')
						resolve(data)
					})
					.catch((err) => {
						reject(err)
					})
			})
		},

		// 验证码登录
		codeLoginAction({ commit, dispatch }, loginData) {
			return new Promise((resolve, reject) => {
				verificationCodeApi({ ...loginData })
					.then(async ({ data }) => {
						commit('CHNAGE_USER_INFO', data.userInfo)
						uni.showToast({
							title: '登录成功'
						})
						console.log(data)
						await dispatch('updateStorageKeyToken')
						resolve(data)
					})
					.catch((err) => {
						reject(err)
					})
			})
		},

		// 微信登陆
		wxLogin({ commit, dispatch }, code) {
			return new Promise((resolve, reject) => {
				wxLoginApi({ code })
					.then(async ({ data }) => {
						commit('CHNAGE_USER_INFO', data.userInfo)
						uni.showToast({
							title: '登录成功'
						})
						await dispatch('updateStorageKeyToken')
						resolve(data)
					})
					.catch((err) => {
						reject(err)
					})
			})
		},

		logout({ commit }, isQuiet) {
			uni.removeStorageSync(USER_INFO)
			commit(CHNAGE_USER_INFO, '')
			clearAllCache()
			if (isQuiet) {
				uni.showToast({
					title: '退出成功'
				})
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/community-center/community-centerr'
					})
				}, 2000)
			}
		},

		// 获取新团蜂token
		updateStorageKeyToken({ state, dispatch, commit }) {
			return new Promise((resolve, reject) => {
				const userInfo = uni.getStorageSync(USER_INFO)
				if (userInfo && userInfo.phone) {
					uni.showLoading({ mask: true })
					getAnotherTFTokenApi({ phone: userInfo.phone })
						.then((res) => {
							uni.setStorageSync(T_STORAGE_KEY, res.data)
							uni.hideLoading()
							resolve(res.data)
						})
						.catch((err) => {
							uni.hideLoading()
							resolve(err)
						})
					dispatch('updateIdentityInfo')
				} else {
					uni.showToast({
						title: '缺少用户手机号码'
					})
					resolve('缺少用户手机号码')
				}
			})
		}
	}
})

export default store

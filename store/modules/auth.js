import { T_REDIRECT_TYPE, USER_INFO, USER_ID, USER_TOKEN, T_USER_TOKEN, T_STORAGE_KEY, clearAllCache } from '../../constant'
import { A_TF_MAIN } from '../../config'
import { CHNAGE_USER_INFO, CHNAGE_USER_TOKEN, CHNAGE_USER_IDENTITY } from './type'
import store from '../index'
import { getUrlCode } from '../../utils'
import { getIsShopByUserApi, updatePhoneLoginRegisterApi, updateWXLoginApi, updateWXAppLoginApi, updateAlipayLoginApi, getUserInfoApi, updateUserInfoApi } from '../../api/anotherTFInterface'

export default {
	namespaced: true,
	state() {
		return {
			userInfo: uni.getStorageSync(T_STORAGE_KEY) || {}, // 新团蜂的
			userToken: uni.getStorageSync(T_USER_TOKEN) || '', // 新团蜂的
			identityInfo: {
				type: [], // 9商家或8商家员工，1加盟商，2代理商
				shopInfo: {}
			}
		}
	},

	mutations: {
		[CHNAGE_USER_INFO](state, userInfo) {
			state.userInfo = userInfo
			uni.setStorageSync(T_STORAGE_KEY, userInfo)
		},

		[CHNAGE_USER_TOKEN](state, token) {
			state.userToken = token
			uni.setStorageSync(T_USER_TOKEN, token)
		},

		[CHNAGE_USER_IDENTITY](state, data) {
			if (data.type) state.identityInfo.type = data.type
			if (data.shopInfo) state.identityInfo.shopInfo = data.shopInfo
		}
	},

	actions: {
		// 手机验证码登录或手机密码登录或手机验证码密码注册
		phoneLoginRegisterAction({ state, commit, dispatch }, { isAfter, loginData } = { loginData: {} }) {
			return new Promise((resolve, reject) => {
				uni.showLoading({ mask: true })
				updatePhoneLoginRegisterApi({ ...loginData })
					.then(({ data }) => {
						console.log(data)
						if (data.phone && data.oldShopUserInfo && data.oldShopUserInfo.userInfo && data.oldShopUserInfo.userInfo.phone) {
							try {
								uni.hideLoading()
								uni.showToast({ title: '登录成功', icon: 'none' })
								if (isAfter) dispatch('LoginAfterAction', { type: 'phone', data })
								resolve(data)
							} catch (err) {
								uni.hideLoading()
								uni.showToast({ title: JSON.stringify(err), icon: 'none' })
								reject(err)
							}
						} else {
							uni.hideLoading()
							uni.showToast({ title: '系统错误，未能注册手机号', icon: 'none' })
							reject()
						}
					})
					.catch((err) => {
						uni.hideLoading()
						// // #ifdef MP
						// uni.showToast({ title: (err && err.message) || JSON.stringify(err), icon: 'none' })
						// // #endif
						reject(err)
					})
			})
		},

		// 微信登陆
		wxLoginAction({ state, commit, dispatch }, { isAfter, pageUrl } = {}) {
			uni.showLoading({ mask: true })
			return new Promise((resolve, reject) => {
				const loginData = {
					terminal: store.state.app.terminal,
					headImage: '',
					code: ''
				}
				if (loginData.terminal === 3) {
					const appid = 'wxb19ccb829623be12' // 团蜂wxb19ccb829623be12，新巨蜂wx603b04a561e4683e，别的wxdf390bb4f8a67641
					const local = store.state.app.isInMiniProgram ? `${A_TF_MAIN}/#${pageUrl || '/pages/login/login'}?miniProgram=1` : `${A_TF_MAIN}/#${pageUrl || '/pages/login/login'}`
					const code = getUrlCode().code
					if (!code) {
						// 如https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb19ccb829623be12&redirect_uri=http%3A%2F%2Flocalhost%3A8988%2FTFShop_Uni_H5%2F%23%2Fpages%2Flogin%2Flogin&response_type=code&scope=snsapi_userinfo#wechat_redirect
						window.location.href =
							'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
							appid +
							'&redirect_uri=' +
							encodeURIComponent(local) +
							'&response_type=code&scope=snsapi_userinfo#wechat_redirect'
					} else {
						updateWXLoginApi({ ...loginData, code })
							.then(({ data }) => {
								try {
									uni.hideLoading()
									if (isAfter) dispatch('LoginAfterAction', { type: 'wx', data })
									resolve(data)
								} catch (err) {
									uni.hideLoading()
									uni.showToast({ title: JSON.stringify(err), icon: 'none' })
									reject(err)
								}
							})
							.catch((err) => {
								uni.hideLoading()
								reject(err)
							})
					}
				} else if (loginData.terminal === 5) {
					uni.hideLoading()
					uni.showToast({ title: '暂不支持！', icon: 'none' })
					reject()
				} else if (loginData.terminal === 1) {
					uni.login({
						provider: 'weixin',
						success(loginRes) {
							uni.getUserInfo({ // 获取用户信息
								provider: 'weixin',
								success(infoRes) {
									updateWXAppLoginApi({ wechatOpenId: infoRes.userInfo.openId }).then(({ data }) => {
										uni.hideLoading()
										if (isAfter) dispatch('LoginAfterAction', { type: 'wx', data: { ...data, wechatOpenId: infoRes.userInfo.openId, headImage: infoRes.userInfo.avatarUrl } })
										resolve(data)
									})
										.catch((err) => {
											uni.hideLoading()
											reject(err)
										})
								},
								fail: (err) => {
									uni.hideLoading()
									uni.showToast({ title: '微信登录授权失败', icon: 'none' })
									reject(err)
								}
							})
						},
						fail: (err) => {
							uni.hideLoading()
							uni.showToast({ title: '微信登录授权失败', icon: 'none' })
							reject(err)
						}
					})
				} else if (loginData.terminal === 2) {
					uni.login({
						provider: 'weixin',
						success: (res) => {
							loginData.code = res.code
						},
						fail: (err) => {
							uni.hideLoading()
							uni.showToast({ title: '微信登录授权失败', icon: 'none' })
						}
					})
					uni.getUserProfile({
						desc: '正在获取', // 不写不弹提示框
						success: (res) => {
							updateWXLoginApi({ ...loginData, headImage: res.userInfo.avatarUrl })
								.then((data) => {
									uni.hideLoading()
									if (isAfter) dispatch('LoginAfterAction', { type: 'wx', data })
									resolve(data)
								})
								.catch((err) => {
									uni.hideLoading()
									reject(err)
								})
						},
						fail: (err) => {
							uni.hideLoading()
							uni.showToast({ title: '微信登录授权失败', icon: 'none' })
							reject(err)
						}
					})
				} else if (loginData.terminal === 4) {
					uni.hideLoading()
					uni.showToast({ title: '暂不支持！', icon: 'none' })
					reject()
				} else {
					uni.hideLoading()
					uni.showToast({ title: '未能获取系统信息', icon: 'none' })
					reject()
				}
			})
		},

		// 支付宝登陆
		aliPayLoginAction({ commit, dispatch }, { isAfter } = {}) {
			uni.showLoading({ mask: true })
			return new Promise((resolve, reject) => {
				uni.login({
					provider: 'alipay',
					scopes: 'auth_user',
					success(res) {
						updateAlipayLoginApi({
							code: res.authCode
						})
							.then(({ data }) => {
								uni.hideLoading()
								if (isAfter) dispatch('LoginAfterAction', { type: 'alipay', data })
								resolve(data)
							})
							.catch((err) => {
								uni.hideLoading()
								reject(err)
							})
					}
				})
			})
		},

		LoginAfterAction({ state, commit, dispatch }, { type, data }) {
			try {
				const tabbarList = ['pages/index/index', 'pages/business-district/business-district', '/pages/community-center/community-center', 'pages/order/order', '/pages/user/user']
				const redirect = uni.getStorageSync(T_REDIRECT_TYPE)
				console.log(type)
				if (type === 'phone') {
					setTimeout(() => {
						uni.setStorageSync(USER_ID, data.oldShopUserInfo.userInfo.userId)
						uni.setStorageSync(USER_TOKEN, data.oldShopUserInfo.token)
						uni.setStorageSync(USER_INFO, data.oldShopUserInfo.userInfo)
						commit(CHNAGE_USER_TOKEN, data.token)
						commit(CHNAGE_USER_INFO, data)
						if (data.roleId) commit(CHNAGE_USER_IDENTITY, { type: [ ...new Set([...state.identityInfo.type, data.roleId]) ] })
						dispatch('updateIdentityInfo')
						if (redirect) {
							uni.removeStorageSync(T_REDIRECT_TYPE)
							if (tabbarList.includes(this.redirect)) {
								uni.switchTab({
									url: this.redirect
								})
							} else {
								uni.redirectTo({
									url: this.redirect
								})
							}
						// } else if (uni.getStorageSync(T_NEW_BIND_TYPE)) {
						// 	uni.redirectTo({
						// 		url: '/pages/jump/jump'
						// 	})
						} else {
							uni.switchTab({
								url: '/pages/index/index'
							})
						}
					}, 2000)
				} else if (type === 'wx') {
					if (data.ifFirst == 0) {
						if (data.phone && data.oldShopUserInfo && data.oldShopUserInfo.userInfo && data.oldShopUserInfo.userInfo.phone) {
							uni.setStorageSync(USER_ID, data.oldShopUserInfo.userInfo.userId)
							uni.setStorageSync(USER_TOKEN, data.oldShopUserInfo.token)
							uni.setStorageSync(USER_INFO, data.oldShopUserInfo.userInfo)
							commit(CHNAGE_USER_TOKEN, data.token)
							commit(CHNAGE_USER_INFO, data)
							if (data.roleId) commit(CHNAGE_USER_IDENTITY, { type: [ ...new Set([...state.identityInfo.type, data.roleId]) ] })
							dispatch('updateIdentityInfo')
							if (this.redirect) {
								uni.removeStorageSync(T_REDIRECT_TYPE)
								window.location.replace(`${A_TF_MAIN}/#${this.redirect}`)
							// } else if (uni.getStorageSync(T_NEW_BIND_TYPE)) {
							// 	window.location.replace(`${A_TF_MAIN}/#/pages/jump/jump`)
							} else {
								window.location.replace(`${A_TF_MAIN}/#/`)
							}
						} else if (data.phone && (!data.oldShopUserInfo || !data.oldShopUserInfo.userInfo)) {
							uni.showToast({ title: '系统错误，未能同步用户数据', icon: 'none' })
						} else if (data.phone && data.oldShopUserInfo && data.oldShopUserInfo.userInfo && !data.oldShopUserInfo.userInfo.phone) {
							uni.showToast({ title: '系统错误，未能同步用户手机号', icon: 'none' })
						} else {
							uni.showToast({ title: '未能识别的错误', icon: 'none' })
						}
					} else {
						window.location.replace(`${A_TF_MAIN}/#/another-tf/another-serve/bindPhone/index?wechatOpenId=${data.wechatOpenId || ''}&headImage=${data.headImage || ''}&wechatName=${data.wechatName || ''}&buyerUserId=${data.buyerUserId || ''}`) // data=${JSON.stringify(data)}&
					}
				} else if (type === 'alipay') {
					if (data.ifFirst == 0) {
						uni.setStorageSync(USER_ID, data.oldShopUserInfo.userInfo.userId)
						uni.setStorageSync(USER_TOKEN, data.oldShopUserInfo.token)
						uni.setStorageSync(USER_INFO, data.oldShopUserInfo.userInfo)
						commit(CHNAGE_USER_TOKEN, data.token)
						commit(CHNAGE_USER_INFO, data)
						if (data.roleId) commit(CHNAGE_USER_IDENTITY, { type: [ ...new Set([...state.identityInfo.type, data.roleId]) ] })
						dispatch('updateIdentityInfo')
						if (redirect) {
							uni.removeStorageSync(T_REDIRECT_TYPE)
							if (tabbarList.includes(this.redirect)) {
								uni.switchTab({
									url: this.redirect
								})
							} else {
								uni.redirectTo({
									url: this.redirect
								})
							}
						// } else if (uni.getStorageSync(T_NEW_BIND_TYPE)) {
						// 	uni.redirectTo({
						// 		url: '/pages/jump/jump'
						// 	})
						} else {
							uni.switchTab({
								url: '/pages/index/index'
							})
						}
					} else { // 第一次登录，绑定手机号
						uni.redirectTo({
							url: `/another-tf/another-serve/bindPhone/index?wechatOpenId=${data.wechatOpenId || ''}&headImage=${data.headImage || ''}&wechatName=${data.wechatName || ''}&buyerUserId=${data.buyerUserId || ''}`
						})
					}
				}
			} catch (err) {
				uni.showToast({ title: JSON.stringify(err), icon: 'none' })
			}
		},

		logoutAction({ commit }, isQuiet) {
			uni.removeStorageSync(USER_ID)
			uni.removeStorageSync(USER_INFO)
			uni.removeStorageSync(USER_TOKEN)
			uni.removeStorageSync(T_USER_TOKEN)
			commit(CHNAGE_USER_INFO, {})
			commit(CHNAGE_USER_TOKEN, '')
			clearAllCache()
			if (isQuiet) {
				uni.showToast({ title: '退出成功', icon: 'none' })
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/index/index'
					})
				}, 2000)
			}
		},

		updateUserInfoAction({ state, dispatch }, updateData) {
			return new Promise((resolve, reject) => {
				uni.showLoading()
				updateUserInfoApi(updateData)
					.then((res) => {
						uni.hideLoading()
						uni.showToast({ title: '修改成功', icon: 'success' })
						dispatch('refrshUserInfoAction')
						resolve(res)
					})
					.catch((err) => {
						uni.hideLoading()
						reject(err)
					})
			})
		},

		// 刷新用户信息
		refrshUserInfoAction({ state, dispatch, commit }, cb) {
			return new Promise((resolve, reject) => {
				getUserInfoApi({})
					.then((res) => {
						// if (uni.getStorageSync(USER_ID)) {
						// refrshUserInfoApi({
						// 	userId: uni.getStorageSync(USER_ID)
						// })
						// 	.then((result) => {
						// uni.setStorageSync(USER_ID, result.data.userId)
						// uni.setStorageSync(USER_INFO, result.data)
						const tempUserInfo = uni.getStorageSync(T_STORAGE_KEY)
						commit(CHNAGE_USER_INFO, Object.assign(res.data, {
							ifFirst: tempUserInfo.ifFirst,
							oldShopUserInfo: tempUserInfo.oldShopUserInfo,
							refreshToken: tempUserInfo.refreshToken,
							sessionKey: tempUserInfo.sessionKey,
							ssoUserInfo: tempUserInfo.ssoUserInfo,
							token: tempUserInfo.token
						}))
						if (res.data.roleId) commit(CHNAGE_USER_IDENTITY, { type: [ ...new Set([...state.identityInfo.type, res.data.roleId]) ] })
						dispatch('updateIdentityInfo')
						// 	cb && typeof cb === 'function' && cb(result.data)
						// 	resolve(result.data)
						cb && typeof cb === 'function' && cb()
						resolve()
						// })
						// .catch((err) => {
						// 	reject(err)
						// })
						// } else {
						// 	reject()
						// }
					})
					.catch((err) => {
						reject(err)
					})
			})
		},

		// 获取身份（是否商家）等
		updateIdentityInfo({ state, dispatch, commit }) {
			return new Promise(async (resolve, reject) => {
				// const userInfo = uni.getStorageSync(T_STORAGE_KEY)
				// if (userInfo && userInfo.phone) {
				// 	getIsShopByUserApi({ mobile: userInfo.phone })
				// 		.then(async (res) => {
				// 			if (res.data && res.data.shopId) {
				// 				if (res.data.staff) {
				// 					commit(CHNAGE_USER_IDENTITY, { type: [ ...new Set([...state.identityInfo.type, 8]) ], shopInfo: res.data || {} })
				// 				} else {
				// 					commit(CHNAGE_USER_IDENTITY, { type: [ ...new Set([...state.identityInfo.type, 9]) ], shopInfo: res.data || {} })
				// 				}
				// 			}
				// 			resolve(res.data)
				try {
					const cardInfo = await store.dispatch('user/getElectronicCardAction')
					if (cardInfo.enterpriseUserId) await store.dispatch('user/getElectronicLabelAction', { id: cardInfo.enterpriseUserId })
					resolve()
				} catch (err) {
					reject(err)
				}
				// 		})
				// 		.catch((err) => {
				// 			uni.hideToast()
				// 			reject(err)
				// 		})
				// }
			})
		}
	}
}

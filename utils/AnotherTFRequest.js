import { ANOTHER_TF_INTERFACE } from '../config'
import { T_STORAGE_KEY } from '../constant'
import store from '../store'

const request = (base_url) => function (url, data = {}, method = 'GET', cb, header = {}) {
	return new Promise((resolve, reject) => {
		header['Content-Type'] = 'application/json'
		const res = uni.getStorageSync(T_STORAGE_KEY) || {}
		if (res.token) header.Authorization = res.token
		if (res.ssoUserInfo && res.ssoUserInfo.token) header['satoken-user'] = res.ssoUserInfo.token
		// showLoading()
		let _isShowToast = true
		if (data._isShowToast === false) (_isShowToast = false) && delete data._isShowToast
		uni.request({
			url: base_url + url,
			data,
			method,
			header,
			success: (res) => {
				// console.log('拦截器', JSON.stringify(res))
				// console.log('拦截器', res)
				// hideLoading()
				if (res.statusCode == 200) {
					if ((res.data.code === '200') || (res.data.code === '')) {
						resolve(res.data)
					} else if ((res.data.code === '20004') || (res.data.code === '20005') || (res.data.code == 40005)) {
						uni.showModal({
							title: '提示',
							content: '账号未登录，请重新登陆！',
							success(res) {
								if (res.confirm) {
									store.dispatch('auth/logoutAction')
									setTimeout(() => {
										uni.navigateTo({
											url: '/pages/login/login'
										})
									}, 1000)
								} else if (res.cancel) {
									// uni.navigateBack();
								}
							}
						})
						reject(res.data)
					} else {
						reject(res.data)
						if (_isShowToast) {
							// #ifndef MP
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							})
							// #endif
							// #ifdef MP
							Promise.resolve().then(() => {
								Promise.resolve().then(() => {
									uni.showToast({
										title: res.data.message,
										icon: 'none'
									})
								})
							})
						// #endif
						}
					}
				} else {
					reject(res)
				}
			},
			fail: (res) => {
				// hideLoading()
				reject(res)
			},
			complete: () => {
				cb && typeof cb === 'function' && cb()
			}
		})
	})
}

export const AnotherTFRequest = request(ANOTHER_TF_INTERFACE)

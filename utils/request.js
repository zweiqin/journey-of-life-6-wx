/**
 * @param {String} cloudFnName
 * @param {String} operation  操作类型（增删改查）
 * @param {Object} data 请求参数
 * @param {Object} ext 附加参数
 */

export const request = (cloudFnName, operation, data = {}, ext = {}) => new Promise((resolve, reject) => {
	if (ext.showLoading !== false) {
		uni.showLoading()
	}
	uniCloud.callFunction({
		name: cloudFnName,
		data: {
			operation,
			data
		}
	}).then((res) => {
		if (ext.showLoading !== false) {
			uni.hideLoading()
		}
		if (res.result.code != 200) {
			uni.showToast({
				icon: 'none',
				title: res.result.msg,
				duration: 2000
			})
			reject(res.result.msg)
		} else {
			console.log('requestResult', res)
			resolve(res.result.data)
		}
	})
		.catch((err) => {
			if (ext.showLoading !== false) {
				uni.hideLoading()
			}
			uni.showToast({
				icon: 'none',
				title: err.toString().replace('Error:', ''),
				duration: 2000
			})
			reject(err)
		})
})

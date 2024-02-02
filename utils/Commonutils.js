// import { whoami } from '../api/auth'
import { USER_ID, T_STORAGE_KEY, USER_INFO } from '../constant'
// import { isNull } from 'lodash-es'


/**
 * @description 解决小数计算精度问题（en，你应该使用big.js）
 * @param {Number, String} data 数字
 * @param {Number} accuracy 保留几位小数
 * @returns
 */

export const fomartNumber = (data, accuracy = 2) => {
	const temp = data + ''
	if (temp.includes('.')) {
		return (data * 1).toFixed(accuracy)
	}
	return data
}

/**
 * @description 批量清除缓存
 * @param {String[]} cacheArr 要清除的缓存string数组
 */

export const removeCache = (cacheArr) => {
	if (!Array.isArray(cacheArr)) {
		return
	}

	for (const item of cacheArr) {
		uni.removeStorageSync(item)
	}
}

/**
 * 检测登录是否有效
 */

export const checkWhoami = () => {
	new Promise(async (resolve, reject) => {
		const userId = getUserId()
		const res = await whoami(userId)
		if (res.errno !== 0) {
			uni.navigateTo({
				url: '/pages/login/login'
			})
		}
	})
}

/**
 * 获取用户userid
 * @returns
 */

export const getUserId = () => {
	const userId = uni.getStorageSync(USER_ID)
	if (!userId) {
		// uni.showToast({
		//   title: "登录已失效，请重新登录",
		//   duration: 2000,
		//   icon: "none",
		// });

		// uni.navigateTo({
		//   url: "/pages/login/login",
		// });
		uni.showModal({
			title: '提示',
			content: '您还未登录，是否去登录？',
			success(res) {
				if (res.confirm) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				} else if (res.cancel) {
					// uni.navigateBack();
				}
			}
		})
		return
	}
	return userId
}

/**
 * 获取新团蜂用户id
 * @returns
 */

export const getStorageUserId = () => {
	const userInfo = uni.getStorageSync(T_STORAGE_KEY) || {}
	if (!userInfo.buyerUserId) {
		uni.showModal({
			title: '提示',
			content: '您还未登录，是否去登录？',
			success(res) {
				if (res.confirm) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				} else if (res.cancel) {
					// uni.navigateBack();
				}
			}
		})
		return
	}
	return userInfo.buyerUserId
}

/**
 * 获取新团蜂token
 * @returns
 */

export const getStorageKeyToken = () => {
	const userInfo = uni.getStorageSync(USER_INFO)
	if (!userInfo || !userInfo.userId) {
		uni.showModal({
			title: '提示',
			content: '您还未登录，是否去登录？',
			success(res) {
				if (res.confirm) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				} else if (res.cancel) {
					// uni.navigateBack();
				}
			}
		})
		return
	}
	if (!userInfo || !userInfo.phone) {
		uni.showModal({
			title: '提示',
			content: '未绑定手机号码，是否去绑定？',
			success(res) {
				if (res.confirm) {
					uni.switchTab({
						url: '/'
					})
				} else if (res.cancel) {
					// uni.navigateBack();
				}
			}
		})
		return
	}
	const storageKey = uni.getStorageSync(T_STORAGE_KEY)
	if (!storageKey || !storageKey.token) {
		uni.showModal({
			title: '提示',
			content: '系统出错，请重新登陆',
			success(res) {
				if (res.confirm) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				} else if (res.cancel) {
					// uni.navigateBack();
				}
			}
		})
		return
	}
	return storageKey.token
}

/**
 * 跳转到新团蜂入驻端项目
 * @returns
 */

export const jumpToOtherProject = (url, cb = () => { }) => {
	// #ifdef H5
	window.location.href = url
	// #endif
	// #ifdef APP
	plus.runtime.openURL(url, cb)
	// #endif
	// #ifdef MP
	uni.redirectTo({
		url: `/user/view?target=${url}`
	})
	// #endif
}

/**
 * 点击复制
 * @param {*} text
 */

export const useCopy = (text) => {
	const input = document.createElement('input')
	input.value = text
	document.body.appendChild(input)
	input.select()
	document.execCommand('Copy')
	document.body.removeChild(input)
	uni.showToast({
		title: '单号复制成功'
	})
}

/**
 * @description 防抖函数
 * @param {*} func
 * @param {*} wait
 * @param {*} immediate
 * @returns
 */

export function handleDebounce(func, wait, immediate) {
	let timeout

	return function () {
		const context = this
		const args = arguments

		if (timeout) clearTimeout(timeout)
		if (immediate) {
			var callNow = !timeout
			timeout = setTimeout(() => {
				timeout = null
			}, wait)
			if (callNow) func.apply(context, args)
		} else {
			timeout = setTimeout(function () {
				func.apply(context, args)
			}, wait)
		}
	}
}

export function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min) + min)
}

export const randomRGB = () => {
	const r = Math.floor(Math.random() * 255)
	const g = Math.floor(Math.random() * 255)
	const b = Math.floor(Math.random() * 255)
	return `rgb(${r}, ${g}, ${b})`
}

export const timestampToTime = (timestamp) => {
	// 时间戳为10位需*1000，时间戳为13位不需乘1000
	// var date = new Date(timestamp * 1000);
	var date = new Date(timestamp)
	var Y = date.getFullYear() + '-'
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
	var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
	var h = date.getHours() + ':'
	var m = date.getMinutes() + ':'
	var s = date.getSeconds()
	return Y + M + D + h + m + s
	// console.log(timestampToTime(1670145353)); //2022-12-04 17:15:53
}

/**
 * 时间格式化
 */

export const timeFormatting = (timeDifference) => {
	// 天数
	const day = Math.floor(timeDifference / 3600 / 24)
	// 小时
	const hr = Math.floor(timeDifference / 3600 % 24)
	// 分钟
	const min = Math.floor(timeDifference / 60 % 60)
	// 秒
	const sec = Math.floor(timeDifference % 60)
	return {
		day: day < 10 ? '0' + day : day,
		hour: hr < 10 ? '0' + hr : hr,
		min: min < 10 ? '0' + min : min,
		sec: sec < 10 ? '0' + sec : sec
	}
}

export const throttle = (fn, interval) => {
	let lastTime = 0
	const _throttle = function (...args) {
		const nowTime = new Date().getTime()
		const remainTime = interval - (nowTime - lastTime)
		if (remainTime <= 0) {
			fn.apply(this, args)
			lastTime = nowTime
		}
	}
	return _throttle
}

// 获取 微信 code
// #ifdef H5
export const getUrlCode = () => {
	var url = location.search
	var theRequest = new Object()
	if (url.indexOf('?') != -1) {
		var str = url.substr(1)
		var strs = str.split('&')
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1]
		}
	}

	console.log('code结果', theRequest)
	return theRequest
}
// #endif

// 判断当前是否处于微信环境
export const isInWx = () => {
	// #ifdef H5
	var ua = navigator.userAgent.toLowerCase()
	return ua.match(/MicroMessenger/i) == 'micromessenger'
	// #endif

	// #ifdef APP
	return false
	// #endif
}

/**
 * 大数转小数 12345.123 = 1.23万
 */

export const convertToDecimal = (number) => {
	if (!number || isNull(number)) return 0
	if (number < 10000) {
		return number.toString()
	} else if (number < 100000000) {
		const decimalNumber = (number / 10000).toFixed(2)
		return decimalNumber + '万'
	}
	const decimalNumber = (number / 100000000).toFixed(2)
	return decimalNumber + '亿'
}

export const isSubarray = (arr, subarr) => {
	const mainSet = new Set(arr)
	for (const element of subarr) {
		if (!mainSet.has(element)) {
			return false
		}
	}
	return true
}

export const tradeOrderNo = function () {
	const now = new Date()
	const year = now.getFullYear()
	let month = now.getMonth() + 1
	let day = now.getDate()
	let hour = now.getHours()
	let minutes = now.getMinutes()
	let seconds = now.getSeconds()
	String(month).length < 2 ? month = Number('0' + month) : month
	String(day).length < 2 ? day = Number('0' + day) : day
	String(hour).length < 2 ? hour = Number('0' + hour) : hour
	String(minutes).length < 2 ? minutes = Number('0' + minutes) : minutes
	String(seconds).length < 2 ? seconds = Number('0' + seconds) : seconds
	const yyyyMMddHHmmss = `${year}${month}${day}${hour}${minutes}${seconds}`
	return yyyyMMddHHmmss + Math.random().toString(36)
		.substr(2, 9)
}

/**
 * 判断当前H5是否在webview中打开
 */

export const isH5InWebview = () => {
	const ua = navigator.userAgent.toLowerCase()
	return typeof ua === 'string' && (ua.includes('webview') || ua.includes('miniprogramhtmlwebview'))
}

/**
 * 判断当前资源是否是视频格式
 * @param {string} url
 * @returns {boolean}
 */

// export function isVideo(url) {
// 	// ['png', 'jpg', 'jpeg', 'bmp', 'gif','webp'] ['mp4', 'm2v', 'mkv', 'webm', 'ogg', 'flv']
// 	const videoExtensions = ['.avi', '.wmv', '.mpg', '.mpeg', '.mov', '.rm', '.ram', '.swf', '.flv', '.mp4']
// 	const lowercasedUrl = url.toLowerCase()
// 	return videoExtensions.some(type => lowercasedUrl.includes(type))
// }
export function isVideoSource(src) {
	// return ['.avi', '.wmv', '.mpg', '.mpeg', '.mov', '.rm', '.ram', '.swf', '.flv', '.mp4'].some((item) => src.indexOf(item) !== -1)
	return ['.avi', '.wmv', '.mpg', '.mpeg', '.mov', '.rm', '.ram', '.swf', '.flv', '.mp4'].includes(src.substring(src.lastIndexOf('.')))
}

export const saveImg = (url, cb) => {
	// #ifdef H5
	if (isInWx()) {
		uni.showToast({
			title: '请长按图片保存',
			duration: 2000,
			icon: 'none'
		})
	} else {
		const uniappA = document.createElement('a')
		uniappA.download = ''
		uniappA.href = url
		document.body.appendChild(uniappA)
		uniappA.click()
		uniappA.remove()
		cb && typeof cb === 'function' && cb()
	}
	// #endif

	// #ifdef APP || MP
	uni.saveImageToPhotosAlbum({
		filePath: url,
		success() {
			cb && typeof cb === 'function' && cb()
		}
	})
	// #endif
}

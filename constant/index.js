// auth
export const USER_ID = 'USER_ID'
export const USER_TOKEN = 'USER_TOKEN'
export const USER_INFO = 'user_INFO'
export const T_STORAGE_KEY = 'T_STORAGE_KEY'
export const T_USER_TOKEN = 'T_USER_TOKEN'

// 绑定
export const T_REDIRECT_TYPE = 'T_REDIRECT_TYPE'

export const clearAllCache = () => {
	[
		USER_ID,
		USER_TOKEN,
		USER_INFO,
		T_STORAGE_KEY,
		T_USER_TOKEN,
		T_REDIRECT_TYPE
	].forEach((item) => {
		uni.removeStorageSync(item)
	})
}

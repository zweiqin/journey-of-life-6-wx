// auth
export const USER_ID = 'USER_ID'
export const USER_TOKEN = 'USER_TOKEN'
export const USER_INFO = 'user_INFO'
export const T_STORAGE_KEY = 'T_STORAGE_KEY'

export const clearAllCache = () => {
	[
		USER_ID,
		USER_TOKEN,
		USER_INFO,
		T_STORAGE_KEY
	].forEach((item) => {
		uni.removeStorageSync(item)
	})
}

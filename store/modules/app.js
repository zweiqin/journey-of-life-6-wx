import { CHANGE_IS_IN_MINIPROGRAM, CHANGE_SYSTERM_INFO, CHANGE_SYSTERM_TERMINAL } from './type'
import { isInWx, isH5InWebview } from '../../utils'

export default {
	namespaced: true,
	state() {
		return {
			isInMiniProgram: false, // 是否套壳的
			systermInfo: {},
			terminal: 0,
			platformOperationShopId: 186
		}
	},

	mutations: {
		[CHANGE_IS_IN_MINIPROGRAM](state, tag) {
			if (tag) {
				state.isInMiniProgram = tag
			}
		},

		[CHANGE_SYSTERM_INFO](state, system) {
			state.systermInfo = system
			console.log(system)
		},

		[CHANGE_SYSTERM_TERMINAL](state, terminal) {
			state.terminal = terminal
		}
	},

	actions: {
		getUserSystermInfo({ commit }) {
			return new Promise((resolve, reject) => {
				uni.getSystemInfo({
					success: (systermInfo) => {
						commit(CHANGE_SYSTERM_INFO, systermInfo)
						resolve()
					},
					fail: () => {
						commit(CHANGE_SYSTERM_INFO, {})
						resolve()
					}
				})
			})
		},
		getSystermTerminal({ state, dispatch, commit }) {
			return new Promise((resolve, reject) => {
				if (isInWx()) {
					if (state.isInMiniProgram || isH5InWebview()) {
						commit(CHANGE_SYSTERM_TERMINAL, 6)
					} else {
						commit(CHANGE_SYSTERM_TERMINAL, 3)
					}
				} else {
					// #ifdef H5
					commit(CHANGE_SYSTERM_TERMINAL, 5) // H5包含pc和移动端浏览器和微信浏览器的可能
					// #endif
					// #ifdef APP
					commit(CHANGE_SYSTERM_TERMINAL, 1)
					// #endif
					// #ifdef MP-WEIXIN
					commit(CHANGE_SYSTERM_TERMINAL, 2)
					// #endif
					// #ifdef MP-ALIPAY
					commit(CHANGE_SYSTERM_TERMINAL, 4)
					// #endif
				}
			})
		}
	}
}

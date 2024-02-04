import {
	CHNAGE_ELECTRONIC_CARD_INFO
} from './type'
import { getStorageKeyToken, getStorageUserId } from '../../utils'
import { getIdEnterpriseUserApi } from '../../api/anotherTFInterface'

export default {
	namespaced: true,
	state() {
		return {
			electronicCardInfo: {}
		}
	},

	mutations: {
		[CHNAGE_ELECTRONIC_CARD_INFO](state, electronicCardInfo) {
			state.electronicCardInfo = electronicCardInfo
		}
	},

	actions: {
		getElectronicCardAction({ state, dispatch, commit }) {
			return new Promise((resolve, reject) => {
				if (!getStorageKeyToken()) return reject('缺少个人信息')
				getIdEnterpriseUserApi({ id: getStorageUserId() })
					.then((res) => {
						commit(CHNAGE_ELECTRONIC_CARD_INFO, res.data)
						resolve(res.data)
					})
					.catch((err) => {
						reject(err)
					})
			})
		}
	}
}

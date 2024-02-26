import {
	CHNAGE_ELECTRONIC_CARD_INFO,
	CHNAGE_ELECTRONIC_LABEL_INFO
} from './type'
import { getStorageKeyToken, getStorageUserId } from '../../utils'
import { getIdEnterpriseUserApi, getUserIdEnterpriseUserLabelApi } from '../../api/anotherTFInterface'

export default {
	namespaced: true,
	state() {
		return {
			electronicCardInfo: {
				// enterpriseUserId: 1, // 名片ID
				// buyerId: 999, // 用户ID
				// name: '昵称', // 昵称
				// sex: '1', // 1男2女
				// birthday: '2024-09-03', // 生日
				// phone: '13288888888', // 注册手机号
				// headImage: 'https://jufeng-shop-1317254189.cos.ap-guangzhou.myqcloud.com/微信图片_20231102095245.jpg', // 头像图片
				// state: 1, // 是否启用1-是,0-否
				// ifBlack: 1, // 是否加入黑名单 1-是0-否
				// isEnterprise: 1, // 是否企业 1-是 0-否
				// enterpriseName: '企业名称', // 企业名称
				// enterpriseDuties: '职务', // 职务
				// enterpriseDepartment: '部门', // 部门
				// address: '地址地址地址地址地址地址地址地址地址地址地址地址地址地址地址地址地址地址地址地址地址地址地址地址地址地址地址地址地址地址', // 地址
				// enterpriseHeadImage: 'https://jufeng-shop-1317254189.cos.ap-guangzhou.myqcloud.com/微信图片_20231102095245.jpg', // 企业头像
				// mailbox: '邮箱', // 邮箱
				// weChatSignal: '微信号', // 微信号
				// landline: '座机', // 座机
				// personalProfile: '个人简介', // 个人简介
				// label: '1,2,3,4,5,6', // 用户标签ID (1,2,3,4,5,6)
				// pictureIntroduction: 'https://jufeng-shop-1317254189.cos.ap-guangzhou.myqcloud.com/1705998424162-22(1)(1).png,https://jufeng-shop-1317254189.cos.ap-guangzhou.myqcloud.com/1704700771949-79b9dbdacaa2a34efa5d1f62f02b614.png,https://jufeng-shop-1317254189.cos.ap-guangzhou.myqcloud.com/1705540309535-124.jpg', // 图片介绍
				// styleId: 1, // 样式ID
				// createTime: '创建时间',
				// updateTime: '更新时间'
			},
			electronicLabelInfo: [
				// {
				// 	labelId: '标签Id',
				// 	labelName: '标签名称',
				// 	enterpriseUserId: '关联名片ID',
				// 	createTime: '创建时间',
				// 	updateTime: '更新时间'
				// }
			]
		}
	},

	mutations: {
		[CHNAGE_ELECTRONIC_CARD_INFO](state, electronicCardInfo) {
			state.electronicCardInfo = electronicCardInfo
		},
		[CHNAGE_ELECTRONIC_LABEL_INFO](state, electronicLabelInfo) {
			state.electronicLabelInfo = electronicLabelInfo
		}
	},

	actions: {
		getElectronicCardAction({ state, dispatch, commit }) {
			return new Promise((resolve, reject) => {
				if (!getStorageKeyToken()) return reject('缺少个人信息')
				getIdEnterpriseUserApi({ id: getStorageUserId() })
					.then((res) => {
						console.log(res.data)
						commit(CHNAGE_ELECTRONIC_CARD_INFO, res.data)
						resolve(res.data)
					})
					.catch((err) => {
						reject(err)
					})
			})
		},
		getElectronicLabelAction({ state, dispatch, commit }, { id }) {
			return new Promise((resolve, reject) => {
				if (!getStorageKeyToken()) return reject('缺少个人信息')
				getUserIdEnterpriseUserLabelApi({ enterpriseUserId: id })
					.then((res) => {
						commit(CHNAGE_ELECTRONIC_LABEL_INFO, res.data || [])
						resolve(res.data || [])
					})
					.catch((err) => {
						reject(err)
					})
			})
		}
	}
}

<template>
	<view class="card-label-form-container">
		<JHeader width="50" height="50" title="名片标签表单"></JHeader>
		<FieldPaneCLF v-model="form.basicInfo" :fields="applyOne" title="标签信息"></FieldPaneCLF>
		<view class="buts">
			<button class="btn" @click="submit()">
				提交
			</button>
		</view>
	</view>
</template>

<script>
import FieldPaneCLF from './components/field-pane-clf.vue'
import { getEnterpriseUserLabelDetailApi, updateByIdEnterpriseUserLabelApi, addEnterpriseUserLabelSaveApi } from '../../../api/anotherTFInterface'

export default {
	name: 'CardLabelForm',
	components: {
		FieldPaneCLF
	},
	onLoad(options) {
		this.form.basicInfo.enterpriseUserId = this.$store.getters.electronicCardInfo.enterpriseUserId
		if (Number(options.id)) {
			this.form.basicInfo.labelId = options.id
			this.getElectronicLabel(options.id)
		}
	},
	data() {
		return {
			applyOne: [
				{
					label: '标签ID：',
					field: 'labelId',
					type: 'input',
					placeholder: '标签ID'
				},
				{
					label: '创建时间：',
					field: 'createTime',
					type: 'input',
					placeholder: '创建时间'
				},
				{
					label: '关联名片ID：',
					field: 'enterpriseUserId',
					type: 'input',
					placeholder: '关联名片ID'
				},
				{
					label: '标签名称：',
					field: 'labelName',
					type: 'input',
					placeholder: '请填写标签名称'
				}
			],
			form: {
				basicInfo: {
					labelId: '',
					createTime: '',
					enterpriseUserId: '',
					labelName: ''
				}
			}
		}
	},

	methods: {
		// 获取标签信息
		async getElectronicLabel(id) {
			uni.showLoading()
			try {
				const res = await getEnterpriseUserLabelDetailApi({ labelId: id })
				uni.hideLoading()
				// this.form.basicInfo.labelId = res.data.labelId || ''
				this.form.basicInfo.createTime = res.data.createTime || ''
				this.form.basicInfo.enterpriseUserId = res.data.enterpriseUserId || ''
				this.form.basicInfo.labelName = res.data.labelName || ''
			} catch (err) {
				console.log(err)
				uni.hideLoading()
			}
		},

		// 点击提交按钮
		submit() {
			const data = {
				...this.form.basicInfo
			}
			console.log(data)
			if (!data.labelName) {
				this.$showToast('缺少标签名称')
				return
			}
			if (!data.enterpriseUserId) {
				this.$showToast('缺少关联名片ID')
				return
			}
			uni.showModal({
				title: '提示',
				content: '确认提交名片标签表单？',
				success: (res) => {
					if (res.confirm) {
						if (data.labelId) {
							updateByIdEnterpriseUserLabelApi(data).then((res) => {
								this.$showToast('提交成功')
								setTimeout(() => {
									uni.navigateBack()
								}, 2000)
							})
						} else {
							addEnterpriseUserLabelSaveApi(data).then((res) => {
								this.$showToast('提交成功')
								setTimeout(() => {
									uni.navigateBack()
								}, 2000)
							})
						}
					}
				}
			})
		}
	}
}
</script>

<style lang="less" scoped>
.card-label-form-container {
	padding: 40upx 40upx 140upx 40upx;
	box-sizing: border-box;

	.buts {
		position: fixed;
		bottom: -1px;
		z-index: 2;
		padding: 20upx 40upx;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		width: 100%;
		box-sizing: border-box;
		margin-top: 272upx;
	}

	.btn {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 72upx;
		width: 306upx;
		font-size: 32upx;
		color: #fff;
		margin: 0;
		background-color: #07b9b9;
		border-radius: 100px;

		&:last-child {
			background-color: #fa5151;
		}
	}
}
</style>

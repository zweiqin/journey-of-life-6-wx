<template>
	<view class="calling-card-form-container">
		<JHeader width="50" height="50" title="名片表单"></JHeader>
		<view>
			<view style="font-size: 34rpx;font-weight: bold;">
				使用申明
			</view>
			<view style="margin-top: 14rpx;font-size: 28rpx;color: #706f6f;">
				<view>1. 请确保微信号、qq号和邮箱百分百有效，之后将用于首页电子名片的信息显示。</view>
				<view>2. 在未经您同意及确认之前，本程序不会将您的注册信息用于任何其它商业目的。</view>
				<view>3. 本程序将对您所提供的资料进行严格的管理及保护，本程序将使用相应的技术，防止您的个人资料丢失、被盗用或遭篡改。</view>
				<view>4. 请您放心使用！</view>
			</view>
			<view
				style="display: flex;align-items: center;margin-top: 14rpx;font-size: 28rx;color: #222229;"
			>
				<radio
					style="transform:scale(0.8)" border-color="#000000" color="#CE2601" :checked="isReadAgreement"
					@click="isReadAgreement = !isReadAgreement"
				/>
				<view>
					同意向小程序提供个人信息
				</view>
			</view>
		</view>

		<FieldPaneCCF v-model="form.basicInfo" :fields="applyOne" title="基本信息"></FieldPaneCCF>

		<FieldPaneCCF v-model="form.relatesInfo" :fields="applyTow" title="企业信息"></FieldPaneCCF>

		<ATFUpload
			:title="uploadFields[0].label" :img-url="form.imgs[uploadFields[0].field]"
			@upload="handleSaveImg(uploadFields[0].field, $event)" @delete="handleDeleteImg(uploadFields[0].field)"
		></ATFUpload>

		<ATFMoreUpload
			:title="uploadFields[1].label" :imgs="form.imgs[uploadFields[1].field]"
			@upload="handleSaveImg(uploadFields[1].field, $event)" @delete="handleDeleteImg(uploadFields[1].field, $event)"
		></ATFMoreUpload>

		<ATFUpload
			v-if="String(form.relatesInfo.isEnterprise) === 'true'"
			:title="uploadFields[2].label" :img-url="form.imgs[uploadFields[2].field]"
			@upload="handleSaveImg(uploadFields[2].field, $event)" @delete="handleDeleteImg(uploadFields[2].field)"
		></ATFUpload>
		<view class="buts">
			<button class="btn" @click="submit()">
				提交
			</button>
		</view>
	</view>
</template>

<script>
import FieldPaneCCF from './components/field-pane-ccf.vue'
import { addEnterpriseUserSaveApi, updateByIdEnterpriseUserApi } from '../../../api/anotherTFInterface'

export default {
	name: 'CallingCardForm',
	components: {
		FieldPaneCCF
	},
	onLoad(options) {
		if (Number(options.id)) {
			this.form.basicInfo.buyerId = options.id
			this.form.relatesInfo.isEnterprise = 'false'
			this.getElectronicCard(options.id)
		}
	},
	data() {
		return {
			isReadAgreement: false,
			applyOne: [
				{
					label: 'ID：',
					field: 'enterpriseUserId',
					type: 'input',
					placeholder: '请输入名片ID'
				},
				{
					label: '用户ID：',
					field: 'buyerId',
					type: 'input',
					placeholder: '请输入用户D'
				},
				{
					label: '关联标签：',
					field: 'label',
					type: 'input',
					placeholder: '请输入关联标签'
				},
				{
					label: '昵称：',
					field: 'name',
					type: 'input',
					placeholder: '请输入昵称'
				},
				{
					label: '性别：',
					field: 'sex',
					type: 'radio',
					placeholder: '请选择性别'
				},
				{
					label: '生日：',
					field: 'birthday',
					type: 'time',
					placeholder: '请选择生日时间'
				},
				{
					label: '手机号：',
					field: 'phone',
					type: 'input',
					placeholder: '请输入手机号'
				},
				{
					label: '座机：',
					field: 'landline',
					type: 'input',
					placeholder: '请输入座机'
				},
				{
					label: '邮箱：',
					field: 'mailbox',
					type: 'input',
					placeholder: '请输入邮箱'
				},
				{
					label: '微信号：',
					field: 'weChatSignal',
					type: 'input',
					placeholder: '请输入微信号'
				},
				{
					label: '个人简介',
					type: 'textarea',
					field: 'personalProfile',
					placeholder: '请填写个人简介'
				},
				{
					label: '地址',
					type: 'textarea',
					field: 'address',
					placeholder: '请填写地址'
				},
				// {
				// 	label: '是否启用：',
				// 	field: 'state',
				// 	type: 'radio',
				// 	placeholder: '是否启用'
				// },
				// {
				// 	label: '是否加入黑名单：',
				// 	field: 'ifBlack',
				// 	type: 'radio',
				// 	placeholder: '是否加入黑名单'
				// },
				{
					label: '样式：',
					field: 'styleId',
					type: 'select',
					placeholder: '请选择样式'
				}
			],
			applyTow: [
				{
					label: '是否企业：',
					field: 'isEnterprise',
					type: 'radio',
					placeholder: '是否企业'
				},
				{
					label: '企业名称：',
					field: 'enterpriseName',
					type: 'input',
					placeholder: '请输入企业名称'
				},
				{
					label: '担任职务：',
					field: 'enterpriseDuties',
					type: 'input',
					placeholder: '请输入担任职务'
				},
				{
					label: '部门：',
					field: 'enterpriseDepartment',
					type: 'input',
					placeholder: '请输入部门'
				}
			],
			uploadFields: [
				{
					label: '用户名片头像',
					field: 'headImage'
				},
				{
					label: '图片介绍',
					field: 'pictureIntroduction'
				},
				{
					label: '企业头像',
					field: 'enterpriseHeadImage'
				}
			],
			form: {
				basicInfo: {
					buyerId: '',
					enterpriseUserId: '',
					label: '',
					name: '',
					sex: '',
					birthday: '',
					phone: '',
					landline: '',
					mailbox: '',
					weChatSignal: '',
					personalProfile: '',
					address: '',
					// state: '',
					// ifBlack: '',
					styleId: ''
				},
				relatesInfo: {
					isEnterprise: '',
					enterpriseName: '',
					enterpriseDuties: '',
					enterpriseDepartment: ''
				},
				imgs: {
					headImage: '',
					pictureIntroduction: [],
					enterpriseHeadImage: ''
				}
			}
		}
	},

	methods: {
		// 获取名片详情
		async getElectronicCard(id) {
			uni.showLoading()
			try {
				const data = await this.$store.dispatch('user/getElectronicCardAction')
				uni.hideLoading()
				this.form.basicInfo.buyerId = data.buyerId || ''
				this.form.basicInfo.enterpriseUserId = data.enterpriseUserId || ''
				this.form.basicInfo.label = data.label || ''
				this.form.basicInfo.name = data.name || ''
				this.form.basicInfo.sex = String(data.sex) || ''
				this.form.basicInfo.birthday = data.birthday || ''
				this.form.basicInfo.phone = data.phone || ''
				this.form.basicInfo.landline = data.landline || ''
				this.form.basicInfo.mailbox = data.mailbox || ''
				this.form.basicInfo.weChatSignal = data.weChatSignal || ''
				this.form.basicInfo.personalProfile = data.personalProfile || ''
				this.form.basicInfo.address = data.address || ''
				// this.form.basicInfo.state = String(data.state) || ''
				// this.form.basicInfo.ifBlack = String(data.ifBlack) || ''
				this.form.basicInfo.styleId = data.styleId || ''
				this.form.imgs.headImage = data.headImage || ''
				this.form.imgs.pictureIntroduction = data.pictureIntroduction.split(',') || []
				this.form.relatesInfo.isEnterprise = String(data.isEnterprise) || ''
				this.form.relatesInfo.enterpriseName = data.enterpriseName || ''
				this.form.relatesInfo.enterpriseDuties = data.enterpriseDuties || ''
				this.form.relatesInfo.enterpriseDepartment = data.enterpriseDepartment || ''
				this.form.imgs.enterpriseHeadImage = data.enterpriseHeadImage || ''
			} catch (err) {
				console.log(err)
				uni.hideLoading()
			}
		},

		handleSaveImg(field, imgUrl) {
			console.log(field, imgUrl)
			if ((field === 'headImage') || (field === 'enterpriseHeadImage')) {
				this.form.imgs[field] = imgUrl
			} else if (field === 'pictureIntroduction') {
				this.form.imgs[field].push(imgUrl)
			}
			this.$forceUpdate()
			console.log(this.form.imgs[this.uploadFields[0].field])
		},

		// 点击提交按钮
		submit() {
			if (!this.isReadAgreement) return this.$showToast('请先同意小程序获取用户信息')
			const data = {
				...this.form.basicInfo,
				// ifBlack: this.form.basicInfo.ifBlack ? Number(this.form.basicInfo.ifBlack) : '',
				...this.form.relatesInfo,
				isEnterprise: this.form.relatesInfo.isEnterprise === 'true' ? true : this.form.relatesInfo.isEnterprise === 'false' ? false : '',
				...this.form.imgs,
				pictureIntroduction: this.form.imgs.pictureIntroduction.join(',')
			}
			console.log(data)
			if (!data.name) {
				this.$showToast('缺少昵称')
				return
			}
			if (!data.sex) {
				this.$showToast('缺少性别')
				return
			}
			if (!data.styleId) {
				this.$showToast('缺少样式')
				return
			}
			if (typeof data.isEnterprise !== 'boolean') {
				this.$showToast('请选择是否企业')
				return
			}
			if ((typeof data.isEnterprise === 'boolean') && data.isEnterprise && !data.enterpriseName) {
				this.$showToast('缺少企业名称')
				return
			}
			uni.showModal({
				title: '提示',
				content: '确认提交名片表单？',
				success: (res) => {
					if (res.confirm) {
						if (data.buyerId) {
							updateByIdEnterpriseUserApi(data).then((res) => {
								this.$showToast('修改名片成功')
								setTimeout(() => {
									uni.navigateBack()
								}, 2000)
							})
						} else {
							addEnterpriseUserSaveApi(data).then((res) => {
								this.$showToast('添加名片成功')
								setTimeout(() => {
									uni.navigateBack()
								}, 2000)
							})
						}
					}
				}
			})
		},

		// 删除当前图片
		handleDeleteImg(field, imgUrl) {
			if ((field === 'headImage') || (field === 'enterpriseHeadImage')) {
				this.form.imgs[field] = ''
			} else if (field === 'pictureIntroduction') {
				this.form.imgs[field].splice(this.form.imgs[field].findIndex((item) => item === imgUrl), 1)
			}
			this.$forceUpdate()
			console.log(this.form.imgs[field])
		}
	}
}
</script>

<style lang="less" scoped>
.calling-card-form-container {
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

		&.withdraw {
			width: 100%;
			background: #999;
			letter-spacing: 10upx;
		}
	}
}
</style>

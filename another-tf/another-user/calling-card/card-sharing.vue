<template>
	<view class="card-sharing-container">
		<view v-if="electronicCardShareInfo.buyerId">
			<view style="padding: 20rpx;font-size: 36rpx;font-weight: bold;text-align: center;">
				{{ electronicCardShareInfo.name || '无名' }}的名片
			</view>
			<ATFCardDisplay
				:card-data="electronicCardShareInfo" :label-list="electronicLabelShareInfo"
				introduction-pic-margin="14rpx -30rpx 0"
			>
				<template #bottomFoot="obj">
					<view
						v-if="obj.data.labelList && obj.data.labelList.length"
						style="display: flex;flex-wrap: wrap;padding: 8rpx 0;"
					>
						<tui-button
							v-for="(item, index) in obj.data.labelList" :key="item.labelId" width="fit-content" height="58rpx"
							:size="28"
							plain :type="item.isPraise ? 'warning' : 'white'" shape="circle" margin="8rpx 0 0 12rpx"
							@click="handleClickLabelPrise(index, item)"
						>
							<view style="margin: 0 20rpx;">
								<text style="margin-right: 10rpx;">{{ item.labelName }}</text>
								<tui-icon name="agree" :size="18" :color="item.isPraise ? '#fc872d' : '#999999'"></tui-icon>
							</view>
						</tui-button>
					</view>
				</template>
			</ATFCardDisplay>
			<view
				style="display: flex;justify-content: space-between;align-items: center;flex-wrap: wrap;padding-bottom: 20rpx;border-bottom: 2rpx solid #cccccc;"
			>
				<tui-button
					v-if="electronicCardShareInfo.weChatSignal" type="blue" width="280rpx" height="68rpx"
					margin="20rpx auto 0" @click="$copy(electronicCardShareInfo.weChatSignal)"
				>
					复制微信号
				</tui-button>
				<tui-button type="blue" width="280rpx" height="68rpx" margin="20rpx auto 0" open-type="share">
					分享名片
				</tui-button>
				<tui-button
					v-if="electronicCardShareInfo.phone" type="blue" width="280rpx" height="68rpx"
					margin="20rpx auto 0"
					@click="handlePhoneCall(electronicCardShareInfo.phone)"
				>
					拨打电话
				</tui-button>
				<tui-button
					v-if="electronicCardShareInfo.phone" type="blue" width="280rpx" height="68rpx"
					margin="20rpx auto 0"
					@click="handlePhoneContact(electronicCardShareInfo)"
				>
					同步到通讯录
				</tui-button>
			</view>
		</view>
		<view style="padding-bottom: 45rpx;">
			<LoadingMore :status="isLoading ? 'loading' : ''"></LoadingMore>
			<view v-if="!isLoading && !electronicCardShareInfo.enterpriseUserId">
				<tui-no-data :fixed="false">出错了～</tui-no-data>
			</view>
		</view>
	</view>
</template>

<script>
import { getStorageUserId } from '../../../utils'
import { getIdEnterpriseUserApi, getUserIdEnterpriseUserLabelApi, updateByLabelEnterpriseUserLikeApi, updateByIdCanEnterpriseUserLikeApi } from '../../../api/anotherTFInterface'

export default {
	name: 'CardSharing',
	data() {
		return {
			electronicCardShareInfo: {
				enterpriseUserId: '',
				buyerId: ''
			},
			electronicLabelShareInfo: [
				// {
				// 	labelId: '标签Id',
				// 	labelName: '标签名称',
				// 	enterpriseUserId: '关联名片ID',
				// 	createTime: '创建时间',
				// 	updateTime: '更新时间',
				// 	isPraise: false
				// }
			],
			isLoading: true
		}
	},
	onLoad(options) {
		this.electronicCardShareInfo.buyerId = Number(options.id) || ''
		this.getCardData(this.electronicCardShareInfo.buyerId)
	},
	onShareAppMessage(res) {
		if ((res.from === 'button') || (res.from === 'menu')) {
			console.log(res.target)
		}
		return {
			title: '您好，这是我的名片，望惠存',
			path: `/another-tf/another-user/calling-card/card-sharing?id=${this.electronicCardShareInfo.buyerId}`,
			imageUrl: (this.electronicCardShareInfo.pictureIntroduction && this.electronicCardShareInfo.pictureIntroduction.split(',')[0]) || this.electronicCardShareInfo.headImage || ''
			// imageUrl: '/static/images/userimg.png',
		}
	},
	methods: {
		async getCardData(id) {
			if (id) {
				uni.showLoading()
				this.isLoading = true
				try {
					const tempResultCard = await getIdEnterpriseUserApi({ id })
					this.electronicCardShareInfo = tempResultCard.data
					if (tempResultCard) {
						const tempResultLabel = await getUserIdEnterpriseUserLabelApi({ enterpriseUserId: this.electronicCardShareInfo.enterpriseUserId })
						this.electronicLabelShareInfo = tempResultLabel.data.map((item) => ({ ...item, isPraise: false }))
					}
					uni.hideLoading()
					this.isLoading = false
				} catch (err) {
					uni.hideLoading()
					this.isLoading = false
				}
			} else {
				this.$showToast('缺少名片信息')
			}
		},
		handleClickLabelPrise(index, item) {
			if (getStorageUserId()) {
				uni.showLoading()
				if (!item.isPraise) {
					updateByLabelEnterpriseUserLikeApi({
						likeUserId: getStorageUserId(),
						quiltUserId: this.electronicCardShareInfo.buyerId,
						labelId: item.labelId
					}).then((res) => {
						uni.hideLoading()
						this.electronicLabelShareInfo[index].isPraise = !item.isPraise
					})
						.catch((e) => {
							uni.hideLoading()
						})
				} else {
					updateByIdCanEnterpriseUserLikeApi({
						likeUserId: getStorageUserId(),
						labelId: item.labelId
					}).then((res) => {
						uni.hideLoading()
						this.electronicLabelShareInfo[index].isPraise = !item.isPraise
					})
						.catch((e) => {
							uni.hideLoading()
						})
				}
			}
		},
		handlePhoneContact(data) {
			uni.addPhoneContact({
				mobilePhoneNumber: data.phone,
				firstName: data.name || '',
				email: data.mailbox || '',
				weChatNumber: data.weChatSignal || '',
				remark: data.personalProfile || '',
				organization: data.enterpriseName || '',
				title: data.enterpriseDuties || '',
				success() {
					console.log('success')
				},
				fail() {
					console.log('fail')
				}
			})
		},
		handlePhoneCall(phone) {
			uni.makePhoneCall({
				phoneNumber: phone,
				success: (res) => {
					console.log('调用成功!')
				},
				fail: (res) => {
					console.log('调用失败!')
				}
			})
		}
	}
}
</script>

<style lang="less" scoped>
.card-sharing-container {
	min-height: 100vh;
	padding: 0 30rpx 120rpx;
	background-color: #fefefe;
	box-sizing: border-box;
}
</style>

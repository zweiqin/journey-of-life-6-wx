<template>
	<view class="index-container">
		<TuanAppShim bg="transparent"></TuanAppShim>
		<view style="padding-top: 30rpx;font-size: 28rpx;">
			<view v-if="electronicCardInfo.buyerId">

				<view style="padding: 20rpx;background-color: #476088;color: #ffffff;border-radius: 14rpx;">
					<view
						v-if="(electronicCardInfo.styleId === 1) || (electronicCardInfo.styleId === 2) || (electronicCardInfo.styleId === 3)"
					>
						<view style="display: flex;align-items: center;">
							<view style="flex: 1;display: flex;align-items: center;">
								<view style="text-align: center;">
									<image
										:src="common.seamingImgUrl(electronicCardInfo.headImage)"
										style="width: 102rpx;height: 102rpx;border-radius: 50%;"
									></image>
								</view>
								<view style="margin-left: 28rpx;">
									<view style="display: flex;align-items: center;">
										<view>{{ electronicCardInfo.name }}</view>
										<view style="margin-left: 20rpx;">
											<text v-if="electronicCardInfo.sex == 1">男</text>
											<text v-else-if="electronicCardInfo.sex == 2">女</text>
											<text v-else>未知</text>
										</view>
									</view>
									<view style="font-size: 26rpx;">{{ electronicCardInfo.birthday }}</view>
								</view>
							</view>
							<view v-if="electronicCardInfo.ifBlack" style="margin-left: 20rpx;font-weight: bold;">已加入黑名单</view>
						</view>
						<view style="margin-top: 12rpx;">
							<view style="display: flex;justify-content: space-between;align-items: center;">
								<view style="flex: 2;display: flex;align-items: flex-start;padding-top: 8rpx;">
									<tui-icon :size="28" color="#dedcdc" name="mobile" unit="rpx" margin="0 18rpx 0 0"></tui-icon>
									<view>{{ electronicCardInfo.phone }}</view>
								</view>
								<view
									v-if="electronicCardInfo.landline"
									style="flex: 3;display: flex;align-items: flex-start;padding-top: 8rpx;"
								>
									<tui-icon :size="28" color="#dedcdc" name="voipphone" unit="rpx" margin="0 18rpx 0 0"></tui-icon>
									<view>{{ electronicCardInfo.landline }}</view>
								</view>
							</view>
							<view style="display: flex;justify-content: space-between;align-items: center;">
								<view
									v-if="electronicCardInfo.mailbox"
									style="flex: 2;display: flex;align-items: flex-start;padding-top: 8rpx;"
								>
									<tui-icon :size="28" color="#dedcdc" name="mail" unit="rpx" margin="0 18rpx 0 0"></tui-icon>
									<view>{{ electronicCardInfo.mailbox }}</view>
								</view>
								<view
									v-if="electronicCardInfo.weChatSignal"
									style="flex: 3;display: flex;align-items: flex-start;padding-top: 8rpx;"
								>
									<tui-icon :size="28" color="#dedcdc" name="wechat" unit="rpx" margin="0 18rpx 0 0"></tui-icon>
									<view>{{ electronicCardInfo.weChatSignal }}</view>
								</view>
							</view>
							<view
								v-if="electronicCardInfo.personalProfile"
								style="display: flex;align-items: flex-start;padding-top: 8rpx;"
							>
								<tui-icon :size="28" color="#dedcdc" name="message" unit="rpx" margin="0 18rpx 0 0"></tui-icon>
								<view>{{ electronicCardInfo.personalProfile }}</view>
							</view>
							<view style="display: flex;align-items: flex-start;padding-top: 8rpx;">
								<tui-icon :size="28" color="#dedcdc" name="position" unit="rpx" margin="0 18rpx 0 0"></tui-icon>
								<view>{{ electronicCardInfo.address }}</view>
							</view>
						</view>
					</view>
					<view v-else style="padding-bottom: 45rpx;">
						<tui-no-data :fixed="false">您还未设置名片样式～</tui-no-data>
					</view>
					<view
						v-if="electronicLabelInfo && electronicLabelInfo.length"
						style="display: flex;flex-wrap: wrap;padding: 8rpx 0;"
					>
						<view
							v-for="item in electronicLabelInfo" :key="item.labelId"
							style="margin: 8rpx 0 0 12rpx;padding: 6rpx 16rpx;border: 2rpx solid #d8d3d3;background-color: #292d3c;border-radius: 6rpx;"
						>
							{{ item.labelName }}
						</view>
					</view>
				</view>
				<view style="margin: 14rpx -30rpx 0;padding: 16rpx 16rpx 0;background-color: #e8e8e8;">
					<view style="margin-left: 30rpx;font-size: 30rpx;font-weight: bold;">图片介绍</view>
					<view style="margin-top: 18rpx;">
						<swiper
							autoplay :interval="3000" circular :previous-margin="previousMargin"
							:next-margin="nextMargin"
							:duration="1000" style="height: 328rpx;" @change="handleSwiperChange"
						>
							<swiper-item v-for="(item, index) in electronicCardInfo.pictureIntroduction.split(',')" :key="index">
								<tui-lazyload-img
									mode="scaleToFill" width="600rpx" height="100%" radius="20rpx"
									:src="common.seamingImgUrl(item)"
								></tui-lazyload-img>
							</swiper-item>
						</swiper>
					</view>
				</view>
				<view
					v-if="electronicCardInfo.isEnterprise"
					style="padding: 20rpx;margin-top: 30rpx;background-color: #2d3d5a;color: #ffffff;border-radius: 14rpx;"
				>
					<view>企业信息</view>
					<view style="margin-top: 20rpx;display: flex;justify-content: space-between;align-items: center;">
						<view style="text-align: center;">
							<image
								:src="common.seamingImgUrl(electronicCardInfo.enterpriseHeadImage)"
								style="width: 102rpx;height: 102rpx;border-radius: 50%;"
							></image>
						</view>
						<view style="flex: 1;margin-left: 28rpx;">
							<view>企业名称：{{ electronicCardInfo.enterpriseName }}</view>
							<view>职务：{{ electronicCardInfo.enterpriseDuties || '--' }}</view>
						</view>
					</view>
				</view>

				<view>
					<view
						style="display: flex;justify-content: space-between;align-items: center;padding-bottom: 20rpx;border-bottom: 2rpx solid #cccccc;"
					>
						<tui-button type="blue" width="220rpx" height="68rpx" margin="20rpx auto 0" open-type="share">
							分享名片
						</tui-button>
						<tui-button type="blue" width="220rpx" height="68rpx" margin="20rpx auto 0" @click="onAdd()">
							同步到通讯录
						</tui-button>
						<tui-button
							type="blue" width="220rpx" height="68rpx" margin="20rpx auto 0"
							@click="go(`/another-tf/another-user/calling-card-management/calling-card-form?id=${electronicCardInfo.buyerId}`)"
						>
							编辑名片
						</tui-button>
					</view>
					<tui-list-view>
						<tui-list-cell background-color="transparent" padding="20rpx 0">
							<view style="display: flex;justify-content: space-between;align-items: center;padding-left: 4rpx;">
								<view>
									<view v-if="electronicLabelInfo && electronicLabelInfo.length">标签</view>
									<view v-else>您还没设置名片标签</view>
								</view>
								<view style="flex: 1;text-align: right;">
									<view
										v-if="electronicLabelInfo && electronicLabelInfo.length"
										style="display: inline-block;width: fit-content;"
									>
										<tui-button
											type="blue" width="220rpx" height="68rpx" margin="20rpx 0 0"
											@click="go(`/another-tf/another-user/calling-card-management/label-list`)"
										>
											管理标签
										</tui-button>
									</view>
									<view v-else style="display: inline-block;width: fit-content;">
										<tui-button
											type="blue" width="220rpx" height="68rpx" margin="20rpx 0 0"
											@click="go(`/another-tf/another-user/calling-card-management/card-label-form`)"
										>
											新建标签
										</tui-button>
									</view>
								</view>
							</view>
						</tui-list-cell>
						<tui-list-cell background-color="transparent" padding="20rpx 0">
							<view style="display: flex;justify-content: space-between;align-items: center;padding-left: 4rpx;">
								<text>是否启用：</text>
								<view style="flex: 1;text-align: right;">
									<text v-if="electronicCardInfo.state">是</text>
									<text v-else>否</text>
								</view>
							</view>
						</tui-list-cell>
						<tui-list-cell background-color="transparent" padding="20rpx 0">
							<view style="display: flex;justify-content: space-between;align-items: center;padding-left: 4rpx;">
								<text>是否加入黑名单：</text>
								<view style="flex: 1;text-align: right;">
									<text v-if="electronicCardInfo.ifBlack">是</text>
									<text v-else>否</text>
								</view>
							</view>
						</tui-list-cell>
						<tui-list-cell background-color="transparent" padding="20rpx 0">
							<view style="display: flex;justify-content: space-between;align-items: center;padding-left: 4rpx;">
								<text>名片头像：</text>
								<view style="flex: 1;text-align: right;">
									<image
										:src="common.seamingImgUrl(electronicCardInfo.headImage)"
										style="width: 102rpx;height: 102rpx;border-radius: 50%;"
									></image>
								</view>
							</view>
						</tui-list-cell>
						<tui-list-cell background-color="transparent" padding="20rpx 0">
							<view style="display: flex;justify-content: space-between;align-items: center;padding-left: 4rpx;">
								<text>用户ID：</text>
								<text style="flex: 1;text-align: right;">{{ electronicCardInfo.buyerId }}</text>
							</view>
						</tui-list-cell>
						<tui-list-cell background-color="transparent" padding="20rpx 0">
							<view style="display: flex;justify-content: space-between;align-items: center;padding-left: 4rpx;">
								<text>昵称：</text>
								<text style="flex: 1;text-align: right;">{{ electronicCardInfo.name }}</text>
							</view>
						</tui-list-cell>
						<tui-list-cell background-color="transparent" padding="20rpx 0">
							<view style="display: flex;justify-content: space-between;align-items: center;padding-left: 4rpx;">
								<text>性别：</text>
								<view style="flex: 1;text-align: right;">
									<text v-if="electronicCardInfo.sex == 1">男</text>
									<text v-else-if="electronicCardInfo.sex == 2">女</text>
									<text v-else>未知</text>
								</view>
							</view>
						</tui-list-cell>
						<tui-list-cell background-color="transparent" padding="20rpx 0">
							<view style="display: flex;justify-content: space-between;align-items: center;padding-left: 4rpx;">
								<text>生日：</text>
								<text style="flex: 1;text-align: right;">{{ electronicCardInfo.birthday }}</text>
							</view>
						</tui-list-cell>
						<tui-list-cell background-color="transparent" padding="20rpx 0">
							<view style="display: flex;justify-content: space-between;align-items: center;padding-left: 4rpx;">
								<text>手机号：</text>
								<text style="flex: 1;text-align: right;">{{ electronicCardInfo.phone }}</text>
							</view>
						</tui-list-cell>
						<tui-list-cell background-color="transparent" padding="20rpx 0">
							<view style="display: flex;justify-content: space-between;align-items: center;padding-left: 4rpx;">
								<text>地址：</text>
								<text style="flex: 1;text-align: right;">{{ electronicCardInfo.address }}</text>
							</view>
						</tui-list-cell>
						<tui-list-cell background-color="transparent" padding="20rpx 0">
							<view style="display: flex;justify-content: space-between;align-items: center;padding-left: 4rpx;">
								<text>邮箱：</text>
								<text style="flex: 1;text-align: right;">{{ electronicCardInfo.mailbox }}</text>
							</view>
						</tui-list-cell>
						<tui-list-cell background-color="transparent" padding="20rpx 0">
							<view style="display: flex;justify-content: space-between;align-items: center;padding-left: 4rpx;">
								<text>微信号：</text>
								<text style="flex: 1;text-align: right;">{{ electronicCardInfo.weChatSignal }}</text>
							</view>
						</tui-list-cell>
						<tui-list-cell background-color="transparent" padding="20rpx 0">
							<view style="display: flex;justify-content: space-between;align-items: center;padding-left: 4rpx;">
								<text>座机：</text>
								<text style="flex: 1;text-align: right;">{{ electronicCardInfo.landline }}</text>
							</view>
						</tui-list-cell>
						<tui-list-cell background-color="transparent" padding="20rpx 0">
							<view style="display: flex;justify-content: space-between;align-items: center;padding-left: 4rpx;">
								<text>个人简介：</text>
								<text style="flex: 1;text-align: right;">{{ electronicCardInfo.personalProfile }}</text>
							</view>
						</tui-list-cell>
						<tui-list-cell background-color="transparent" padding="20rpx 0">
							<view style="display: flex;justify-content: space-between;align-items: center;padding-left: 4rpx;">
								<text>创建时间：</text>
								<text style="flex: 1;text-align: right;">{{ electronicCardInfo.createTime }}</text>
							</view>
						</tui-list-cell>
						<tui-list-cell background-color="transparent" padding="20rpx 0">
							<view style="display: flex;justify-content: space-between;align-items: center;padding-left: 4rpx;">
								<text>更新时间：</text>
								<text style="flex: 1;text-align: right;">{{ electronicCardInfo.updateTime }}</text>
							</view>
						</tui-list-cell>
						<tui-list-cell background-color="transparent" padding="20rpx 0">
							<view style="display: flex;justify-content: space-between;align-items: center;padding-left: 4rpx;">
								<text>样式ID：</text>
								<text style="flex: 1;text-align: right;">{{ electronicCardInfo.styleId }}</text>
							</view>
						</tui-list-cell>
						<tui-list-cell background-color="transparent" padding="20rpx 0">
							<view style="display: flex;justify-content: space-between;align-items: center;padding-left: 4rpx;">
								<text>用户标签ID：</text>
								<text style="flex: 1;text-align: right;">{{ electronicCardInfo.label }}</text>
							</view>
						</tui-list-cell>
						<tui-list-cell background-color="transparent" padding="20rpx 0">
							<view style="display: flex;justify-content: space-between;align-items: center;padding-left: 4rpx;">
								<text>是否企业：</text>
								<view style="flex: 1;text-align: right;">
									<text v-if="electronicCardInfo.isEnterprise">是</text>
									<text v-else>否</text>
								</view>
							</view>
						</tui-list-cell>
						<view v-if="electronicCardInfo.isEnterprise">
							<tui-list-cell background-color="transparent" padding="20rpx 0">
								<view style="display: flex;justify-content: space-between;align-items: center;padding-left: 4rpx;">
									<text>企业头像：</text>
									<view style="flex: 1;text-align: right;">
										<image
											:src="common.seamingImgUrl(electronicCardInfo.enterpriseHeadImage)"
											style="width: 102rpx;height: 102rpx;border-radius: 50%;"
										></image>
									</view>
								</view>
							</tui-list-cell>
							<tui-list-cell background-color="transparent" padding="20rpx 0">
								<view style="display: flex;justify-content: space-between;align-items: center;padding-left: 4rpx;">
									<text>企业名称：</text>
									<text style="flex: 1;text-align: right;">{{ electronicCardInfo.enterpriseName }}</text>
								</view>
							</tui-list-cell>
							<tui-list-cell background-color="transparent" padding="20rpx 0">
								<view style="display: flex;justify-content: space-between;align-items: center;padding-left: 4rpx;">
									<text>担任职务：</text>
									<text style="flex: 1;text-align: right;">{{ electronicCardInfo.enterpriseDuties }}</text>
								</view>
							</tui-list-cell>
						</view>
					</tui-list-view>
				</view>
			</view>
			<view v-else style="padding-bottom: 45rpx;">
				<tui-no-data :fixed="false">您还未设置名片～</tui-no-data>
				<tui-button
					type="blue" width="220rpx" height="68rpx" margin="20rpx auto 0"
					@click="go(`/another-tf/another-user/calling-card-management/calling-card-form`)"
				>
					新建名片
				</tui-button>
			</view>

			<view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	name: 'Index',
	data() {
		return {
			previousMargin: '0',
			nextMargin: '80rpx',

			id: '',
			headerImg: require('../../static/images/userimg.png'),
			cardObj: {},
			visitorList: [],
			visitorCount: 0,
			headerList: []
		}
	},
	async onShow(options) {
		console.log('onLoad options', options)
		// if (uni.getStorageSync(USER_INFO)) {
		// 	var user = uni.getStorageSync(USER_INFO)
		// 	if (id != null && id != '') {
		// 		this.id = id
		// 		const card = await request('uni-card', 'getCard', {
		// 			id,
		// 			uid: user.id
		// 		}, {
		// 			showloading: true
		// 		})
		// 		if (card._id == '') {
		// 			this.getDefault()
		// 		} else {
		// 			const visitorList = await request('uni-card', 'getVisitorList', {
		// 				card_id: id,
		// 				skip: 0,
		// 				limit: 8
		// 			}, {
		// 				showloading: true
		// 			})
		// 			this.cardObj = card
		// 			this.visitorCount = visitorList.total
		// 			visitorList.items.forEach((arr, index) => {
		// 				if (arr.head_img) { this.headerList.push(arr.head_img) } else { this.headerList.push(require('../../static/images/userimg.png')) }
		// 			})
		// 		}
		// 	} else {
		// 		const mycard = await request('uni-card', 'getMyCard', {
		// 			uid: user.id
		// 		}, {
		// 			showloading: true
		// 		})
		// 		if (mycard._id == '') {
		// 			this.getDefault()
		// 		} else {
		// 			const myVisitorList = await request('uni-card', 'getMyVisitorList', {
		// 				uid: user.id,
		// 				skip: 0,
		// 				limit: 8
		// 			}, {
		// 				showloading: true
		// 			})
		// 			this.cardObj = mycard
		// 			this.visitorCount = myVisitorList.total
		// 			myVisitorList.items.forEach((arr, index) => {
		// 				if (arr.head_img) { this.headerList.push(arr.head_img) } else { this.headerList.push(require('../../static/images/userimg.png')) }
		// 			})
		// 		}
		// 	}
		// }
	},
	onShareAppMessage(res) {
		if (this.id == '' || this.id == null) {
			this.id = '61b30b8091a7500001dea375'
		}
		return {
			title: '您好，这是我的名片，望惠存',
			path: '/pages/index?id=' + this.id
		}
	},
	computed: {
		...mapGetters(['electronicCardInfo', 'electronicLabelInfo'])
	},
	methods: {
		handleSwiperChange(e) {
			if (this.$store.getters.electronicCardInfo.pictureIntroduction && this.$store.getters.electronicCardInfo.pictureIntroduction.split(',').length === 1) {
				console.log(e)
				if (e.detail.current === 1) {
					this.nextMargin = '0'
					this.previousMargin = '80rpx'
				} else {
					this.nextMargin = '80rpx'
					this.previousMargin = '0'
				}
			}
		},

		async getDefault() {
			const card = await request('uni-card', 'getCard', {
				id: '61b30b8091a7500001dea375',
				uid: '61b30b4e7964120001e32f41'
			}, {
				showloading: true
			})
			if (card._id == '') {
				this.gotoEdit()
			}
			const visitorList = await request('uni-card', 'getVisitorList', {
				card_id: '61b30b8091a7500001dea375',
				skip: 0,
				limit: 8
			}, {
				showloading: true
			})
			this.cardObj = card
			this.visitorCount = visitorList.total
			visitorList.items.forEach((arr, index) => {
				if (arr.head_img) { this.headerList.push(arr.head_img) } else { this.headerList.push(require('../../static/images/userimg.png')) }
			})
		},
		onAdd() {
			uni.addPhoneContact({
				organization: this.cardObj.company,
				firstName: this.cardObj.name,
				title: this.cardObj.job,
				email: this.cardObj.email,
				mobilePhoneNumber: this.cardObj.phone,
				weChatNumber: this.cardObj.wechat,
				remark: this.cardObj.address,
				success() {
					console.log('success')
				},
				fail() {
					console.log('fail')
				}
			})
		},
		onPhone() {
			uni.makePhoneCall({
				phoneNumber: this.cardObj.phone,
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
.index-container {
	min-height: 100vh;
	padding: 0 30rpx 120rpx;
	background-color: #fefefe;
	box-sizing: border-box;

	/deep/ .tui-nodata-box {
		padding-top: 60rpx;

		.tui-tips-content {
			color: #ffffff;
		}
	}

	/deep/ .tui-list-cell {
		border-bottom: 2rpx solid #cccccc;
	}
}
</style>

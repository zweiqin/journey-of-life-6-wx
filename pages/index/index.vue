<template>
	<view class="index-container">
		<TuanAppShim bg="transparent"></TuanAppShim>
		<view style="text-align: center;">
			<image
				src="../../static/images/new-user/default-user-avatar.png"
				style="width: 102rpx;height: 102rpx;border-radius: 50%;"
			></image>
		</view>
		<view style="padding-top: 30rpx;">
			<view v-if="electronicCardInfo.buyerId">
				<ATFCardDisplay
					:card-data="electronicCardInfo" :label-list="electronicLabelInfo"
					is-show-label introduction-pic-margin="14rpx -30rpx 0"
				></ATFCardDisplay>
				<view style="font-size: 28rpx;">
					<view
						style="display: flex;justify-content: space-between;align-items: center;padding-bottom: 20rpx;border-bottom: 2rpx solid #cccccc;"
					>
						<tui-button type="blue" width="280rpx" height="68rpx" margin="20rpx auto 0" open-type="share">
							分享名片
						</tui-button>
						<tui-button
							type="blue" width="280rpx" height="68rpx" margin="20rpx auto 0"
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
										:src="common.seamingImgUrl(electronicCardInfo.headImage) || headerImg"
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
											:src="common.seamingImgUrl(electronicCardInfo.enterpriseHeadImage) || headerImg"
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
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	name: 'Index',
	data() {
		return {
			showCount: 0,
			previousMargin: '0',
			nextMargin: '80rpx',
			headerImg: require('../../static/images/userimg.png')
		}
	},
	async onShow(options) {
		this.showCount = this.showCount + 1
		if (this.showCount > 1) {
			uni.showLoading()
			try {
				const data = await this.$store.dispatch('user/getElectronicCardAction')
				if (data.enterpriseUserId) await this.$store.dispatch('user/getElectronicLabelAction', { id: data.enterpriseUserId })
				uni.hideLoading()
			} catch (err) {
				console.log(err)
				uni.hideLoading()
			}
		}
	},
	onShareAppMessage(res) {
		if ((res.from === 'button') || (res.from === 'menu')) {
			console.log(res.target)
		}
		return {
			title: '您好，这是我的名片，望惠存',
			path: this.$store.getters.electronicCardInfo.buyerId
				? `/another-tf/another-user/calling-card/card-sharing?id=${this.$store.getters.electronicCardInfo.buyerId}`
				: '/pages/index/index',
			imageUrl: (this.$store.getters.electronicCardInfo.pictureIntroduction && this.$store.getters.electronicCardInfo.pictureIntroduction.split(',')[0]) || this.$store.getters.electronicCardInfo.headImage || ''
		}
	},
	computed: {
		...mapGetters(['electronicCardInfo', 'electronicLabelInfo'])
	},
	methods: {
	}
}
</script>

<style lang="less" scoped>
.index-container {
	min-height: 100vh;
	padding: 0 30rpx 120rpx;
	background-color: #fefefe;
	box-sizing: border-box;

	/deep/ .tui-list-cell {
		border-bottom: 2rpx solid #cccccc;
	}
}
</style>

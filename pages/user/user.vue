<template>
	<view class="user-page-container">
		<TuanAppShim bg="transparent"></TuanAppShim>
		<view
			style="position: relative;background: linear-gradient(138deg, #FFFCE7 13%, #F7EBDF 54%);background-size: cover;padding: 48rpx 32rpx 20rpx;"
		>
			<view style="display: flex;align-items: center;justify-content: space-between;margin-top: 38rpx;">
				<Avatar
					margin="0 32rpx 0 0" :size="49"
					:src="userInfo.token ? common.seamingImgUrl(userInfo.headImage) : require('../../static/images/new-user/default-user-avatar.png')"
				>
				</Avatar>

				<view style="flex: 1;">
					<view v-if="!userInfo.token">
						<view style="font-size: 28rpx;font-weight: bold;line-height: 42rpx;">您好!</view>
						<view style="font-size: 24rpx;line-height: 36rpx;margin-top: 6rpx;">
							您目前暂未登录，请<text style="color: #ffc117;" @click="go('/pages/login/login')">
								前往登录
							</text>
						</view>
					</view>

					<view v-else style="display: flex;justify-content: space-between;align-items: center;">
						<view style="color: #222229;">
							<view style="display: flex;align-items: flex-end;">
								<view style="margin-right: 12rpx;font-size: 34rpx;font-weight: bold;">
									{{ userInfo.name || userInfo.wechatName || '--' }}
								</view>
							</view>
							<view
								style="display: flex;align-items: center;align-items: center;box-sizing: border-box;margin-top: 12rpx;flex-wrap: wrap;font-size: 20rpx;"
							>
								<view style="padding: 6rpx 20rpx;margin-right: 16rpx;background-color: #ffffff;border-radius: 18rpx;">
									ID：{{ userInfo.buyerUserId }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="userInfo.token" style="margin-top: 44rpx;">
			<tui-button type="blue" plain :size="40" width="650rpx" height="88rpx" margin="0 auto" @click="handleQuit">
				退出登录
			</tui-button>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	name: 'User',
	onShow() {
		this.init()
	},
	data() {
		return {
		}
	},
	computed: {
		...mapGetters([ 'userInfo' ])
	},
	methods: {
		init() {
			// if (this.isLogin()) {
			this.$store.dispatch('auth/refrshUserInfoAction')
			// }
		},
		handleQuit() {
			this.$store.dispatch('auth/logoutAction', true)
		}
	}
}
</script>

<style lang="less" scoped>
.user-page-container {
	min-height: 100vh;
	padding: 0 0 120rpx;
	background-color: #fefefe;
	box-sizing: border-box;
}
</style>

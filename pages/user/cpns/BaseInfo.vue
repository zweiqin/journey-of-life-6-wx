<template>
	<view class="base-info-container">
		<!-- <view style="font-size: 36upx;font-weight: bold;color: #2A2B23;">个人中心</view> -->
		<view class="op-container">
			<view class="wrapper" @click="go('/another-tf/another-serve/messageCenter/index')">
				<tui-icon name="message" :size="60" unit="upx" color="##222229" margin="0"></tui-icon>
				<tui-badge
					v-show="$store.getters.userInfo.notRead" type="danger" right="-6rpx" absolute
					:scale-ratio="0.8"
					translate-x="38%" top="-6rpx"
				>
					{{ $store.getters.userInfo.notRead > 99 ? '99+' : $store.getters.userInfo.notRead }}
				</tui-badge>
			</view>
			<view class="wrapper" @click="go('/another-tf/another-serve/personalDetails/index')">
				<tui-icon name="setup" :size="60" unit="upx" color="##222229" margin="0"></tui-icon>
			</view>
		</view>

		<view class="user-info">
			<Avatar
				margin="0 12upx 0 0" :size="49"
				:src="$store.getters.userInfo.token ? common.seamingImgUrl($store.getters.userInfo.headImage) : require('../../../static/images/new-user/default-user-avatar.png')"
				@click="$store.getters.userInfo.token && go('/another-tf/another-serve/personalDetails/index')"
			></Avatar>

			<view class="right-wrapper">
				<view v-if="!$store.getters.userInfo.token">
					<view class="logout-title">您好!</view>
					<view class="logout-tip">您目前暂未登录，请<text @click="go('/pages/login/login')">前往登录</text></view>
				</view>

				<view v-else style="display: flex;justify-content: space-between;align-items: center;">
					<view style="color: #222229;" @click="go('/another-tf/another-serve/personalDetails/index')">
						<view
							style="display: flex;align-items: center;align-items: center;box-sizing: border-box;margin-top: 12upx;flex-wrap: wrap;font-size: 20upx;"
						>
							<!-- <view>成长值</view> -->
							<!-- {{ $store.getters.userInfo.growth || 0 }} / {{ $store.getters.userInfo.nextLevelGrowth || 0 }} -->
							<view style="padding: 6upx 20upx;margin-right: 16upx;background-color: #ffffff;border-radius: 18upx;">
								ID：{{ $store.getters.userInfo.buyerUserId }}
							</view>
							<view
								style="padding: 6upx 20upx;background-color: #ffffff;border-radius: 18upx;"
								@click.stop="go('/another-tf/another-user/user-upgrade/user-upgrade-application')"
							>
								<text>当前等级：</text>
								<text v-if="[1, 2].includes($store.getters.levelType)">普通会员</text>
								<text v-if="[3, 4].includes($store.getters.levelType)">团长</text>
								<text v-if="[ 5 ].includes($store.getters.levelType)">合伙人</text>
								<text style="margin-left: 4upx;">></text>
							</view>
						</view>
					</view>
					<view style="flex: 1;text-align: right;">
						<tui-button
							type="warning" width="128rpx" height="64upx" margin="0"
							shape="circle" :size="24"
							style="display: inline-block;background: linear-gradient(270deg, #FE4013 0%, #F86D3A 100%)!important;box-shadow: 0px 2px 2px 0px #FA6842,0px 5px 20px 0px rgba(250, 104, 66, 0.8);"
							@click="go('/another-tf/another-user/user-upgrade/user-upgrade-application')"
						>
							升级
						</tui-button>
					</view>
				</view>
			</view>
			<!-- 团长或合伙人才有 -->
			<!-- <view
				v-if="$store.getters.userInfo.token"
				style="text-align: center;" @click="$refs.codeCreateRef.getCode('teamMembersInvitation')"
				>
				<tui-icon name="qrcode" :size="24" color="#222229"></tui-icon>
				<view style="font-size: 24upx;color: #8f8d85;">
				<text>入驻码</text>
				</view>
				</view> -->
		</view>

		<view class="account-container">
			<view class="account-item" @click="go('/another-tf/another-user/platform-recharge/index')">
				<view class="account-number"> {{ $store.getters.pricePlatformInfo.totalPrice || 0 }} </view>
				<view class="account-title">余额</view>
			</view>

			<view class="account-item" @click="go('/user/sever/goldButler/gold-butler')">
				<view class="account-number">
					{{ isBuy ? 1 : 0 }}
				</view>
				<view class="account-title">家庭小卫士</view>
			</view>

			<!-- <view class="account-item" @click="go('/another-tf/another-serve/integral/index')">
				<view class="account-number">
				{{ $store.getters.userInfo.credit || 0 }}
				</view>
				<view class="account-title">积分</view>
				</view> -->

			<view class="account-item" @click="go('/another-tf/another-user/voucher/voucher')">
				<view class="account-number">
					{{ $store.getters.pricePlatformInfo.voucherPrice || 0 }}
				</view>
				<view class="account-title">代金劵</view>
			</view>
		</view>

		<tui-modal
			:show="$data._isShowTuiModel" title="提示" content="您还未登录，是否先去登录？"
			@click="_handleClickTuiModel($event, 'login', '/pages/user/user')"
		></tui-modal>

		<tui-modal :show="isShow" title="提示" content="您已开通家庭小卫士" @click="handleToVip"></tui-modal>
	</view>
</template>

<script>
import { userIsPurchaseApi } from '../../../api/user'
import { USER_ID } from '../../../constant'
import showModalMixin from 'mixin/showModal'
import { convertToDecimal } from '../../../utils'

export default {
	name: 'BaseInfo',
	data() {
		return {
			isBuy: false,
			isShow: false,
			isShowGloryFrame: false,
			frameType: ''
		}
	},
	mixins: [ showModalMixin() ],
	mounted() {
		console.log(this.$store.getters.userInfo)
		this.userIsPurchase()
	},
	methods: {
		convertToDecimal,
		handleToVip(e) {
			if (e.index) {
				uni.navigateTo({ url: '/user/sever/goldButler/gold-butler' })
			}
			this.isShow = false
		},

		// 查询用户是否购买过家庭小卫士套餐
		async userIsPurchase() {
			try {
				const userId = uni.getStorageSync(USER_ID)
				const res = await userIsPurchaseApi({
					userId,
					price: 399
				})
				if (res.statusCode === 20000) {
					if (res.data && Array.isArray(res.data) && res.data.length) {
						this.isBuy = true
					}
				} else {
					this.isBuy = false
				}
			} catch (error) {
				this.isBuy = false
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.rotation-box {
	position: absolute;
	top: -45vh;
	left: 50%;
	margin-left: -60vh;
	display: block;
	width: 120vh;
	height: 120vh;
	opacity: 0.4;
	background: repeating-conic-gradient(from 0deg, white 0deg 19deg, transparent 15deg 53deg);
	mask-image: radial-gradient(rgb(0, 0, 0), rgb(0, 0, 0) 50%);
	animation: rotate 20s linear infinite;
}

@keyframes rotate {
	to {
		transform: rotate(1turn)
	}
}

.base-info-container {
	position: relative;
	background: linear-gradient(138deg, #FFFCE7 13%, #F7EBDF 54%);
	background-size: cover;
	padding: 48upx 32upx 0upx;
	box-sizing: border-box;

	.op-container {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-top: 20upx;

		.wrapper {
			position: relative;

			&:nth-child(1) {
				margin-right: 24upx;
			}
		}
	}

	.user-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 38upx;

		/deep/ .avatar-container {
			image {
				border: 2upx solid #f1f1f0;
				background-color: #fff;
				box-sizing: border-box;
			}
		}

		.right-wrapper {
			flex: 1;

			.logout-title {
				font-size: 28upx;
				font-weight: bold;
				line-height: 42upx;
			}

			.logout-tip {
				font-size: 24upx;
				line-height: 36upx;
				margin-top: 6upx;

				text {
					color: #ffc117;
				}
			}
		}
	}

	.account-container {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 32upx;
		color: #222229;

		.account-item {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;

			.account-number {
				font-size: 42upx;
				font-weight: bold;
			}

			.account-title {
				margin-top: 10upx;
				font-size: 24upx;
			}
		}
	}
}
</style>

<template>
	<view class="bind-phone-container">
		<BeeBack>
			<view style="display: flex;align-items: center;justify-content: space-between;">
				<BeeIcon name="arrowleft" :size="34" color="#222229" style="width: fit-content;">
				</BeeIcon>
				<text style="flex: 1;margin-left: -40rpx;text-align: center;line-height: 2.5;">绑定手机号</text>
			</view>
		</BeeBack>
		<view class="loginInfo fs26 font-color-999">
			<p>共建真实、安全的交易环境</p>
			<p>本平台承诺不会滥用您授权的信息</p>
		</view>
		<view v-if="verifyType === 0" class="verifyTypeBox">
			<view class="verifyItem" @click="verifyType = 1">
				短信验证码
			</view>
			<view class="verifyItem verify-checked" @click="verifyType = 2">
				小程序授权
			</view>
		</view>
		<view v-else-if="verifyType === 1" class="phoneVerify">
			<view class="iphoneNum-box flex-row-plus flex-items">
				<tui-icon :size="50" color="#cccccc" name="mobile" unit="rpx" margin="0 30rpx 0 0"></tui-icon>
				<view>
					<input v-model="phone" maxlength="11" type="number" placeholder="请输入您的手机号" />
				</view>
			</view>
			<view class="mar-top-20">
				<view class="code-box">
					<tui-icon :size="50" color="#cccccc" name="shield" unit="rpx" margin="0 30rpx 0 0"></tui-icon>
					<tui-input
						v-model="code" padding="26rpx 20rpx 26rpx 0" background-color="transparent" label-color="#ffffff"
						placeholder="请输入验证码" style="flex: 1;border-bottom: 2rpx solid #ffffff;"
					>
						<template #right>
							<tui-countdown-verify
								ref="refBindPhoneVerify" width="188rpx" height="48rpx" border-width="0"
								text="获取验证码"
								:size="30" color="#dddddd" @send="handleSendVerify"
							></tui-countdown-verify>
						</template>
					</tui-input>
				</view>
			</view>

			<view class="mar-top-60">
				<view
					class="registerBut mar-top-100" :class="{ bindCls: (phone !== '') && (code !== '') }"
					@click="handleBindPhone"
				>
					确认
				</view>
			</view>
		</view>
		<view v-else-if="verifyType === 2" class="mpVerify">
			<button
				v-if="[ 4 ].includes($store.state.app.terminal)" class="verifyPhone" open-type="getAuthorize"
				scope="phoneNumber" @getAuthorize="onGetAuthorize" @error="() => { }"
			>
				授权手机号验证
			</button>

			<button
				v-if="[ 2 ].includes($store.state.app.terminal)" class="verifyPhone fs28 mar-top-100"
				open-type="getPhoneNumber" @getphonenumber="getWxPhoneNumber"
			>
				微信手机号授权
			</button>
		</view>
		<view v-if="(verifyType !== 0) && [2, 4].includes($store.state.app.terminal)" class="backBtn" @click="verifyType = 0">
			返回
		</view>
	</view>
</template>

<script>
import { getVerifyCodeApi, updateAliPhoneAppApi, getSessionKeyAppApi, updateSetWxPhoneAppApi, updateWxPhoneAppApi } from '../../../api/anotherTFInterface'
export default {
	name: 'BindPhone',
	data() {
		return {
			phone: '',
			code: '',
			wechatOpenId: '',
			headImage: '',
			wechatName: '',
			verifyType: 0,
			buyerUserId: 0
		}
	},
	onLoad(options) {
		this.wechatOpenId = options.wechatOpenId
		this.headImage = options.headImage
		this.wechatName = options.wechatName
		this.buyerUserId = options.buyerUserId
		if (![2, 4].includes(this.$store.state.app.terminal)) this.verifyType = 1
	},
	methods: {
		// 获取验证码
		handleSendVerify() {
			if (!this.phone) {
				this.$refs.refBindPhoneVerify.reset()
				return this.$showToast('请填写手机号')
			}
			if (!/^1[3-9]\d{9}$/.test(this.phone)) {
				this.$refs.refBindPhoneVerify.reset()
				return this.$showToast('请输入正确的手机号')
			}
			getVerifyCodeApi({ phone: this.phone })
				.then((res) => {
					this.$refs.refBindPhoneVerify.success()
					this.$showToast('发送成功，请注意查看手机短信')
				})
				.catch(() => {
					this.$refs.refBindPhoneVerify.reset()
				})
		},

		handleBindPhone() {
			if ([ 4 ].includes(this.$store.state.app.terminal)) {
				this.updateAliPhone(this.phone, false)
			} else if ([2, 3].includes(this.$store.state.app.terminal)) {
				this.updateWxPhone()
			}
		},

		updateWxPhone() {
			updateWxPhoneAppApi({
				phone: this.phone,
				wechatOpenId: this.wechatOpenId,
				headImage: this.headImage,
				wechatName: this.wechatName,
				verificationCode: this.code,
				channelCode: '',
				terminal: 3
			}).then((res) => {
				this.$showToast('绑定成功')
				this.$store.dispatch('auth/LoginAfterAction', { type: 'wx', data: res.data })
			})
		},

		getWxPhoneNumber(e) {
			if (e.detail.errMsg === 'getPhoneNumber:ok') {
				uni.login({
					provider: 'weixin',
					success: (res) => {
						getSessionKeyAppApi({
							code: res.code
						}).then((result) => {
							updateSetWxPhoneAppApi({
								wechatOpenId: result.data.wechatOpenId,
								sessionKey: result.data.sessionKey,
								encryptedData: e.detail.encryptedData,
								iv: e.detail.iv,
								headImage: this.headImage,
								wechatName: this.wechatName
							}).then((res) => {
								this.$showToast('绑定成功')
								this.$store.dispatch('auth/LoginAfterAction', { type: 'wx', data: res.data })
							})
						})
					},
					fail: () => {
						this.$showToast('微信登录授权失败')
					}
				})
			} else {
				this.$showToast('获取手机授权失败')
			}
		},
		onGetAuthorize() {
			const that = this
			uni.showLoading({
				mask: true,
				title: '验证中...'
			})
			my.getPhoneNumber({
				success: (res) => {
					uni.hideLoading()
					that.updateAliPhone(res.response, true)
				},
				fail: (res) => {
					uni.hideLoading()
					this.$showToast('验证失败')
				}
			})
		},
		updateAliPhone(encryptedData, encrypted) {
			uni.showLoading()
			updateAliPhoneAppApi({
				'phone': encryptedData,
				'buyerUserId': this.buyerUserId,
				encrypted
			}).then((res) => {
				uni.hideLoading()
				this.$showToast('绑定成功')
				this.$store.dispatch('auth/LoginAfterAction', { type: 'alipay', data: res.data })
			})
				.catch((e) => {
					uni.hideLoading()
				})
		}
	}
}
</script>

<style lang="less" scoped>
.bind-phone-container {
	min-height: 100vh;
	box-sizing: border-box;

	.loginInfo {
		margin: 130rpx 0 50rpx 0;
		text-align: center;
	}

	.verifyTypeBox {
		width: 98%;

		.verifyItem {
			width: 80%;
			display: block;
			text-align: center;
			border: 2rpx solid #F3F4F5;
			padding: 30rpx;
			font-size: 34rpx;
			margin: 0 auto 30rpx auto;
			color: #C5AA7B;
		}

		.verify-checked {
			color: white;
			background: #C5AA7B;
		}
	}

	.phoneVerify {
		padding: 20rpx 30rpx;

		.iphoneNum-box {
			border-bottom: 1rpx solid #DDDDDD;
		}

		.code-box {
			border-bottom: 1rpx solid #DDDDDD;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}

		.registerBut {
			background: #F3F4F5;
			color: #999999;
			height: 100rpx;
			width: 600rpx;
			text-align: center;
			line-height: 100rpx;
			margin: 30rpx auto;
		}

		.bindCls {
			background: #333333;
			color: #F5DEB2;
		}
	}

	.mpVerify {
		height: 300rpx;

		.verifyPhone {
			background: #333333;
			color: #FFEBC4;
			height: 100rpx;
			width: 600rpx;
			text-align: center;
			line-height: 100rpx;
			margin-top: 88rpx;
			border-radius: 0;
		}
	}

	.backBtn {
		color: #C5AA7B;
		text-align: center;
		text-decoration: underline;
	}
}
</style>

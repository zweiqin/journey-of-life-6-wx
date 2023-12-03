<template>
	<view class="container">
		<view style="padding: 68upx 0 0 56upx;color: #ffffff;">
			<view style="font-weight: bold;font-style: oblique;">
				<view style="font-size: 58upx;">欢迎来到</view>
				<view style="font-size: 62upx;">巨蜂本地生活</view>
			</view>
			<view style="margin-top: 12upx;;font-size: 30upx;">
				<text>数字化营销的领跑者</text>
			</view>
		</view>

		<view style="display: flex;flex-direction: column;justify-content: center;align-items: center;margin-top: 80upx;">
			<view
				v-if="(loginForm.terminal === 3) || (loginForm.terminal === 2)" style="text-align: center;"
				@click="handleWXLogin"
			>
				<image style="width: 118upx;height: 98upx;" src="../../static/images/icon/we-chat.png" mode="" />
				<tui-button type="white" width="480rpx" height="82rpx" margin="40upx 0 0" shape="circle" @click="handleWXLogin">
					微信一键登录
				</tui-button>
			</view>
			<!-- #ifdef MP-ALIPAY -->
			<tui-button type="danger" width="480rpx" height="82rpx" margin="70upx 0 0" shape="circle">
				支付宝登录
			</tui-button>
			<!-- #endif -->
			<tui-button
				type="white" width="480rpx" height="82rpx" margin="70upx 0 0"
				shape="circle"
				@click="$switchTab('/pages/index/index')"
			>
				去首页逛逛
			</tui-button>
		</view>

		<view class="otherLoginButton">
			<view class="orderButtonItem">
				<view style="display: flex;flex-direction: column;align-items: center;">
					<view style="width: fit-content;padding: 12upx;background-color: #ffffff;border-radius: 48upx;">
						<tui-icon name="pwd" color="#ce2601" :size="24" @click="go('/pages/login/accountLogin')"></tui-icon>
					</view>
					<view style="margin-top: 12upx;font-size: 26upx;color: #ffffff;">密码登录</view>
				</view>
				<view style="display: flex;flex-direction: column;align-items: center;">
					<view style="width: fit-content;padding: 12upx;background-color: #ffffff;border-radius: 48upx;">
						<tui-icon
							name="wealth-fill" color="#ce2601" :size="24"
							@click="$redirectTo('/pages/register/register?type=register')"
						></tui-icon>
					</view>
					<view style="margin-top: 12upx;font-size: 26upx;color: #ffffff;">注册</view>
				</view>
				<view style="display: flex;flex-direction: column;align-items: center;">
					<view style="width: fit-content;padding: 12upx;background-color: #ffffff;border-radius: 48upx;">
						<tui-icon
							name="mail-fill" color="#ce2601" :size="24"
							@click="$redirectTo('/pages/register/register?type=forgetPwd')"
						></tui-icon>
					</view>
					<view style="margin-top: 12upx;font-size: 26upx;color: #ffffff;">找回密码</view>
				</view>
			</view>
		</view>
		<view class="agreement">
			登录即同意<text class="colorText">《联通统一认证服务条款》</text>和<text class="colorText">《巨蜂商城用户 服务协议》</text>、<text
				class="colorText"
			>
				《隐私政策》
			</text>并使用本机号码登陆
		</view>
	</view>
</template>

<script>
import { userLoginApi, wxLoginApi, updateNotBindingWxPhone } from '../../api/auth'
import {
	J_USER_INFO,
	J_USER_TOKEN,
	J_TOKEN_EXPIRE,
	J_USER_ID,
	J_BRAND_ID,
	J_NEW_BIND_TYPE
} from '../../constant'
import { getUrlCode, isInWx } from '../../utils'
export default {
	name: 'Login',
	data() {
		return {
			type: '',
			redirect: '',
			loginForm: {
				username: '',
				password: '',
				terminal: ''
			}
		}
	},
	onLoad(options) {
		if (isInWx()) {
			this.loginForm.terminal = 3
		} else {
			// #ifdef H5
			this.loginForm.terminal = 5 // H5包含pc和移动端浏览器和微信浏览器的可能
			// #endif
			// #ifdef APP
			this.loginForm.terminal = 1
			// #endif
			// #ifdef MP-WEIXIN
			this.loginForm.terminal = 2
			// #endif
			// #ifdef MP-ALIPAY
			this.loginForm.terminal = 4
			// #endif
		}
		this.type = options.type
		this.redirect = options.redirect
		if (this.type === 'register') {
			this.$showToast('注册成功', 'success')
		} else if (uni.getStorageSync(J_NEW_BIND_TYPE)) {
			if (uni.getStorageSync(J_USER_ID) && uni.getStorageSync(J_USER_INFO)) {
				uni.redirectTo({ url: '/pages/jump/jump' })
			}
		} else if (this.type === 'forget') {
			this.$showToast('密码重置成功', 'success')
		}
	},
	onShow() {
		// #ifdef H5
		const code = getUrlCode().code
		if (code) this.handleWXLogin()
		// #endif
	},

	methods: {
		handleLogin() {
			const { username, password } = this.loginForm
			if (!username || !password) {
				this.$showToast('手机号或密码不能为空')
				return
			}
			if (
				!/^1[3456789]\d{9}$/.test(username)
			) {
				uni.showToast({
					title: '手机号格式不正确',
					duration: 2000,
					icon: 'none'
				})
				return
			}
			if (password.length < 6) {
				this.$showToast('密码不能小于六位')
				return
			}
			userLoginApi({
				...this.loginForm
			}).then((res) => {
				uni.setStorageSync(J_USER_INFO, res.data.userInfo)
				uni.setStorageSync(J_USER_TOKEN, res.data.token)
				uni.setStorageSync(J_USER_ID, res.data.userInfo.userId)
				uni.setStorageSync(J_BRAND_ID, res.data.userInfo.brandId)
				uni.setStorageSync(J_TOKEN_EXPIRE, new Date(res.data.tokenExpire).getTime())
				this.$parent.$root.connectSocket()
				this.$showToast('登录成功', 'success')
				this.handleLoginSuccess()
			})
		},

		// 点击微信登录
		async handleWXLogin() {
			// #ifdef H5
			const appid = 'wx603b04a561e4683e'
			const local = 'https://h5.jfcmei.com/#/pages/login/login'
			const code = getUrlCode().code
			// console.log('获取code', code)
			if (code === null || code === undefined || code === '') {
				window.location.href =
					'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
					appid +
					'&redirect_uri=' +
					encodeURIComponent(local) +
					'&response_type=code&scope=snsapi_userinfo#wechat_redirect'
			} else {
				const { data } = await wxLoginApi({ code })
				console.log(data) // {token,status,userInfo}
				uni.setStorageSync(J_USER_ID, data.userInfo.userId)
				uni.setStorageSync(J_USER_INFO, data.userInfo)
				uni.setStorageSync(J_USER_TOKEN, data.token)
				this.$parent.$root.connectSocket()
				// ofxYi6eg9rdj8qZx3rwSecysgePo
				if (!data.status) {
					uni.showModal({
						title: '提示',
						content: '您还未绑定手机号，请先绑定',
						success: ({ confirm }) => {
							if (confirm) {
								uni.navigateTo({
									url: '/pages/login/bind-phone?openId=' + data.userInfo.openId
								})
							} else {
								uni.showLoading()
								updateNotBindingWxPhone({
									// openId: data.userInfo.openId,
									// nickname: data.userInfo.nickname,
									// sex: data.userInfo.gender,
									// headimgurl: data.userInfo.avatarUrl,
									// unionid: data.userInfo.unionid
									...data.userInfo
								})
									.then((res) => {
										uni.hideLoading()
										this.$showToast('正在跳转...')
										this.handleLoginSuccess('WX')
									})
									.catch(() => {
										uni.removeStorageSync(J_USER_ID, data.userInfo.userId)
										uni.removeStorageSync(J_USER_INFO, data.userInfo)
										uni.removeStorageSync(J_USER_TOKEN, data.token)
										uni.hideLoading()
									})
							}
						}
					})
				} else {
					this.$showToast('登录成功', 'success')
					this.handleLoginSuccess('WX')
				}
			}
			// #endif
		},

		handleLoginSuccess(type) {
			if (type === 'WX') {
				setTimeout(() => {
					if (uni.getStorageSync(J_NEW_BIND_TYPE)) {
						window.location.replace('https://h5.jfcmei.com/#/pages/jump/jump')
					} else if (this.redirect) {
						window.location.replace(`https://h5.jfcmei.com/#${this.redirect}`)
					} else {
						window.location.replace('https://h5.jfcmei.com/#/pages/store/store')
					}
				}, 2000)
			} else {
				setTimeout(() => {
					if (uni.getStorageSync(J_NEW_BIND_TYPE)) {
						uni.redirectTo({ url: '/pages/jump/jump' })
					} else if (this.redirect) {
						uni.redirectTo({
							url: this.redirect
						})
					} else {
						this.$switchTab('/pages/store/store')
					}
				}, 2000)
			}
		}
	}
}
</script>

<style lang="less" scoped>
.container {
	background-color: #b9452b;
	min-height: 100vh;

	.otherLoginButton {
		margin-top: 195rpx;
		display: flex;
		flex-direction: column;
		align-items: center;

		.orderButtonItem {
			display: flex;
			justify-content: space-around;
			white-space: nowrap;

			&>view:not(:first-child) {
				padding-left: 48upx;
			}
		}
	}

	.agreement {
		margin-top: 120rpx;
		padding: 75upx;
		font-size: 24rpx;
		text-align: center;
		color: #000000;

		.colorText {
			color: #faf9f9;
		}
	}
}
</style>

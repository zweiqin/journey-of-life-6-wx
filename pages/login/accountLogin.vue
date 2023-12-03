<template>
	<view class="container flex-column">
		<view style="padding: 30upx 20upx 0;color: #000000;">
			<JHeader width="50" height="50" title=""></JHeader>
		</view>
		<view class="register" @click="handleClickRegister">
			注册
		</view>
		<view class="PhoneAuthentication">
			<text class="textRL">手机号快捷登录</text>
			<text class="textTips">请先注册账号再登录</text>
		</view>
		<view class="LoginForm">
			<view class="iphoneNum-box">
				<text class="labels">手机号</text>
				<input v-model="loginForm.username" type="text" placeholder="请输入手机号">
			</view>
			<view class="iphoneNum-box">
				<text class="labels">密码</text>
				<input v-model="loginForm.password" password type="text" placeholder="请输入密码">
			</view>
			<view class="ReadingAgreement">
				<radio
					style="transform:scale(0.8)" color="#CE2601" :checked="isReadAgreement"
					@click="isReadAgreement = !isReadAgreement"
				/>
				<view class="Agreement">
					我已阅读并同意<text class="redText">《巨蜂商城用户服务协议》</text>以及<text class="redText">《隐私政策》</text>
				</view>
			</view>
		</view>
		<tui-button
			:disabled="!isReadAgreement" type="danger" width="650rpx" margin="0 auto"
			height="82rpx"
			style="margin-top: 60rpx;" @click="handleLogin"
		>
			立即登录
		</tui-button>
		<view class="problem">
			<text @click="handleClickRegister">没有账号？<text class="redText">去注册</text></text>
			<text>无法接收验证码？</text>
		</view>
	</view>
</template>

<script>
import { userLoginApi } from '../../api/auth'
import {
	J_USER_INFO,
	J_USER_TOKEN,
	J_TOKEN_EXPIRE,
	J_USER_ID,
	J_BRAND_ID,
	J_NEW_BIND_TYPE
} from '../../constant'
export default {
	name: 'Login',
	data() {
		return {
			redirect: '',
			loginForm: {
				username: '',
				password: ''
			},
			isReadAgreement: false
		}
	},
	onLoad(options) {
		this.redirect = options.redirect
	},

	methods: {
		handleClickRegister() {
			uni.reLaunch({ url: '/pages/register/register?type=register' })
		},
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
			})
		}
	}
}
</script>

<style lang="less" scoped>
.container {
	box-sizing: border-box;
	background-color: #FFFFFF;

	.redText {
		color: #CE2601;
	}

	.register {
		margin-top: 30rpx;
		position: relative;
		text-align: right;
		padding-right: 40rpx;
	}

	.PhoneAuthentication {
		margin-top: 15rpx;
		font-family: Source Han Sans CN;
		width: 466rpx;
		height: 100rpx;
		display: flex;
		flex-direction: column;
		padding: 0px 30rpx;
		gap: 8rpx;

		.textRL {
			font-size: 44rpx;
			font-weight: 600;
			line-height: 60rpx;
			color: #222229;
		}

		.textTips {
			font-size: 24rpx;
			font-weight: 350;
			line-height: 32rpx;
			color: #888889;
		}
	}

	.LoginForm {
		margin-top: 50rpx;
		width: 750rpx;

		.iphoneNum-box {
			/* 自动布局 */
			margin: 0 auto;
			height: 114rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 32rpx;
			border-bottom: 2rpx solid #E6E6E8;
			width: 690rpx;
			color: #222229;

			.labels {
				font-size: 32rpx;
				font-weight: normal;
				line-height: 48rpx;
			}
		}

		.ReadingAgreement {
			width: 710rpx;
			margin: 0 auto;
			margin-top: 33rpx;
			gap: 32rpx;
			display: flex;
			align-items: center;
			font-size: 24rpx;

			.Agreement {
				margin-left: -15rpx;
			}
		}
	}

	.problem {
		margin: 0 auto;
		margin-top: 30rpx;
		width: 654rpx;
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		font-weight: 350;
		line-height: 32rpx;
		color: #878788;
	}
}
</style>

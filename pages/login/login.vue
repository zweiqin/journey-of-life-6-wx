<template>
	<view>
		<view class="login-main">
			<image class="user" src="../../static/images/userimg.png"></image>
			<view class="name">您好 </view>
			<view class="tip">为了您的最佳体验，请登录</view>
		</view>

		<button class="lgin-btn" open-type="getUserInfo" lang="zh_CN" withCredentials="true" @getuserinfo="mpWxLogin">
			<view class="text">微信一键登录</view>
		</button>
	</view>
</template>

<script>
import { USER_INFO } from '../../constant'
export default {
	name: 'Login',
	data() {
		return {
		}
	},
	methods: {
		async mpWxLogin(userInfoData) {
			console.log('登陆')
			await this.mpWxGetUserInfo(userInfoData)
			this.$showToast('登陆成功')
			uni.navigateTo({
				url: '/pages/index'
			})
		},
		// 获取用户信息
		async mpWxGetUserInfo(userInfoData) {
			return new Promise(async (resolve, reject) => {
				if (!userInfoData.detail.userInfo) {
					reject(new Error('未拿到用户信息'))
				}
				try {
					uni.showLoading({
						mask: true,
						title: '请稍候...'
					})
					const [loginErr, loginData] = await uni.login({ provider: 'weixin' })
					const [err, userData] = await uni.getUserInfo()
					const res = await request('uni-card', 'loginByWx', {
						code: loginData.code,
						encryptedData: userData.encryptedData,
						iv: userData.iv
					}, {
						showLoading: true
					})
					console.log('res', res)
					uni.hideLoading()
					resolve(res)
				} catch (e) {
					uni.hideLoading()
					reject(e)
				}
			}).then(async (userInfo) => {
				this.$store.dispatch('setUserData', userInfo)
				await uni.setStorageSync(USER_INFO, userInfo)
				return userInfo
			})
		}
	}
}
</script>

<style>
	page {
		background: #fff;
	}
</style>

<style scoped>
	.login-main {
		width: 100%;
		padding-top: 200rpx;
	}

	.login-main .user {
		width: 180rpx;
		height: 180rpx;
		margin: 0 auto;
		display: block;
	}

	.login-main .name {
		text-align: center;
		font-size: 40rpx;
	}

	.login-main .name text {
		padding: 0 0 0 20rpx;
	}

	.login-main .tip {
		color: #999;
		padding: .9em 0;
		text-align: center;
		padding-bottom: 50rpx;
	}

	.lgin-btn {
		width: 80%;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #DBA871;
		border-radius: 10rpx;
		padding: 15rpx 0;
	}

	.lgin-btn image {
		width: 50rpx;
		height: 50rpx;
		display: block;
	}

	.lgin-btn .text {
		color: #fff;
		font-size: 32rpx;
		padding-left: 10rpx;
	}

	.lgin-tip {
		color: #DBA871;
		text-align: center;
		padding: 20rpx 0;
		font-size: 28rpx;
	}
</style>

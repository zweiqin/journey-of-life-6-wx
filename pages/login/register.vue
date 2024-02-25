<template>
	<view class="register-container">
		<JHeader title="" width="50" height="50" style="padding: 24rpx 0 0;"></JHeader>
		<view class="titleBox">
			<p class="bigTitle">填写注册信息</p>
			<p class="tips">请仔细填写以下信息，以免后期登陆异常</p>
		</view>
		<view class="formBox">
			<tui-form ref="form" :show-message="false">
				<view class="formItem">
					<tui-input
						v-model="registerQuery.phone" placeholder-class="inputs" border-color="#EA5B1D"
						placeholder="请输入电话号码" :border-top="false" color="#222229" clearable
						size="34"
					></tui-input>
				</view>
				<view class="formItem">
					<tui-input
						v-model="registerQuery.verificationCode" padding="26rpx 20rpx 26rpx 0"
						placeholder-style="color: #f3c1c4;font-size: 32rpx;" background-color="transparent" :border-top="false"
						border-color="#EA5B1D" label-color="#ffffff" placeholder="请输入验证码" color="#222229"
					>
						<template #right>
							<tui-countdown-verify
								ref="refRegisterVerify" width="188rpx" height="48rpx" border-width="0"
								text="获取验证码"
								:size="30" color="#EF530E" @send="handleSendVerify"
							></tui-countdown-verify>
						</template>
					</tui-input>
				</view>
				<view class="formItem">
					<tui-input
						v-model="registerQuery.password" placeholder-class="inputs" type="password"
						border-color="#EA5B1D" placeholder="请输入密码" :border-top="false" color="#222229"
						clearable
						size="34"
					></tui-input>
				</view>
				<view class="formItem">
					<tui-input
						v-model="registerQuery.passwordAgain" placeholder-class="inputs" type="password"
						border-color="#EA5B1D" placeholder="请再次确认密码" :border-top="false" color="#222229"
						clearable
						size="34"
					></tui-input>
				</view>
			</tui-form>
			<view class="tips">密码长度8-16位,必须同时含有字母和数字</view>
		</view>
		<button
			class="loginBtn"
			:class="{ disbleds: !!(registerQuery.password && registerQuery.passwordAgain && registerQuery.phone && registerQuery.verificationCode) }"
			@click="addAcount"
		>
			确定
		</button>
		<view class="agreement">
			登录即代表你已阅读并同意<text style="color: #222229;">《用户服务协议》</text>
		</view>
		<tui-toast ref="toast"></tui-toast>
		<tui-modal :show="hasRegister" custom fade-i :button="[]" @cancel="hasRegister = false">
			<view style="padding: 28rpx 0;text-align: center;">
				<image style="width: 240rpx;height: 144rpx;" src="../../static/images/icon/acount.png"></image>
				<view
					style="margin-top: 46rpx;font-size: 36rpx;font-weight: normal;line-height: 52rpx;text-align: center;color: #222229;"
				>
					注册完成
				</view>
				<view
					style="margin-top: 18rpx;font-size: 28fpx;font-weight: 350;line-height: 40fpx;text-align: center;color: #888889;"
				>
					您已完成注册，请前往首页
				</view>
				<button
					style="width: 484rpx;height: 80rpx;border-radius: 8rpx;background: #EF530E;color: #fff;line-height: 80rpx;margin-top: 80rpx;"
					@click="$switchTab('/pages/index/index')"
				>
					立即跳转
				</button>
			</view>
		</tui-modal>
	</view>
</template>

<script>
import { updatePhoneLoginRegisterApi, getVerifyCodeApi } from '../../api/anotherTFInterface'

export default {
	name: 'Register',
	data() {
		return {
			registerQuery: {
				password: '',
				passwordAgain: '',
				phone: '',
				verificationCode: ''
			},
			hasRegister: false
		}
	},
	methods: {
		// 获取验证码
		handleSendVerify() {
			if (!this.registerQuery.phone) {
				this.$refs.refRegisterVerify.reset()
				return this.$showToast('请填写手机号')
			}
			if (!/^1[3-9]\d{9}$/.test(this.registerQuery.phone)) {
				this.$refs.refRegisterVerify.reset()
				return this.$showToast('请输入正确的手机号')
			}
			getVerifyCodeApi({ phone: this.registerQuery.phone })
				.then((res) => {
					this.$refs.refRegisterVerify.success()
					this.$showToast('发送成功，请注意查看手机短信')
				})
				.catch(() => {
					this.$refs.refRegisterVerify.reset()
				})
		},

		addAcount() {
			this.$refs.form.validate(this.registerQuery, [
				{
					name: 'phone',
					rule: ['required', 'isMobile'],
					msg: ['请输入手机号', '请输入正确的手机号']
				},
				{
					name: 'verificationCode',
					rule: [ 'required' ],
					msg: [ '请输入验证码' ]
				},
				{
					name: 'password',
					rule: ['required', 'isEnAndNo'],
					msg: ['请输入密码', '密码为8~20位英文和数字组合']
				},
				{
					name: 'passwordAgain',
					rule: ['required', 'isSame:password'],
					msg: ['请再次确认密码', '两次密码不一致']
				}
			])
				.then(() => {
					updatePhoneLoginRegisterApi({
						type: 1,
						phone: this.registerQuery.phone,
						verificationCode: this.registerQuery.verificationCode,
						password: this.registerQuery.password
					}).then((res) => {
						this.$store.dispatch('auth/LoginAfterAction', { type: 'phone', data: res.data })
						this.hasRegister = true
					})
				})
				.catch((e) => {
					this.$showToast(JSON.stringify(e.errorMsg))
				})
		}
	}
}
</script>

<style lang="less" scoped>
.register-container {
	position: relative;
	min-height: 100vh;
	box-sizing: border-box;

	.disbleds {
		background-color: #EF530E !important;
	}

	.titleBox {
		width: 100vw;
		box-sizing: border-box;
		padding: 64rpx;

		.bigTitle {
			font-family: Source Han Sans;
			font-size: 64rpx;
			font-weight: normal;
			line-height: 90rpx;
			color: #303030;
		}

		.tips {
			font-family: Source Han Sans;
			font-size: 28rpx;
			font-weight: normal;
			line-height: 40rpx;
			color: #303030;
		}
	}

	.formBox {
		width: 100vw;
		box-sizing: border-box;
		padding: 0rpx 40rpx;

		.formItem {
			height: 120rpx;
		}

		.tips {
			margin-left: 26rpx;
			font-family: Source Han Sans;
			font-size: 24rpx;
			font-weight: normal;
			line-height: 32rpx;
			color: #646466;
		}
	}

	.loginBtn {
		margin-top: 64rpx;
		width: 622rpx;
		height: 96rpx;
		border-radius: 16rpx;
		background: #C6C7CB;
		color: #FFFFFF;
		font-size: 32rpx;
	}

	.agreement {
		position: absolute;
		bottom: 48rpx;
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;
		font-size: 28rx;
		font-weight: 350;
		line-height: 36rpx;
		text-align: center;
		letter-spacing: 0rpx;
		color: #888889;
	}
}
</style>

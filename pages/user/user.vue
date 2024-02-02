<template>
	<view class="user-page-container">
		<TuanAppShim bg="#f6eadf"></TuanAppShim>
		<BaseInfo ref="baseInfoRef" @handleNavigate="handleNavigate"></BaseInfo>
		<view class="main-area">
			111
		</view>
		<tui-modal
			:show="$data._isShowTuiModel" title="提示" content="您还未登录，是否先去登录？"
			@click="_handleClickTuiModel($event, 'login', '/pages/user/user')"
		></tui-modal>

		<TuanChatKF ref="tuanChatKFRef"></TuanChatKF>
		<tui-toast ref="toast"></tui-toast>

		<!-- 特殊code的 menu 操作 -->
		<CodeCreatePopup ref="codeCreateRef"></CodeCreatePopup>

		<!-- 参与抽奖输入暗语 -->
		<tui-dialog
			style="position: relative;z-index: 888;" :buttons="[{ text: '取消' }, { text: '确定', color: '#586c94' }]"
			:show="isShowLotteryDialog" title="暗语" @click="handleLotteryDialog"
		>
			<template #content>
				<tui-input v-model="codeWordLottery" label="" type="text" placeholder="请输入抽奖暗语"></tui-input>
			</template>
		</tui-dialog>
	</view>
</template>

<script>
// import { getStorageKeyToken, jumpToOtherProject } from '../../utils'
// import BaseInfo from './cpns/BaseInfo'
// import Pane from './cpns/Pane.vue'
// import showModalMixin from '../../mixin/showModal'
// import { T_STORAGE_KEY } from '../../constant'
// import { myFunction, myServe, additionalFunction, shopServe, myPreferential, otherFunction } from './data'
// import { Encrypt } from '../../utils/secret'

export default {
	name: 'User',
	components: {
		BaseInfo,
		Pane
	},
	// mixins: [ showModalMixin() ],
	onShow() {
		this.init()
	},
	data() {
		return {
			timer: null,
			myFunction,
			myServe,
			shopServe,
			additionalFunction,
			myPreferential,
			otherFunction,
			isShowOther: false,
			userInfo: {},
			bindingCode: '',

			// 参与抽奖
			isShowLotteryDialog: false,
			codeWordLottery: ''
		}
	},
	methods: {
		init() {
			this.userInfo = uni.getStorageSync(T_STORAGE_KEY) || {}
			if (this.isLogin()) {
				this.$refs.baseInfoRef && this.$refs.baseInfoRef.userIsPurchase()
				this.$store.dispatch('auth/refrshUserInfoAction')
				this.$store.dispatch('user/count')
			}
			this.$forceUpdate()
		},
		handleNavigate(item, cb) {
			// if (['/user/sever/customer-service/customer-service', '/user/sever/chat/chat'].includes(item.url)) {
			//   this.$refs.tuanChatKFRef.show();
			//   return;
			// }
			if (item.navigate) {
				item.navigate()
				return
			}
			if (item.type === 'external') {
				this.go('/user/view?target=' + item.url)
				return
			}
			if (this.isLogin()) {
				if (item.type === 'participateLottery') {
					this.isShowLotteryDialog = true
					return
				} else if (item.type === 'userInvitation') {
					if (this.$store.state.auth.identityInfo.type.includes(1)) {
						uni.showActionSheet({
							title: '* 请选择业务 *',
							itemList: ['关系链绑定', '绑定加盟商'],
							itemColor: '#2c3e50',
							success: (res) => {
								if (res.tapIndex === 0) {
									this.go('/another-tf/another-user/user-invitation/index')
								} else if (res.tapIndex === 1) {
									this.$refs.codeCreateRef.getCode('franchiseeInvitation')
								}
							}
						})
					} else {
						this.go('/another-tf/another-user/user-invitation/index')
					}
					return
				} else if (item.type === 'flyToService') {
					// this.$store.dispatch('app/getCustomerServiceAction', { isToService: true })
					this.go('/another-tf/another-user/chat/chat-detail?chat=serviceAssistant')
					return
				} else if (item.type === 'settle') {
					const storageKeyToken = getStorageKeyToken()
					if (storageKeyToken) {
						jumpToOtherProject(`${item.url}/#/?username=${this.userInfo.name}&user=${Encrypt(storageKeyToken)}`)
					}
					return
				} else if (item.type === 'shopInvitation') {
					this.$refs.codeCreateRef.getCode('shopInvitation')
					return
				}
				if (!item.url) {
					this.empty()
					return
				}
				if (cb && typeof cb === 'function' && cb()) {
					uni.navigateTo({
						url: item.url
					})
				} else {
					uni.navigateTo({
						url: item.url
					})
				}
			} else {
				this.$data._isShowTuiModel = true
			}
		},
		handleLotteryDialog(e) {
			if (e.index === 0) { } else if (e.index === 1) {
				if (!(this.codeWordLottery === '新年快乐')) return this.$showToast('暗语错误')
				this.go(`/pages/jump/jump?userId=${this.userInfo.buyerUserId}&type=participateLottery&code=`)
			}
			this.codeWordLottery = ''
			this.isShowLotteryDialog = false
		}
	}
}
</script>

<style lang="less" scoped>
.user-page-container {
	widows: 100vw;
	min-height: 100vh;
	background-color: #f6f6f5;
	padding-bottom: 120upx;

	.main-area {
		width: 100%;
		padding: 0 32upx 32upx;
		box-sizing: border-box;

		/deep/ .menu-title {
			font-size: 24upx;
			color: #3a3629;
		}

		/deep/ .menu-icon {
			width: 64upx;
			height: 64upx;
		}

		/deep/ .menu-item {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
		}

		/deep/ .order-pane {
			margin-top: 20upx;
		}
	}
}

/deep/ .tui-loading-init {
	position: inherit;
	transform: translate(0, 0);
	background-color: transparent;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100vw;
	min-width: 100vw;
	max-width: 100vw;
	flex-direction: row;
	// padding-top: 30upx;
}

/deep/ .tui-loadmore-tips {
	color: #ff7a4e;
	margin-bottom: 40upx;
}

/deep/ .tui-loading-center {
	border-color: #ff7a4e;
}
</style>

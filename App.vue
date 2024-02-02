<script>
// import { T_STORAGE_KEY } from './constant'

export default {
	name: 'App',
	onLaunch(options) {
		// if (!uni.getStorageSync(T_STORAGE_KEY)) {
		// 	uni.navigateTo({
		// 		url: '/pages/login/login'
		// 	})
		// }
		if (this.isLogin()) {
			this.$store.dispatch('auth/refrshUserInfoAction')
		}
		uni.getSystemInfo({
			success: (res) => {
				if (res.safeArea.top > 20 && res.model.indexOf('iPhone') !== -1) {
					this.globalData.isIphone = true
				}
			}
		})
		this.$store.dispatch('app/getSystermTerminal')
		// #ifdef H5
		this.globalData.terminal = 2
		// #endif
		// #ifdef APP || APP-NVUE
		this.globalData.terminal = 3
		// #endif
		// #ifdef MP
		this.globalData.terminal = 1
		// #endif
	},
	onShow() {
	},
	globalData: {
		// 判断设备是否为 iPhone
		isIphone: false,
		// 画布设备 1 小程序，2 H5，3 App 4 电脑
		terminal: ''
	},
	mounted() {
		this.$store.dispatch('app/getUserSystermInfo')
		const launchOptions = uni.getLaunchOptionsSync()
		this.scene = launchOptions.scene
	},
	onHide() {
	},
	methods: {
	}
}
</script>

<style lang="scss">
@import './app.css';

.tui-badge.tui-danger.tui-badge-scale {
	box-shadow: 0px 0 1upx #ed3f14;
	border: 4upx solid #fff;
}

.tui-toast-text {
	line-height: 1.5;
}

/* 隐藏头部 */
uni-page-head {
	display: none;
}

uni-page-wrapper {
	height: 100%;
}

/* 轮播图指示点 */
uni-swiper .uni-swiper-dots-horizontal {
	bottom: 20px !important;
}

/* uni-page-body {
  overflow: scroll;
} */

.uni-page-refresh--pulling,
.uni-page-refresh--reached {
	z-index: 1019000;
}

// 自定义骨架屏
.ske-loading {
	.child-loading {
		animation: loading 2s linear 0s infinite alternate;
	}
}

uni-rich-text img {
	max-width: 100% !important;
}

// 图片占位图
.pic-img {
	width: 100%;
	height: 100%;
}

.default-img {
	background: url('./static/images/common/default.png') no-repeat center;
	background-size: 100% 100%;
}

.line1 {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.wid {
	width: 100%;
}

.fs4 {
	font-size: 4upx;
}

.fs18 {
	font-size: 18upx;
}

.fs20 {
	font-size: 20upx;
}

.fs22 {
	font-size: 22upx;
}

.fs24 {
	font-size: 24upx;
}

.fs26 {
	font-size: 26upx;
}

.fs28 {
	font-size: 28upx;
}

.fs30 {
	font-size: 30upx;
}

.fs32 {
	font-size: 32upx;
}

.fs34 {
	font-size: 34upx;
}

.fs36 {
	font-size: 36upx;
}

.fs38 {
	font-size: 38upx;
}

.fs40 {
	font-size: 40upx;
}

.fs42 {
	font-size: 42upx;
}

.fs44 {
	font-size: 44upx;
}

.fs46 {
	font-size: 46upx;
}

.fs48 {
	font-size: 46upx;
}

.fs50 {
	font-size: 50upx;
}

.fs60 {
	font-size: 60upx;
}

.fs-bold {
	font-weight: bold;
}

.fs-weight-300 {
	font-weight: 300;
}

.fs-weight-200 {
	font-weight: 200;
}

.fs-weight-400 {
	font-weight: 400;
}

.flex-display {
	display: flex;
}

.flex-center {
	display: flex;
	justify-content: center;
}

.flex-items {
	display: flex;
	align-items: center;
}

.flex-items-plus {
	display: flex;
	justify-content: center;
	align-items: center;
}

.flex-start {
	display: flex;
	justify-content: flex-start;
}

.flex-end {
	display: flex;
	justify-content: flex-end;
}

.flex-end-plus {
	display: flex;
	justify-content: flex-end;
	align-items: center;
}

.flex-column {
	flex-direction: column
}

.flex-column-plus {
	display: flex;
	flex-direction: column
}

.flex-row {
	flex-direction: row
}

.flex-row-plus {
	display: flex;
	flex-direction: row
}

.flex-sp-around {
	justify-content: space-around;
}

.flex-sp-between {
	justify-content: space-between;
}

.text-align {
	text-align: center;
}

.flex-wrap-1 {
	display: flex;
	flex-wrap: wrap
}

.flex-nowrap-1 {
	display: flex;
	flex-wrap: nowrap
}

.align-end {
	display: flex;
	align-items: flex-end;
}

.align-sp-between {
	align-content: space-between;
}

.mar-top-5 {
	margin-top: 5upx;
}

.mar-top-10 {
	margin-top: 10upx;
}

.mar-top-20 {
	margin-top: 20upx;
}

.mar-top-30 {
	margin-top: 30upx;
}

.mar-top-32 {
	margin-top: 32upx;
}

.mar-top-36 {
	margin-top: 36upx;
}

.mar-top-40 {
	margin-top: 40upx;
}

.mar-top-50 {
	margin-top: 50upx;
}

.mar-top-60 {
	margin-top: 60upx;
}

.mar-top-70 {
	margin-top: 70upx;
}

.mar-top-100 {
	margin-top: 100upx;
}

.mar-top-percent40 {
	margin-top: 40%;
}

.mar-top-half {
	margin-top: 50%;
}

.mar-left-6 {
	margin-left: 6upx;
}

.mar-left-5 {
	margin-left: 5upx;
}

.mar-left-10 {
	margin-left: 10upx;
}

.mar-left-20 {
	margin-left: 20upx;
}

.mar-left-30 {
	margin-left: 30upx;
}

.mar-left-35 {
	margin-left: 35upx;
}

.mar-left-40 {
	margin-left: 40upx;
}

.mar-left-50 {
	margin-left: 50upx;
}

.mar-left-60 {
	margin-left: 60upx;
}

.mar-left-70 {
	margin-left: 70upx;
}

.mar-right-10 {
	margin-right: 10upx;
}

.mar-right-20 {
	margin-right: 20upx;
}

.mar-right-25 {
	margin-right: 25upx;
}

.mar-right-30 {
	margin-right: 30upx;
}

.mar-right-35 {
	margin-right: 35upx;
}

.mar-right-40 {
	margin-right: 40upx;
}

.mar-right-50 {
	margin-right: 50upx;
}

.pad-left-10 {
	padding-left: 10upx;
}

.pad-left-20 {
	padding-left: 20upx;
}

.pad-left-40 {
	padding-left: 40upx;
}

.pad-right-20 {
	padding-right: 20upx;
}

.pad-top-20 {
	padding-top: 20upx;
}

.pad-top-40 {
	padding-top: 40upx;
}

.pad-bot-20 {
	padding-bottom: 20upx;
}

.pad-topbot-20 {
	padding: 20upx 0upx;
}

.pad-topbot-5 {
	padding: 0upx 5upx;
}

.pad-topbot-10 {
	padding: 0upx 10upx;
}

.pad-topbot-50 {
	padding: 50upx 0upx;
}

.pad-bot-20 {
	padding-bottom: 20upx;
}

.pad-bot-30 {
	padding-bottom: 30upx;
}

.pad-bot-40 {
	padding-bottom: 40upx;
}

.pad-bot-100 {
	padding-bottom: 100upx;
}

.pad-bot-140 {
	padding-bottom: 140upx;
}

.bor-rad-30 {
	border-radius: 30upx;
}

.bor-rad-45 {
	border-radius: 45upx;
}

.bor-rad-half {
	border-radius: 50%;
}

.backColor {
	background-color: #009688;
}

.backColorFFF {
	background-color: #FFFFFF;
}

.pos-abs {
	position: absolute;
}

.bor-bot-line {
	border-bottom: #C8C7CC 1upx solid;
}

.bor-line-F7F7F7 {
	border-bottom: #F7F7F7 1upx solid;
}

.bor-line-E5E5E5 {
	border-bottom: #E5E5E5 1upx solid;
}

.borRig-line-E5E5E5 {
	border-right: #DDDDDD 2upx solid;
}

.borRig-line-20 {
	border-bottom: #F7F7F7 20upx solid;
}

.font-color-red {
	color: red;
}

.font-color-FFF {
	color: #FFFFFF;
}

.font-color-8A734A {
	color: #8A734A;
}

.font-color-71521B {
	color: #71521B;
}

.font-color-222 {
	color: #222222;
}

.font-color-333 {
	color: #333333;
}

.font-color-666 {
	color: #666666;
}

.font-color-999 {
	color: #999999;
}

.font-color-656 {
	color: #656565;
}

.font-color-DDD {
	color: #DDDDDD;
}

.font-color-CCC {
	color: #CCCCCC;
}

.font-color-FFEBC4 {
	color: #FFEBC4;
}

.font-color-1CC363 {
	color: #1CC363;
}

.font-color-47A7EE {
	color: #47A7EE;
}

.font-color-C5AA7B {
	color: #C5AA7B;
}

.font-color-FF7700 {
	color: #FF7700;
}

.font-color-FF7911 {
	color: #FF7911;
}

.font-color-80 {
	color: #808080;
}

.font-color-DD {
	color: #DD524D;
}

.font-color-C83732 {
	color: #C83732;
}

.font-color-3F {
	color: #3F536E;
}

.font-color-009 {
	color: #009688;
}

.font-weight-500 {
	font-weight: 500;
}

.font-weight-bold {
	font-weight: bold;
}

.overflow {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.overflowNoDot {
	display: block;
	overflow: hidden;
}

.discountsPriceLine {
	text-decoration: line-through;
}

.border-bottom-Line {
	border-bottom: 1upx solid #EDEDED;
}

.decoration {
	text-decoration: line-through;
}

.anonymous {
	margin-top: 25upx;

	.uni-checkbox-input {
		border-color: #C5AA7B !important;
		width: 30upx;
		height: 30upx;
	}

	.uni-checkbox-input-checked:before {
		font-size: 30upx !important;
	}

	.uni-checkbox-input-checked {
		background: #C5AA7B;
	}
}

.footprint {
	.itemList {
		.uni-checkbox-input {
			border-color: #C5AA7B !important;
			width: 36upx;
			height: 36upx;
			border-radius: 50%;
			margin-right: 20upx;
		}

		.uni-checkbox-input-checked:before {
			font-size: 36upx !important;
		}

		.uni-checkbox-input-checked {
			background: #C5AA7B;
		}
	}
}
</style>

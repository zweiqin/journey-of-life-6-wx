<template>
	<view class="content">
		<view class="content-box">
			<view class="top-main-box">
				<view class="zzbg">
					<image class="mpimg" src="../../static/images/userimg.png" mode="widthFix"></image>
				</view>
				<view class="topmain">
					<view class="leftimg">
						<u-avatar size="60" :src="cardObj.head_img" shape="square"></u-avatar>
					</view>
					<view class="rightcont">
						<view class="name">{{ cardObj.name }}</view>
						<view class="tip">{{ cardObj.job }}</view>
						<view class="tipa">{{ cardObj.company }}</view>
					</view>
				</view>
				<view class="btnmain">
					<u-icon name="map-fill"></u-icon><text>{{ cardObj.address }}</text>
				</view>
			</view>

			<view class="top-mainb">
				<view class="conta">
					<view v-if="cardObj.phone" class="cont" @click="onPhone()">
						<view class="box">
							<u-icon name="phone-fill" color="#007AFF" size="40"> </u-icon>
							<view class="right">
								<text class="tit">拨打电话</text>
								<text>{{ cardObj.phone }}</text>
							</view>
						</view>
					</view>
					<view v-if="cardObj.wechat" class="cont" @click="onCopy(cardObj.wechat)">
						<view class="box">
							<u-icon name="weixin-fill" color="#007AFF" size="40"> </u-icon>
							<view class="right">
								<text class="tit">加微信</text>
								<text>{{ cardObj.wechat }}</text>
							</view>
						</view>
					</view>
					<view v-if="cardObj.qq" class="cont" @click="onCopy(cardObj.qq)">
						<view class="box">
							<u-icon name="qq-fill" color="#007AFF" size="40"> </u-icon>
							<view class="right">
								<text class="tit">QQ</text>
								<text>{{ cardObj.qq }}</text>
							</view>
						</view>
					</view>
					<view v-if="cardObj.email" class="cont" @click="onCopy(cardObj.email)">
						<view class="box">
							<u-icon name="email-fill" color="#007AFF" size="40"> </u-icon>
							<view class="right">
								<text class="tit">邮箱</text>
								<text>{{ cardObj.email }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="top-maina">
				<button class="left" @click="onAdd()">
					同步到通讯录
				</button>
				<button class="right" open-type="share">
					分享名片
				</button>
			</view>
			<view class="top-mainc">
				<view class="left">
					<u-avatar-group :urls="headerList" size="35" gap="0.4" :default-url="headerImg" random-bg-color>
					</u-avatar-group>
					<text>{{ visitorCount }}人浏览</text>
				</view>
			</view>
			<view class="top-main-tit">
				<u-icon name="file-text-fill" color="#007AFF" size="40"> </u-icon>
				<text>业务介绍</text>
			</view>
			<view class="top-maind">
				<view class="topmain">
					<view class="leftimg">
						<u-avatar size="60" :src="cardObj.head_img" shape="square"></u-avatar>
					</view>
					<view class="rightcont">
						<view v-if="!cardObj.intro" class="name">Hi~欢迎访问我的名片，了解更多内容请直接咨询我。</view>
						<view v-if="cardObj.intro" class="name">{{ cardObj.intro }}</view>
					</view>
				</view>
			</view>

		</view>
		<view class="bottom-block"></view>
		<view class="bottombtn" type="primary" @click="gotoEdit">编辑我的名片</view>
	</view>
</template>

<script>
import { USER_INFO } from '../../constant'

export default {
	name: 'Index',
	data() {
		return {
			id: '',
			headerImg: require('../../static/images/userimg.png'),
			cardObj: {},
			visitorList: [],
			visitorCount: 0,
			headerList: []
		}
	},
	async onShow(options) {
		console.log('onLoad options', options)
		if (uni.getStorageSync(USER_INFO)) {
			var user = uni.getStorageSync(USER_INFO)
			if (id != null && id != '') {
				this.id = id
				const card = await request('uni-card', 'getCard', {
					id,
					uid: user.id
				}, {
					showloading: true
				})
				if (card._id == '') {
					this.getDefault()
				} else {
					const visitorList = await request('uni-card', 'getVisitorList', {
						card_id: id,
						skip: 0,
						limit: 8
					}, {
						showloading: true
					})
					this.cardObj = card
					this.visitorCount = visitorList.total
					visitorList.items.forEach((arr, index) => {
						if (arr.head_img) { this.headerList.push(arr.head_img) } else { this.headerList.push(require('../../static/images/userimg.png')) }
					})
				}
			} else {
				const mycard = await request('uni-card', 'getMyCard', {
					uid: user.id
				}, {
					showloading: true
				})
				if (mycard._id == '') {
					this.getDefault()
				} else {
					const myVisitorList = await request('uni-card', 'getMyVisitorList', {
						uid: user.id,
						skip: 0,
						limit: 8
					}, {
						showloading: true
					})
					this.cardObj = mycard
					this.visitorCount = myVisitorList.total
					myVisitorList.items.forEach((arr, index) => {
						if (arr.head_img) { this.headerList.push(arr.head_img) } else { this.headerList.push(require('../../static/images/userimg.png')) }
					})
				}
			}
		}
	},
	onShareAppMessage(res) {
		if (this.id == '' || this.id == null) {
			this.id = '61b30b8091a7500001dea375'
		}
		return {
			title: '您好，这是我的名片，望惠存',
			path: '/pages/index?id=' + this.id
		}
	},
	methods: {
		async getDefault() {
			const card = await request('uni-card', 'getCard', {
				id: '61b30b8091a7500001dea375',
				uid: '61b30b4e7964120001e32f41'
			}, {
				showloading: true
			})
			if (card._id == '') {
				this.gotoEdit()
			}
			const visitorList = await request('uni-card', 'getVisitorList', {
				card_id: '61b30b8091a7500001dea375',
				skip: 0,
				limit: 8
			}, {
				showloading: true
			})
			this.cardObj = card
			this.visitorCount = visitorList.total
			visitorList.items.forEach((arr, index) => {
				if (arr.head_img) { this.headerList.push(arr.head_img) } else { this.headerList.push(require('../../static/images/userimg.png')) }
			})
		},
		onAdd() {
			uni.addPhoneContact({
				organization: this.cardObj.company,
				firstName: this.cardObj.name,
				title: this.cardObj.job,
				email: this.cardObj.email,
				mobilePhoneNumber: this.cardObj.phone,
				weChatNumber: this.cardObj.wechat,
				remark: this.cardObj.address,
				success() {
					console.log('success')
				},
				fail() {
					console.log('fail')
				}
			})
		},
		onPhone() {
			uni.makePhoneCall({
				phoneNumber: this.cardObj.phone,
				success: (res) => {
					console.log('调用成功!')
				},
				fail: (res) => {
					console.log('调用失败!')
				}
			})
		},
		onCopy(data) {
			uni.setClipboardData({
				data, // 要被复制的内容
				success() {
					// 重点~做笔记
					// 在success中加入uni.hideToast()可以解决
					uni.showToast({
						title: '复制成功',
						duration: 2000,
						icon: 'none'
					})
					// 以下就可自定义操作了~
				},
				fail(err) {
					uni.showToast({
						title: '复制失败',
						duration: 2000,
						icon: 'none'
					})
				}
			})
		},
		gotoEdit() {
			uni.navigateTo({
				url: '/pages/edit/edit'
			})
		}
	}
}
</script>

<style>
page {
	background: #f7f7f7;
}

.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.content-box {
	width: 100%;
	box-sizing: border-box;
	padding: 0 5%;
}

.content-box .top-main-box {
	width: 100%;
	box-sizing: border-box;
	border-radius: 15rpx;
	height: 52vw;
	overflow: hidden;
	position: relative;
	box-shadow: 0px 0px 10px #cccccc;
}

.content-box .top-main-box .zzbg {
	width: 100%;
	position: absolute;
	top: 0;
	left: 0;
	background: rgba(139, 139, 139, 0.5);
	z-index: 1;
}

.content-box .top-main-box .mpimg {
	width: 100%;
}

.content-box .top-main-box .topmain {
	width: 100%;
	box-sizing: border-box;
	padding: 40rpx 5%;
	display: flex;
	align-items: flex-start;
	position: relative;
	z-index: 4;
}

.content-box .top-main-box .topmain .leftimg {
	width: 150rpx;
	height: 150rpx;
	border-radius: 15rpx;
	overflow: hidden;
}

.content-box .top-main-box .topmain .leftimg .tximg {
	width: 100%;
}

.content-box .top-main-box .topmain .rightcont {
	color: #fff;
	flex: 1;
	box-sizing: border-box;
	padding-left: 25rpx;
}

.content-box .top-main-box .topmain .rightcont .name {
	font-size: 42rpx;
	padding-bottom: 10rpx;
}

.content-box .top-main-box .topmain .rightcont .tip,
.content-box .top-main-box .topmain .rightcont .tipa {
	font-size: 34rpx;
	text-shadow: 1px 1px 1px #000;
}

.content-box .top-main-box .btnmain {
	width: 100%;
	position: absolute;
	left: 0;
	bottom: 0px;
	z-index: 5;
	box-sizing: border-box;
	padding: 25rpx 5%;
	background: #fff;
	display: inline;
	align-items: center;
	justify-content: space-between;
	text-align: left;
}

.content-box .top-main-box .btnmain view {
	float: left;
}

.content-box .top-main-box .btnmain text {
	font-size: 24rpx;
	color: #333333;
	padding-left: 10rpx;
	float: left;
}

.content-box .top-maina {
	width: 100%;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 20rpx auto;
}

.content-box .top-maina view {
	width: 48%;
	border-radius: 15rpx;
	text-align: center;
	padding: 25rpx 0;
	font-size: 18px;
}

.content-box .top-maina .left {
	border: 1px solid #007AFF;
	color: #007AFF;
	width: 48%;
}

.content-box .top-maina .right {
	background: #007AFF;
	border: 1px solid #007AFF;
	color: #fff;
	width: 48%;
}

.content-box .top-mainb {
	width: 100%;
	overflow: scroll;
	padding: 15rpx 0;
	overflow-x: hidden;
}

.content-box .top-mainb .conta {
	width: 100%;
	overflow-x: auto;
	word-break: keep-all;
	/* 不换行 */
	white-space: nowrap;
	/* 不换行 */
	padding-bottom: 20rpx;
}

.content-box .top-mainb .conta .cont {
	display: inline-block;
	margin-right: 20rpx;
	background: #fff;
	box-shadow: 0px 0px 8px #cccccc;
	border-radius: 10rpx;
	overflow: hidden;
}

.content-box .top-mainb .conta .cont .box {
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-sizing: border-box;
	padding: 15rpx 20rpx;
}

.content-box .top-mainb .conta .cont .box image {
	width: 80rpx;
	height: 80rpx;
}

.content-box .top-mainb .conta .cont .box .right {
	flex: 1;
	box-sizing: border-box;
	padding-left: 10rpx;
}

.content-box .top-mainb .conta .cont .box .right text {
	display: block;
	font-size: 30rpx;
}

.content-box .top-mainb .conta .cont .box .right .tit {
	font-size: 34rpx;
}

.content-box .top-mainc {
	width: 100%;
	box-sizing: border-box;
	padding: 20rpx 10rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 10rpx auto;
	background: #fff;
}

.content-box .top-mainc .left {
	flex: 1;
	display: flex;
	align-items: center;
}

.content-box .top-mainc .left text {
	font-size: 28rpx;
	color: #555555;
}

.content-box .top-mainc .left image {
	width: 60rpx;
	height: 60rpx;
	margin-right: 5rpx;
	border-radius: 10rpx;
}

.content-box .top-mainc .right {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.content-box .top-mainc .right text {
	font-size: 28rpx;
	color: #555555;
	padding-right: 10rpx;
}

.content-box .top-mainc .right image {
	width: 40rpx;
	height: 40rpx;
}

.content-box .top-main-tit {
	width: 100%;
	box-sizing: border-box;
	padding: 20rpx 10rpx;
	display: flex;
	align-items: center;
}

.content-box .top-main-tit image {
	width: 60rpx;
	height: 60rpx;
}

.content-box .top-main-tit text {
	color: #333;
	font-size: 18px;
	padding-left: 10rpx;
}

.content-box .top-maind {
	width: 100%;
	box-sizing: border-box;
	padding: 40rpx 5%;
	background: #fff;
	box-shadow: 0px 0px 8px #cccccc;
}

.content-box .top-maind .topmain {
	width: 100%;
	box-sizing: border-box;
	display: flex;
	align-items: flex-start;
}

.content-box .top-maind .topmain .leftimg {
	width: 120rpx;
	height: 120rpx;
	border-radius: 15rpx;
	overflow: hidden;
}

.content-box .top-maind .topmain .leftimg .tximg {
	width: 100%;
}

.content-box .top-maind .topmain .rightcont {
	color: #555;
	flex: 1;
	box-sizing: border-box;
	padding-left: 25rpx;
	line-height: 42rpx;
	font-size: 28rpx;
}

.content-box .top-maind .toptip {
	width: 100%;
}

.content-box .top-maind .toptip .box {
	display: inline-block;
	margin-top: 25rpx;
	padding: 10rpx 15rpx;
	background: #e6e6e6;
	border-radius: 10rpx;
	overflow: hidden;
	margin-right: 20rpx;
}

.content-box .top-maind .toptip .box image {
	width: 30rpx;
	height: 30rpx;
}

.content-box .top-maind .toptip .box text {
	font-size: 28rpx;
	padding-left: 10rpx;
}

.bottombtn {
	position: fixed;
	bottom: 0;
	width: 100%;
	height: 60px;
	background: #007AFF;
	color: #fff;
	line-height: 60px;
	text-align: center;
}

.bottom-block {
	display: block;
	width: 100%;
	height: 80px;
}
</style>

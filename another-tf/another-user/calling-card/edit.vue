<template>
	<view>
		<view class="wrap">
			<tui-form ref="refLoginForm" :show-message="false">
				<view>
					<tui-input
						v-model="cardObj.name" label="姓名" type="number" padding="26rpx 20rpx 26rpx 0"
						placeholder-style="color: #f3c1c4;font-size: 32rpx;" label-color="#ffffff" border-color="#EA5B1D"
						placeholder="请输入姓名" background-color="transparent" :border-top="false" color="#ffffff"
						style="border-bottom: 2rpx solid #ffffff;"
					></tui-input>
				</view>
				<view>
					<tui-input
						v-model="cardObj.phone" label="+ 86" type="number" padding="26rpx 20rpx 26rpx 0"
						placeholder-style="color: #f3c1c4;font-size: 32rpx;" label-color="#ffffff" border-color="#EA5B1D"
						placeholder="请输入电话" background-color="transparent" :border-top="false" color="#ffffff"
						style="border-bottom: 2rpx solid #ffffff;"
					></tui-input>
				</view>
				<view>
					<JUpload
						title="头像" :img-url="common.seamingImgUrl(cardObj.head_img)" @upload="handleSaveHeadImg"
						@delete="cardObj.head_img = '' || $forceUpdate()"
					></JUpload>
				</view>
			</tui-form>
			<view class="wrap">
				<view style="float:left;width: 40px;">
					<tui-icon
						v-if="checked" name="circle-fill" :size="34" unit="rpx"
						color="#c5aa7b" margin="0 15rpx 0 0" @click="checked = false"
					></tui-icon>
					<tui-icon
						v-else name="circle" :size="34" unit="rpx"
						color="#cccccc" margin="0 15rpx 0 0" @click="checked = true"
					></tui-icon>
				</view>
				<text style="float:left;color:#04498c" @click="goAgree()">同意用户服务协议&隐私政策</text>
			</view>
		</view>
		<view class="bottom-block"></view>
		<view class="bottombtn" type="primary" @click="onSave">立即保存</view>
	</view>
</template>

<script>
import { USER_INFO } from '../../../constant'
export default {
	name: 'Edit',
	components: {},
	data() {
		return {
			checked: false,
			cardObj: {},
			fileList1: [],
			isAdd: true,
			rules: {
				'cardObj.name': {
					type: 'string',
					required: true,
					message: '必填',
					trigger: ['blur', 'change']
				},
				'cardObj.phone': {
					type: 'string',
					required: true,
					message: '必填',
					trigger: ['blur', 'change']
				}
			}
		}
	},
	mounted() { },
	async onLoad(options) {
		if (uni.getStorageSync(USER_INFO)) {
			var user = uni.getStorageSync(USER_INFO)
			const res = await request('uni-card', 'getMyCard', {
				uid: user.id
			}, {
				showloading: true
			})
			if (res.uid == null) { this.isAdd = true } else {
				if (res.uid != user.id) {
					uni.navigateTo({
						url: '/pages/index'
					})
				}
				this.cardObj = res
				this.isAdd = false
				this.fileList1.push({
					url: res.head_img
				})
			}
		}
	},
	methods: {
		handleSaveHeadImg() {
			this.cardObj.head_img = e
			this.$forceUpdate()
		},
		goAgree() {
			uni.navigateTo({
				url: '/pages/agree'
			})
		},
		changeClick() {
			console.log('this.checked', this.checked)
		},
		async onSave() {
			if (!this.checked) {
				this.$showToast('请点击同意用户服务协议&隐私政策')
				return
			}
			if (!this.cardObj.name) {
				this.$showToast('请填写姓名')
				return
			}
			if (!this.cardObj.phone) {
				this.$showToast('请填写电话')
				return
			}
			var user = uni.getStorageSync(USER_INFO)
			this.cardObj.uid = user.id
			const res = await request('uni-card', 'saveCard', this.cardObj, {
				showloading: true
			})
			console.log('res', res)
			this.$showToast('保存成功')
			uni.navigateTo({
				url: '/pages/index'
			})
		},
		deletePic(event) {
			this.fileList1 = []
			this.cardObj.head_img = ''
		},
		async afterRead(event) {
			console.log('event', event)
			const result = await this.uploadFilePromise(event.file.url)
		},
		uploadFilePromise(url) {
			return new Promise((resolve, reject) => {
				var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
				var maxLen = $chars.length
				var noncestr = ''
				for (var i = 0; i < 32; i++) {
					noncestr += $chars.charAt(Math.floor(Math.random() * maxLen))
				}
				var that = this
				uniCloud.uploadFile({
					filePath: url,
					cloudPath: noncestr + '.jpg',
					onUploadProgress(progressEvent) {
						console.log('上传进度', progressEvent)
						var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
					},
					success(e) {
						console.log('uploadFile', e)
						that.fileList1.push({
							url: e.fileID
						})
						that.cardObj.head_img = e.fileID
					},
					fail() { },
					complete() { }
				})
			})
		}
	}
}
</script>

<style lang="less">
/deep/.u-scroll-bar {
	background: red !important;
}

.wrap {
	padding: 20px;
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

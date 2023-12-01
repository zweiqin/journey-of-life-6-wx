<template>
	<view>
		<view class="wrap">
			<u--form labelPosition="left" :model="cardObj" :rules="rules" ref="form1" labelWidth="80">
				<u-form-item label="姓名" prop="cardObj.name" borderBottom>
					<u--input v-model="cardObj.name" border="none"></u--input>
				</u-form-item>
				<u-form-item label="电话" prop="cardObj.phone" borderBottom>
					<u--input v-model="cardObj.phone" border="none"></u--input>
				</u-form-item>
				<u-form-item label="公司" prop="company" borderBottom>
					<u--input v-model="cardObj.company" border="none"></u--input>
				</u-form-item>
				<u-form-item label="地址" prop="address" borderBottom>
					<u--input v-model="cardObj.address" border="none"></u--input>
				</u-form-item>
				<u-form-item label="职位" prop="job" borderBottom>
					<u--input v-model="cardObj.job" border="none"></u--input>
				</u-form-item>
				<u-form-item label="微信" prop="wechat" borderBottom>
					<u--input v-model="cardObj.wechat" border="none"></u--input>
				</u-form-item>
				<u-form-item label="QQ" prop="wechat" borderBottom>
					<u--input v-model="cardObj.qq" border="none"></u--input>
				</u-form-item>
				<u-form-item label="邮箱" prop="email" borderBottom>
					<u--input v-model="cardObj.email" border="none"></u--input>
				</u-form-item>
				<u-form-item label="业务介绍" prop="intro" borderBottom>
					<u--textarea v-model="cardObj.intro" border="none"></u--textarea>
				</u-form-item>
				<u-form-item label="头像" prop="intro" borderBottom>
					<u-upload :fileList="fileList1" @afterRead="afterRead" name="5" :maxCount="1" @delete="deletePic"
						:previewFullImage="true">
					</u-upload>
				</u-form-item>
			</u--form>
			<view class="wrap">
				<view style="float:left;width: 40px;">
					<u-checkbox-group  v-model="checked" change="changeClick()">
					<u-checkbox shape="circle" ></u-checkbox>
					</u-checkbox-group>
				</view>
				<text style="float:left;color:#04498c" @click="goAgree()">同意用户服务协议&隐私政策</text>
			</view>
		</view>
		<view class="bottom-block"></view>
		<view class="bottombtn" type="primary" @click="onSave">立即保存</view>
	</view>
</template>

<script>
	import {
		request
	} from '@/common/js/request'
	export default {
		name: "Edit",
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
					},
				},
			};
		},
		mounted() {},
		async onLoad(options) {
			const logged = uni.getStorageSync('logged');
			if (logged) {
				var user = uni.getStorageSync('userInfo');
				const res = await request('uni-card', 'getMyCard', {
					uid: user.id
				}, {
					showloading: true
				});
				if (res.uid == null)
					this.isAdd = true;
				else {
					if (res.uid != user.id) {
						uni.navigateTo({
							url: "/pages/index"
						})
					}
					this.cardObj = res;
					this.isAdd = false;
					this.fileList1.push({
						url: res.head_img
					})
				}
			}
		},
		methods: {
			goAgree() {
				uni.navigateTo({
					url: "/pages/agree"
				})
			},
			changeClick(){
				console.log("this.checked",this.checked)
			},
			async onSave() {
				if (!this.checked) {
					this.$util.msg('请点击同意用户服务协议&隐私政策');
					return;
				}
				if (!this.cardObj.name) {
					this.$util.msg('请填写姓名');
					return;
				}
				if (!this.cardObj.phone) {
					this.$util.msg('请填写电话');
					return;
				}
				var user = uni.getStorageSync('userInfo');
				this.cardObj.uid = user.id;
				const res = await request('uni-card', 'saveCard', this.cardObj, {
					showloading: true
				});
				console.log("res", res)
				this.$util.msg('保存成功');
				uni.setStorageSync('id', res.id);
				uni.navigateTo({
					url: "/pages/index"
				})
			},
			deletePic(event) {
				this.fileList1 = [];
				this.cardObj.head_img = "";
			},
			async afterRead(event) {
				console.log("event", event)
				const result = await this.uploadFilePromise(event.file.url)
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
					var maxLen = $chars.length;
					var noncestr = '';
					for (var i = 0; i < 32; i++) {
						noncestr += $chars.charAt(Math.floor(Math.random() * maxLen));
					}
					var that = this;
					uniCloud.uploadFile({
						filePath: url,
						cloudPath: noncestr + ".jpg",
						onUploadProgress: function(progressEvent) {
							console.log("上传进度", progressEvent);
							var percentCompleted = Math.round(
								(progressEvent.loaded * 100) / progressEvent.total
							);
						},
						success(e) {
							console.log("uploadFile", e)
							that.fileList1.push({
								url: e.fileID
							})
							that.cardObj.head_img = e.fileID
						},
						fail() {},
						complete() {}
					});
				})
			},
		}
	};
</script>

<style>
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

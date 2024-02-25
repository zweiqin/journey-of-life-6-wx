<template>
	<view class="label-list-container">
		<!-- <TuanAppShim bg="transparent"></TuanAppShim> -->
		<JHeader title="名片标签列表" width="50" height="50"></JHeader>
		<view style="width: 70%; margin: 14rpx auto 14rpx">
			<tui-button
				type="blue" bold shape="circle" width="100%"
				@click="go(`/another-tf/another-user/calling-card-management/card-label-form`)"
			>
				新增标签
			</tui-button>
		</view>
		<view v-if="electronicLabelInfo && electronicLabelInfo.length" style="padding: 12rpx 0;">
			<view v-for="(item, index) in electronicLabelInfo" :key="index" style="margin-top: 20rpx;">
				<tui-card :title="{ text: item.labelName }" :tag="{ text: `ID：${item.labelId}` }">
					<template #body>
						<view style="padding: 10rpx 32rpx;">
							<view>关联名片ID：{{ item.enterpriseUserId }}</view>
							<view>创建时间：{{ item.createTime }}</view>
							<view>更新时间：{{ item.updateTime }}</view>
						</view>
					</template>
					<template #footer>
						<view class="label-btn" style="padding: 0 20rpx 20rpx;text-align: right;">
							<tui-button
								type="warning" width="120rpx" height="50rpx" margin="0 20rpx 0"
								@click="go(`/another-tf/another-user/calling-card-management/card-label-form?id=${item.labelId}`)"
							>
								编辑
							</tui-button>
							<tui-button type="danger" width="120rpx" height="50rpx" @click="handleLabelDelete(item)">
								删除
							</tui-button>
						</view>
					</template>
				</tui-card>
			</view>
		</view>
		<view style="padding-bottom: 45rpx;">
			<LoadingMore :status="isLoading ? 'loading' : ''"></LoadingMore>
			<view v-if="!isLoading && !electronicLabelInfo.length">
				<tui-no-data :fixed="false">您还没有设置名片标签哦～</tui-no-data>
			</view>
		</view>

	</view>
</template>

<script>
import { deleteByIdEnterpriseUserLabelApi } from '../../../api/anotherTFInterface'
export default {
	name: 'LabelList',
	components: {
	},
	data() {
		return {
			electronicLabelInfo: [],
			isLoading: true
		}
	},
	onShow() {
		this.getLabelList()
	},

	methods: {
		async getLabelList() {
			if (this.$store.getters.electronicCardInfo.enterpriseUserId) {
				uni.showLoading()
				this.isLoading = true
				try {
					this.electronicLabelInfo = await this.$store.dispatch('user/getElectronicLabelAction', { id: this.$store.getters.electronicCardInfo.enterpriseUserId })
					uni.hideLoading()
					this.isLoading = false
				} catch (err) {
					uni.hideLoading()
					this.isLoading = false
				}
			} else {
				this.$showToast('缺少名片信息')
			}
		},
		handleLabelDelete(item) {
			uni.showModal({
				title: '提示',
				content: '确定要删除当前名片标签？',
				success: (res) => {
					if (res.confirm) {
						deleteByIdEnterpriseUserLabelApi({
							labelId: item.labelId
						}).then((res) => {
							this.$showToast('删除成功', 'success')
							this.getLabelList()
						})
					}
				}
			})
		}
	}
}
</script>

<style lang="less" scoped>
.label-list-container {
	width: 100%;
	min-height: 100vh;
	background-color: #f5f4f9;
	/deep/ .j-header-container{
		padding: 24rpx 0 0;
	}

	/deep/ .tui-nodata-box {
		padding-top: 60rpx;
	}

	.label-btn {
		/deep/ .tui-btn {
			display: inline-block;
			border-radius: 50rpx;
		}
	}
}
</style>

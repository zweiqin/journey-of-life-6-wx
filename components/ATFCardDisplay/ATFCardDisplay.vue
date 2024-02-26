<template>
	<view class="card-display-container">
		<view style="padding: 20rpx;background-color: #476088;color: #ffffff;border-radius: 14rpx;">
			<view v-if="(cardData.styleId === 1) || (cardData.styleId === 2) || (cardData.styleId === 3)">
				<view style="display: flex;align-items: center;">
					<view style="flex: 1;display: flex;align-items: center;">
						<view style="text-align: center;">
							<image
								:src="common.seamingImgUrl(cardData.headImage) || headerImg"
								style="width: 102rpx;height: 102rpx;border-radius: 50%;"
							></image>
						</view>
						<view style="margin-left: 28rpx;">
							<view style="display: flex;align-items: center;">
								<view>{{ cardData.name }}</view>
								<view style="margin-left: 20rpx;">
									<text v-if="cardData.sex == 1">男</text>
									<text v-else-if="cardData.sex == 2">女</text>
									<text v-else>未知</text>
								</view>
							</view>
							<view style="font-size: 26rpx;">{{ cardData.birthday }}</view>
						</view>
					</view>
					<view v-if="cardData.ifBlack" style="margin-left: 20rpx;font-weight: bold;">已加入黑名单</view>
				</view>
				<view style="margin-top: 12rpx;">
					<view style="display: flex;justify-content: space-between;align-items: center;">
						<view style="flex: 2;display: flex;align-items: flex-start;padding-top: 8rpx;padding-right:14rpx;">
							<tui-icon :size="28" color="#dedcdc" name="mobile" unit="rpx" margin="0 18rpx 0 0"></tui-icon>
							<view>{{ cardData.phone }}</view>
						</view>
						<view v-if="cardData.landline" style="flex: 3;display: flex;align-items: flex-start;padding-top: 8rpx;">
							<tui-icon :size="28" color="#dedcdc" name="voipphone" unit="rpx" margin="0 18rpx 0 0"></tui-icon>
							<view>{{ cardData.landline }}</view>
						</view>
					</view>
					<view style="display: flex;justify-content: space-between;align-items: center;">
						<view
							v-if="cardData.mailbox"
							style="flex: 2;display: flex;align-items: flex-start;padding-top: 8rpx;padding-right:14rpx;"
						>
							<tui-icon :size="28" color="#dedcdc" name="mail" unit="rpx" margin="0 18rpx 0 0"></tui-icon>
							<view>{{ cardData.mailbox }}</view>
						</view>
						<view v-if="cardData.weChatSignal" style="flex: 3;display: flex;align-items: flex-start;padding-top: 8rpx;">
							<tui-icon :size="28" color="#dedcdc" name="wechat" unit="rpx" margin="0 18rpx 0 0"></tui-icon>
							<view>{{ cardData.weChatSignal }}</view>
						</view>
					</view>
					<view v-if="cardData.personalProfile" style="display: flex;align-items: flex-start;padding-top: 8rpx;">
						<tui-icon :size="28" color="#dedcdc" name="message" unit="rpx" margin="0 18rpx 0 0"></tui-icon>
						<view>{{ cardData.personalProfile }}</view>
					</view>
					<view style="display: flex;align-items: flex-start;padding-top: 8rpx;">
						<tui-icon :size="28" color="#dedcdc" name="position" unit="rpx" margin="0 18rpx 0 0"></tui-icon>
						<view>{{ cardData.address }}</view>
					</view>
				</view>
			</view>
			<view v-else class="card-style" style="padding-bottom: 45rpx;">
				<tui-no-data :fixed="false">未设置名片样式～</tui-no-data>
			</view>
			<view v-if="isShowLabel && labelList && labelList.length" style="display: flex;flex-wrap: wrap;padding: 8rpx 0;">
				<view
					v-for="item in labelList" :key="item.labelId"
					style="margin: 8rpx 0 0 12rpx;padding: 6rpx 16rpx;border: 2rpx solid #d8d3d3;background-color: #292d3c;border-radius: 6rpx;"
				>
					{{ item.labelName }}
				</view>
			</view>
			<slot name="bottomFoot" :data="{ cardData, labelList }"></slot>
		</view>
		<view
			v-if="cardData.pictureIntroduction && cardData.pictureIntroduction.length"
			style="padding: 16rpx 16rpx 0;background-color: #e8e8e8;" :style="{ margin: introductionPicMargin }"
		>
			<view style="margin-left: 30rpx;font-size: 30rpx;font-weight: bold;">图片介绍</view>
			<view style="margin-top: 18rpx;">
				<swiper
					autoplay :interval="3000" circular :previous-margin="previousMargin"
					:next-margin="nextMargin"
					:duration="1000" style="height: 480rpx;" @change="handleSwiperChange"
				>
					<swiper-item v-for="(item, index) in cardData.pictureIntroduction.split(',')" :key="index">
						<tui-lazyload-img
							mode="scaleToFill" width="600rpx" height="100%" radius="20rpx"
							:src="common.seamingImgUrl(item)"
						></tui-lazyload-img>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<view
			v-if="cardData.isEnterprise"
			style="padding: 20rpx;margin-top: 30rpx;background-color: #2d3d5a;color: #ffffff;border-radius: 14rpx;"
		>
			<view>企业信息</view>
			<view style="margin-top: 20rpx;display: flex;justify-content: space-between;align-items: center;">
				<view style="text-align: center;">
					<image
						:src="common.seamingImgUrl(cardData.enterpriseHeadImage) || headerImg"
						style="width: 102rpx;height: 102rpx;border-radius: 50%;"
					></image>
				</view>
				<view style="flex: 1;margin-left: 28rpx;">
					<view>企业名称：{{ cardData.enterpriseName }}</view>
					<view>职务：{{ cardData.enterpriseDuties || '--' }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>

export default {
	name: 'ATFCardDisplay',
	props: {
		cardData: {
			type: Object,
			required: true
		},
		labelList: {
			type: Array,
			default: () => []
		},
		introductionPicMargin: {
			type: String,
			default: '14rpx 0 0'
		},
		isShowLabel: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			previousMargin: '0',
			nextMargin: '80rpx',
			headerImg: require('../../static/images/userimg.png')
		}
	},
	options: {
		'styleIsolation': 'shared'
	},
	methods: {
		handleSwiperChange(e) {
			if (this.$store.getters.electronicCardInfo.pictureIntroduction && this.$store.getters.electronicCardInfo.pictureIntroduction.split(',').length === 1) {
				console.log(e)
				if (e.detail.current === 1) {
					this.nextMargin = '0'
					this.previousMargin = '80rpx'
				} else {
					this.nextMargin = '80rpx'
					this.previousMargin = '0'
				}
			}
		}
	}
}
</script>

<style lang="less" scoped>
.card-display-container {
	font-size: 28rpx;
	box-sizing: border-box;

	/deep/ .card-style {
		.tui-nodata-box {
			padding-top: 60rpx;

			.tui-tips-content {
				color: #ffffff;
			}
		}
	}
}
</style>

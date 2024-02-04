<template>
	<view class="j-back-container">
		<image
			:style="{
				width: width * 1 + 'rpx',
				height: height * 1 + 'rpx'
			}" :src="dark
				? require('../../static/images/store/chevron-states.png')
				: require('../../static/images/common/back.png')
			" mode="" @click="handleBack"
		/>
	</view>
</template>

<script>
export default {
	name: 'JBack',
	props: {
		tabbar: {
			type: String
		},
		width: {
			type: [Number, String],
			default: 16
		},
		height: {
			type: [Number, String],
			default: 28
		},
		dark: Boolean
	},
	methods: {
		handleBack() {
			if (this.tabbar) {
				this.$switchTab(this.tabbar)
				return
			}
			uni.navigateBack()
		}
	}
}
</script>

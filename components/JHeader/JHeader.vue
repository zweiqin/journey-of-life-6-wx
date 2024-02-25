<template>
	<view class="j-header-container">
		<!-- #ifdef H5 || APP -->
		<JBack :width="$attrs.width" :height="$attrs.height" :tabbar="$attrs.tabbar" :dark="dark"></JBack>
		<view
			class="title" :style="{
				color: !dark ? '#fff' : ''
			}"
		>
			{{ title }}
		</view>
		<view class="footerFn">
			<slot name="ftFn"></slot>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
export default {
	name: 'JHeader',
	props: {
		dark: {
			type: Boolean,
			default: true
		},
		title: {
			type: String,
			required: true
		}
	}
}
</script>

<style lang="less" scoped>
@import "../../style/mixin.less";

.j-header-container {
	position: relative;
	// display: flex;
	// justify-content: space-between;

	.flex(center, center);

	.title {
		font-size: 32upx;
		color: #3d3d3d;
		font-weight: bold;
		// margin-top: -8upx;
		flex: 1;
		text-align: center;
		margin-left: -50upx;
	}
	.footerFn {
		position: absolute;
		right: 0rpx;
	}
}
</style>

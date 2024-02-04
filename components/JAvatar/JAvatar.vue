<template>
	<view class="j-avatar">
		<image
			:style="{
				'width': size * 1 + 'rpx',
				'height': size * 1 + 'rpx',
				'border-radius': radius.includes('%') ? radius : radius * 1 + 'rpx',
				border
			}"
			class="img"
			:src="src"
		/>
	</view>
</template>

<script>
export default {
	props: {
		src: {
			type: String,
			required: true
		},

		size: {
			type: [Number, String],
			default: 60
		},

		radius: {
			type: [Number, String],
			default: '50%'
		},

		border: {
			type: String,
			default: ''
		}
	}
}
</script>

<style lang="less" scoped>
.img {
  object-fit: cover;
}
</style>

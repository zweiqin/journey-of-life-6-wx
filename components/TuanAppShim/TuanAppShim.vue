<template>
	<view
		class="tuan-app-shim-container" :style="{
			height: (systermInfo.statusBarHeight || 0) + add * 1 + 'px',
			background: bg
		}" style="width: 100%"
	>
	</view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	name: 'TuanAppShim',
	props: {
		add: {
			type: [Number, String],
			default: 0
		},

		bg: {
			type: String,
			default: 'transparent'
		}
	},
	computed: {
		...mapGetters([ 'systermInfo' ])
	}
}
</script>

<style lang="less">
.tuan-app-shim-container {}
</style>

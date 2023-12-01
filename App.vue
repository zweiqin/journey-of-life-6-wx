<style lang="scss">
	@import "uview-ui/index.scss";
</style>
<script>
	import {
		request
	} from '@/common/js/request'
	export default {
		onLaunch: function(options) {
			console.log('App Launch')
			console.log('options Launch', options)
			uni.setStorageSync('options', options);
			if (options.query.id)
				uni.setStorageSync('id', options.query.id);
			const logged = uni.getStorageSync('logged');
			if (!logged) {
				uni.navigateTo({
					url: "/pages/login"
				})
			}
		},
		onShow: function(options) {
			if (options.query.id)
				uni.setStorageSync('id', options.query.id);
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {

		}
	}
</script>

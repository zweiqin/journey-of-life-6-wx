<script>
import { USER_INFO } from './constant'

export default {
	name: 'App',
	onLaunch(options) {
		if (!uni.getStorageSync(USER_INFO)) {
			uni.navigateTo({
				url: '/pages/login/login'
			})
		}
	},
	onShow(options) {
	},
	onHide() {
	},
	methods: {
	}
}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
</style>

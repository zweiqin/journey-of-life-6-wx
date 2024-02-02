export default (options) => {
	const {
		api,
		mapKey = { listTotal: 'total', list: 'list', pageSize: 'pageSize' },
		beforeFn,
		afterFn,
		callingcb,
		beforeReachBottomfn,
		afterReachBottomfn,
		dataFn
	} = options

	return {
		data() {
			return {
				_query: {
					page: 1,
					[mapKey.pageSize]: 20
				},
				_listTotal: 0,
				_list: [],
				_isEmpty: false
			}
		},

		methods: {
			async _loadData(isLoadmore, cb) {
				let res = null
				try {
					if (beforeFn && typeof beforeFn === 'function' && beforeFn()) {
						res = await api(this.$data._query)
					} else {
						res = await api(this.$data._query)
					}

					this.$data._listTotal = res.data[mapKey.listTotal] || 0
					if (isLoadmore) {
						this.$data._list = [
							...this.$data._list,
							...dataFn
								? dataFn(res.data[mapKey.list] || [])
								: res.data[mapKey.list] || []
						]
					} else {
						this.$data._list = dataFn
							? dataFn(res.data[mapKey.list] || [])
							: res.data[mapKey.list] || []
					}
					this.$data._isEmpty = this.$data._list.length === 0

					!isLoadmore && afterFn && typeof afterFn === 'function' && afterFn()
					!isLoadmore && callingcb && cb && typeof cb === 'function' && cb()
					isLoadmore && cb && typeof cb === 'function' && cb()
				} catch (error) {
					this.$data._isEmpty = true
					console.log('报错了', error)
				}
			}
		},

		onReachBottom() {
			if (
				beforeReachBottomfn &&
				typeof beforeReachBottomfn === 'function' &&
				!beforeReachBottomfn()
			) {
				return
			}

			if (this.$data._list.length < this.$data._listTotal) {
				++this.$data._query.page
				this._loadData(true, afterReachBottomfn)
			}
		},

		onPageScroll(e) {
			this.$data._scrollTop = e.scrollTop
		}
	}
}

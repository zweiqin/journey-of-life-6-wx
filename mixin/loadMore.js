export default (options) => {
  const {
    api,
    mapKey = { totalPages: "totalPages", list: "goodsList", size: "size" },
    beforeFn,
    afterFn,
    beforeReachBottomfn,
    afterReachBottomfn,
    dataFn,
  } = options;

  return {
    data() {
      return {
        _query: {
          page: 1,
          [mapKey.size]: 20,
        },
        _status: "none",
        _totalPages: 0,
        _list: [],
        _scrollTop: 0,
      };
    },

    methods: {
      async _loadData(isLoadmore, cb) {
        try {
          let res = null;
          this.$data._status = "loading";
          if (beforeFn && typeof beforeFn === "function" && beforeFn()) {
            res = await api(this.$data._query);
          } else {
            res = await api(this.$data._query);
          }


          this.$data._totalPages = res.data[mapKey.totalPages];
          if (isLoadmore) {
            this.$data._list = [
              ...this.$data._list,
              ...(dataFn ? dataFn.bind(this)(res.data[mapKey.list]) : res.data[mapKey.list]),
            ];
          } else {
            this.$data._list = dataFn
              ? dataFn.bind(this)(res.data[mapKey.list])
              : res.data[mapKey.list];
          }

          // console.log("list数据", this.$data._list);

          !isLoadmore && afterFn && typeof afterFn === "function" && afterFn();
          isLoadmore && cb && typeof cb === "function" && cb();
          // console.log(this.$data._list)
        } catch (error) {
          console.log("报错了", error);
        } finally {
          this.$data._status = "none";
        }
      },
    },

    onReachBottom() {
      if (
        beforeReachBottomfn &&
        typeof beforeReachBottomfn === "function" &&
        !beforeReachBottomfn()
      ) {
        return;
      }

      if (this.$data._query.page >= this.$data._totalPages) {
        this.$data._status = "no-more";
        return;
      }

      if (this.$data._query[mapKey.size] > this.$data._list.length) {
        this.$data._status = "none";
        return;
      }

      this.$data._query.page++;
      this._loadData(true, afterReachBottomfn);
    },

    onPageScroll(e) {
      this.$data._scrollTop = e.scrollTop;
    },
  };
};

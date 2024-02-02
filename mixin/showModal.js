export default () => {
  return {
    data() {
      return {
        _isShowTuiModel: false,
        _opInfo: null
      };
    },
    methods: {
      _handleClickTuiModel(e, cb, backUrl) {
        this.$data._isShowTuiModel = false;
        if (e.index) {
          if (typeof cb === 'string') {
            switch (cb) {
              case 'login':
                let url = '/pages/login/login';
                if (backUrl) {
                  url = '/pages/login/login?to=' + backUrl;
                }
                uni.navigateTo({
                  url
                });
                break;
            }
            return;
          } else {
            this.$data._isShowTuiModel = false;
            // 当点击了确定时触发执行回调
            cb && typeof cb === 'function' && cb(this.$data._opInfo);
          }
        } else {
          this.$data._isShowTuiModel = false;
        }
        this.$data._opInfo = null;
      }
    }
  };
};

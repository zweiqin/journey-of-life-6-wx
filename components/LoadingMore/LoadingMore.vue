<template>
  <view
    class="loading-more-container"
    v-show="['loading', 'no-more'].includes(status)"
  >
    <div id="loading-wrapper" v-show="status === 'loading'">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>

    <view class="no-more" v-show="status === 'no-more'">{{ text }}</view>
  </view>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      default: 'loading',
      validate(value) {
        if (!['loading', 'no-more'].includes(value)) {
          console.warn('loading的取值必须是loading或者no-more')
        }
        return true
      },
    },

    text: {
      type: String,
      default: '没有更多了',
    },
  },

  watch: {
    status(value) {
      // console.log(value)
    },
  },
}
</script>

<style lang="less" scoped>
.loading-more-container {
  width: 100%;
  height: 120upx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dot {
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background: #ffc117;
  float: left;
  margin: 0 3px;
  animation: dot linear 1s infinite;
  -webkit-animation: dot linear 1s infinite;
}
.dot:nth-child(1) {
  animation-delay: 0s;
}
.dot:nth-child(2) {
  animation-delay: 0.15s;
}
.dot:nth-child(3) {
  animation-delay: 0.3s;
}
.dot:nth-child(4) {
  animation-delay: 0.45s;
}
.dot:nth-child(5) {
  animation-delay: 0.6s;
}
@keyframes dot {
  0%,
  60%,
  100% {
    transform: scale(1);
  }
  30% {
    transform: scale(2.5);
  }
}
@-webkit-keyframes dot {
  0%,
  60%,
  100% {
    transform: scale(1);
  }
  30% {
    transform: scale(2.5);
  }
}

.no-more {
  color: #ccc;
}
</style>

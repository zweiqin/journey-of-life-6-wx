<template>
  <view class="icon-container" @click="$emit('click')">
    <image
      :src="src"
      :style="{
        width: width ? width : size * 2 + 'rpx',
        height: width ? height : size * 2 + 'rpx',
      }"
      v-if="src"
      mode=""
    />

    <tui-icon
      v-if="name"
      :name="name"
      :color="color"
      :size="size"
    ></tui-icon>
  </view>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: '',
    },

    name: {
      type: String,
      default: '',
    },

    size: {
      type: Number,
      default: 20,
    },

    color: {
      type: String,
      default: '#ccc',
    },

    width: {
      type: String,
      default: '',
    },

    height: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="less" scoped>
.icon-container {
  flex-shrink: 0;
  line-height: inherit;

  image {
    vertical-align: middle;
  }
}
</style>

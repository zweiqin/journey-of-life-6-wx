<template>
  <view class="avatar-container" @click="$emit('click')">
    <image
		
      :src="src"
      :mode="mode"
      :style="{
        borderRadius: radius * 2 + 'rpx',
        width: size * 2 + 'rpx',
        height: size * 2 + 'rpx',
        margin: margin,
      }"
    />
  </view>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true,
    },

    radius: {
      type: Number,
      default: 100,
    },

    mode: {
      type: String,
    },

    size: {
      type: Number,
      default: 60,
    },

    margin: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.avatar-container {
  image {
    flex-shrink: 0;
  }
}
</style>

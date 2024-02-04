<template>
  <image
    @click="$emit('click')"
    v-if="iconUrl"
    :style="{
      width: width + 'rpx',
      height: height + 'rpx',
    }"
    :src="iconUrl"
    mode=""
    class="j-icon"
  />
</template>

<script>
import { types } from "./icons";

export default {
  props: {
    type: {
      type: String,
      required: true,
    },

    width: [String, Number],
    height: [String, Number],
  },

  computed: {
    iconUrl() {
      return types[this.type];
    },
  },
};
</script>
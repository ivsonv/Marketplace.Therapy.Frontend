<template>
  <div class="main-view">
    <video-twilio-client v-if="videotwilioclient" />
    <video-sdk-client v-if="videosdkclient" />
  </div>
</template>
<script>
import videotwilio from "./video-twilio-client.vue";
import videosdk from "./videosdk-client.vue";
export default {
  components: {
    "video-twilio-client": videotwilio,
    "video-sdk-client": videosdk,
  },
  data() {
    return {
      videosdkclient: false,
      videotwilioclient: false,
    };
  },
  created() {},
  methods: {},
};
</script>

<style lang="scss">
.main-view {
  min-height: 100vh;
}
</style>
<template>
  <div class="main-view">
    <h1 v-if="loading">caregando...<spinner--c /></h1>
    <h2 v-if="msg">{{ msg }}</h2>
    <video-twilio-client
      v-if="videotwilioclient"
      :room_id="room_id"
      :room_name="room_name"
    />
    <video-sdk-client
      v-if="videosdkclient"
      :room_id="room_id"
      :room_name="room_name"
    />
  </div>
</template>
<script>
import _customerService from "@/services/account-customer-service";
import _providerService from "@/services/account-provider-service";

import videotwilio from "./video-twilio-client.vue";
import videosdk from "./videosdk-client.vue";
export default {
  components: {
    "video-twilio-client": videotwilio,
    "video-sdk-client": videosdk,
  },
  data() {
    return {
      room_id: 0,
      room_name: "",
      videosdkclient: false,
      videotwilioclient: false,
      loading: false,
      msg: "",
    };
  },
  created() {
    this.checkAppointment();
  },
  methods: {
    checkAppointment() {
      const _conference =
        this.$route.params.paciente === "sim"
          ? _customerService.conference(this.$route.params.id)
          : _providerService.conference(this.$route.params.id);

      this.loading = true;
      _conference
        .then((res) => {
          this.room_name = res.content.appointment.room_name;
          this.room_id = res.content.appointment.room_id;
          this.videosdkclient = true;
        })
        .catch((error) => {
          this.$utils.toastError("Notificação", error);
          this.msg = error;
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style lang="scss">
.main-view {
  min-height: 100vh;
}
</style>
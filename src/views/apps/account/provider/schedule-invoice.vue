<template>
  <view--c permission="account.provider" :busy="isloading">
    <v-invoice :appointment="appointment" v-if="!isloading" />
  </view--c>
</template>

<script>
import _providerService from "@/services/account-provider-service";
import invoice from "@/views/apps/account/invoice/index.vue";
export default {
  components: {
    "v-invoice": invoice,
  },
  data() {
    return {
      isloading: true,
      appointment: null,
    };
  },
  destroyed() {
    this.$destroy();
  },
  created() {
    this.getAppointment();
  },
  methods: {
    getAppointment() {
      this.isloading = true;
      _providerService
        .invoice(this.$route.params.id)
        .then((res) => {
          this.appointment = res.content.appointment;
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
  },
};
</script>
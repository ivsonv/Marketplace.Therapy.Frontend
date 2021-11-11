<template>
  <view--c permission="account.customer" :busy="isloading">
    <v-invoice :appointment="appointment" v-if="!isloading" />
  </view--c>
</template>

<script>
import _customerService from "@/services/account-customer-service";
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
      _customerService
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
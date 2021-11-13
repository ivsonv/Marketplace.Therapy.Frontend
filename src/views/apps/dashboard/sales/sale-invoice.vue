<template>
  <view--c :busy="isloading" permission="dashboard.view">
    <v-invoice :appointment="appointment" v-if="!isloading" />
  </view--c>
</template>

<script>
import _dashboardService from "@/services/dashboard-service";
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
      _dashboardService
        .invoice(this.$route.params.id)
        .then((res) => {
          this.appointment = res.content;
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
  },
};
</script>
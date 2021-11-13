<template>
  <view--c permission="account.customer" :busy="isloading"> </view--c>
</template>

<script>
import _customerService from "@/services/account-customer-service";
export default {
  data() {
    return {
      isloading: false,
    };
  },
  destroyed() {
    this.$destroy();
  },
  created() {
    this.finishAppointment();
  },
  methods: {
    finishAppointment() {
      // registrar saida
      _customerService
        .finish(this.$route.params.id)
        .then((res) => {})
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));

      // mostrar alerta.
      this.$swal({
        title: "Sessão Finalizada!",
        text: "Ficamos muito feliz de voce ter chegado até aqui.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-info",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.$router.push({ name: "home-view" });
        }
      });
    },
  },
};
</script>
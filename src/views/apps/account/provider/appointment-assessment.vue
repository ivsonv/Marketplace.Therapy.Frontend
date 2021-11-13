<template>
  <view--c permission="account.provider" :busy="isloading"> </view--c>
</template>

<script>
import _accountProviderService from "@/services/account-provider-service";
export default {
  data() {
    return {
      isloading: true,
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
          // registrar saida
          _accountProviderService
            .finish(this.$route.params.id)
            .then((res) => {
              this.$router.push({ name: "home-view" });
            })
            .catch((error) => this.$utils.toastError("Notificação", error))
            .finally(() => (this.isloading = false));
        }
      });
    },
  },
};
</script>
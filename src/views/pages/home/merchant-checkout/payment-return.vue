<template>
  <div class="main-view">
    <h1 v-if="loading">Finalizando...<spinner--c /></h1>
  </div>
</template>

<script>
import HomeHeader from "../components/home-header";
import _paymentService from "@/services/payment-service";
export default {
  components: {
    "header--v": HomeHeader,
  },
  data() {
    return {
      loading: false,
    };
  },
  created() {
    this.paymentResults();
  },
  methods: {
    paymentResults() {
      const payload = {
        token: this.$route.query.paymentToken,
        code: this.$route.query.code,
      };

      this.loading = true;
      _paymentService
        .consult(payload)
        .then((res) => {
          this.$swal({
            title: "Pagamento Confirmado!",
            text: "Você sera redirecionado para a sua conta.",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "btn btn-primary",
            },
            buttonsStyling: false,
          })
            .then(() => {
              this.paymentRedirect();
            })
            .finally(() => this.paymentRedirect());
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    paymentRedirect() {
      this.$router.push({
        name: `sou-paciente-appointments`,
      });
    },
  },
};
</script>

<style lang="scss">
.main-view {
  min-height: 100vh;
}
</style>